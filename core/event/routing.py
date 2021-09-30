# chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/event/(?P<event_id>\w+)/$', consumers.EventConsumer.as_asgi()),
]
