import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from client.models import Client, Ticket
from .models import Event


@database_sync_to_async
def _get_event(_event_id: str):
    return Event.objects.filter(id=_event_id).first()


@database_sync_to_async
def _get_client(_client_id: str):
    return Client.objects.filter(id=_client_id).first()


@database_sync_to_async
def _create_ticket(_client: Client, _event: Event):
    Ticket.objects.create(client=_client, event=_event)


@database_sync_to_async
def _get_number_of_ticket(_event_id: str):
    return Ticket.valid_tickets(_event_id).count()


class EventConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

        self.last_send_at = {}

    async def connect(self):
        event_id = self.scope["url_route"]["kwargs"]["event_id"]
        client_id = self.scope["url_route"]["kwargs"]["client_id"]
        event_group_name: str = f"event_{event_id}"

        client = await _get_client(client_id)
        event = await _get_event(event_id)

        if client is not None and event is not None:
            await _create_ticket(client, event)

            await self.channel_layer.group_add(event_group_name, self.channel_name)
            await self.accept()

        else:
            await self.disconnect(404)

    async def disconnect(self, close_code):
        event_id = self.scope["url_route"]["kwargs"]["event_id"]
        event_group_name: str = f"event_{event_id}"

        await self.channel_layer.group_discard(event_group_name, self.channel_name)

    async def receive(self, text_data):
        event_id: str = json.loads(text_data)["event"]
        client_id: str = json.loads(text_data)["id"]

        client = await _get_client(client_id)
        event = await _get_event(event_id)

        if client is None:
            await self.channel_layer.send(
                self.channel_name,
                {"type": "event_error", "message": f"Client not found: {client_id}"},
            )
        elif event is None:
            await self.channel_layer.send(
                self.channel_name,
                {"type": "event_error", "message": f"Event not found: {event_id}"},
            )
        else:
            await _create_ticket(client, event)

    async def event_error(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"error": message}))

    async def event_number(self, event):
        event_id = event["message"]

        await self.send(
            text_data=json.dumps({"type": "event_number", "numbers": await _get_number_of_ticket(event_id)})
        )

    async def event_draw_result(self, event):
        client_name = event["client_name"]
        client_phone_number = event["client_phone_number"][-4:]

        await self.send(
            text_data=json.dumps({"type": "event_draw_result", "name": client_name, "phone_number": client_phone_number})
        )
