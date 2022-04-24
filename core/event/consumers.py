import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import channels.layers

from asgiref.sync import async_to_sync
from time import sleep

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

    @staticmethod
    def produce():
        while True:
            for event_id in [e["id"] for e in Event.objects.values("id")]:
                layer = channels.layers.get_channel_layer()
                async_to_sync(layer.group_send)(
                    f"event_{event_id}",
                    {"type": "event_number", "message": event_id},
                )
            sleep(1)

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
            text_data=json.dumps({"numbers": await _get_number_of_ticket(event_id)})
        )
