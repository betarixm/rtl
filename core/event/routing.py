# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('ws/event/<event_id>/<client_id>/', consumers.EventConsumer.as_asgi()),
]
