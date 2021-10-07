from django.contrib import admin
from .models import Client, Ticket


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    pass


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    pass
