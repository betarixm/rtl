import json
import asyncio

from django.utils.timezone import now
from django.db import transaction

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from datetime import timedelta

from client.models import Client, Ticket

from .models import Event


@database_sync_to_async
def _get_event(_event_id: str):
    return Event.objects.filter(id=_event_id).first()


@database_sync_to_async
def _get_client(_client_id: str):
    return Client.objects.filter(id=_client_id).first()


@database_sync_to_async
@transaction.atomic
def _update_client(_client: Client):
    _client.last_access_at = now()
    _client.save()


@database_sync_to_async
@transaction.atomic
def _create_ticket(_client: Client, _event: Event):
    ticket = Ticket.objects.create(client=_client, event=_event)
    ticket.save()

    return ticket


@database_sync_to_async
@transaction.atomic
def _get_ticket(_client: Client, _event: Event):
    return Ticket.objects.filter(client__id=_client.id, event__id=_event.id).first()


@database_sync_to_async
@transaction.atomic
def _update_ticket(ticket: Ticket):
    ticket.last_access_at = now()
    ticket.save()


@database_sync_to_async
@transaction.atomic
def _remove_ticket(ticket: Ticket):
    ticket.delete()


@database_sync_to_async
@transaction.atomic
def _get_number_of_ticket(_event_id: str):
    return len(Ticket.valid_tickets(_event_id))


class EventConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

        self.event_group_name = ""
        self.last_send_at = {}
        self.event_id = ""

    async def connect(self):
        event_id = self.scope["url_route"]["kwargs"]["event_id"]
        client_id = self.scope["url_route"]["kwargs"]["client_id"]
        self.event_group_name = f"event_{event_id}"
        self.event_id = event_id

        client = await _get_client(client_id)
        event = await _get_event(event_id)

        if client is not None and event is not None:
            ticket = await _get_ticket(client, event)

            if ticket is None:
                ticket = await _create_ticket(client, event)

            await _update_ticket(ticket)

            await self.channel_layer.group_add(self.event_group_name, self.channel_name)
            await self.accept()

            await self.channel_layer.group_send(
                self.event_group_name,
                {"type": "event_number", "message": event_id},
            )

        else:
            await self.disconnect(404)

    async def disconnect(self, close_code):
        event_id = self.scope["url_route"]["kwargs"]["event_id"]
        client_id = self.scope["url_route"]["kwargs"]["client_id"]

        client = await _get_client(client_id)
        event = await _get_event(event_id)

        if client is not None and event is not None:
            ticket = await _get_ticket(client, event)

            if ticket is not None:
                await _remove_ticket(ticket)

        await self.channel_layer.group_send(
            self.event_group_name,
            {"type": "event_number", "message": event_id},
        )

        await self.channel_layer.group_discard(self.event_group_name, self.channel_name)

    async def receive(self, text_data):
        event_id: str = json.loads(text_data)["event"]
        client_id: str = json.loads(text_data)["id"]

        client = await _get_client(client_id)
        event = await _get_event(event_id)

        if client is None:
            await self.channel_layer.group_send(
                self.event_group_name,
                {"type": "event_error", "message": f"Client not found: {client_id}"},
            )
        elif event is None:
            await self.channel_layer.group_send(
                self.event_group_name,
                {"type": "event_error", "message": f"Event not found: {event_id}"},
            )
        else:
            ticket: Ticket = await _get_ticket(client, event)

            if ticket is None:
                await self.channel_layer.group_send(
                    self.event_group_name,
                    {
                        "type": "event_error",
                        "message": f"Ticket not found: {client_id}, {event_id}",
                    },
                )

            else:
                await _update_ticket(ticket)
                await _update_client(client)

    async def event_error(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"error": message}))

    async def event_number(self, event):
        event_id = event["message"]

        await self.send(
            text_data=json.dumps({"numbers": await _get_number_of_ticket(event_id)})
        )
