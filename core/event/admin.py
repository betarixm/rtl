from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    def id_hex(self, obj: Event):
        return obj.id.hex

    readonly_fields = ("id_hex", )
