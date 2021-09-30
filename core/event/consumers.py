import json

from django.utils.timezone import now
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from client.models import Client

from .models import Event


class EventConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

        self.event_id = ""
        self.event_group_name = ""

    async def connect(self):
        @database_sync_to_async
        def _get_event(_event_id: str):
            return Event.objects.filter(id=_event_id).first()

        self.event_id = self.scope["url_route"]["kwargs"]["event_id"]
        self.event_group_name = f"event_{self.event_id}"

        await self.channel_layer.group_add(self.event_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.event_group_name, self.channel_name)

    async def receive(self, text_data):
        @database_sync_to_async
        def _get_client(_client_id: str):
            return Client.objects.filter(id=_client_id).first()

        @database_sync_to_async
        def _update_client(_client: Client):
            _client.last_access_at = now()
            _client.save()

        client_id: str = json.loads(text_data)["id"]

        client = await _get_client(client_id)

        if client is None:
            await self.channel_layer.group_send(
                self.event_group_name,
                {"type": "event_error", "message": f"Client not found: {client_id}"},
            )
        else:
            await _update_client(client)

    async def event_error(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"error": message}))
