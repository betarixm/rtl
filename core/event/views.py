from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import JsonResponse
from django.utils.timezone import now

from datetime import timedelta

from client.models import Ticket, Client
from .models import Event


class DrawView(View):
    def get(self, request, event_id):
        get_object_or_404(Event, id=event_id)

        client_id = Ticket.valid_tickets(event_id).order_by("?").first()['client__id']
        client = Client.objects.get(id=client_id)

        if client is None:
            return JsonResponse({"success": False, "error": "유효한 참여자 없음"}, status=404)

        return JsonResponse(
            {
                "success": True,
                "client": {
                    "id": client.id,
                    "phone_number": client.phone_number.as_e164,
                    "name": client.name,
                },
            }
        )


class EventView(View):
    def get(self, request, event_id):
        event = Event.objects.filter(id=event_id).first()

        if event is None:
            return JsonResponse({"success": False})
        else:
            return JsonResponse({"success": True})
