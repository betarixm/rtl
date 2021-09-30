from django.db import models

import uuid


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField("제목", max_length=100)

    class Meta:
        verbose_name = "이벤트"
        verbose_name_plural = "이벤트들"

    def __str__(self):
        return self.title

