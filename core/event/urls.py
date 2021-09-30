from django.urls import path
from django.contrib.admin.views.decorators import staff_member_required

from . import views

urlpatterns = [
    path("draw/<event_id>", staff_member_required(views.DrawView.as_view()), name="draw"),
    path("check/<event_id>", views.EventView.as_view(), name="event")
]
