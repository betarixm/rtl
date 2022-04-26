from time import sleep
from asgiref.sync import async_to_sync
from event.models import Event
from client.models import Client

import channels.layers


class EventProducer:
    @staticmethod
    def periodic_send_number():
        while True:
            for event_id in [e["id"] for e in Event.objects.values("id")]:
                layer = channels.layers.get_channel_layer()
                async_to_sync(layer.group_send)(
                    f"event_{event_id}",
                    {"type": "event_number", "message": event_id},
                )
            sleep(1)

    @staticmethod
    def send_draw_result(client: Client, event: Event):
        layer = channels.layers.get_channel_layer()
        async_to_sync(layer.group_send)(
            f"event_{event.id}",
            {"type": "event_draw_result", "client_name": client.name,
             "client_phone_number": client.phone_number.as_e164},
        )
