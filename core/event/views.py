from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import JsonResponse
from django.utils.timezone import now

from datetime import timedelta

from client.models import Ticket
from .models import Event


class DrawView(View):
    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        ticket = (
            Ticket.objects.filter(
                event_id=event.id, last_access_at__gte=now() - timedelta(seconds=15)
            )
            .order_by("?")
            .first()
        )

        if ticket is None:
            return JsonResponse({"success": False, "error": "유효한 참여자 없음"}, status=404)

        return JsonResponse({"success": True, "client": {
            "id": ticket.client.id,
            "phone_number": ticket.client.phone_number.as_e164,
            "name": ticket.client.name
        }})
