from django.db import models
from django.core.validators import RegexValidator

validate_alphanumeric = RegexValidator(r"^[0-9a-zA-Z]*$", "알파벳과 숫자만 이용해주세요.")


class Event(models.Model):
    id = models.CharField(primary_key=True, max_length=100, validators=[validate_alphanumeric])
    title = models.CharField("제목", max_length=100)

    class Meta:
        verbose_name = "이벤트"
        verbose_name_plural = "이벤트들"

    def __str__(self):
        return self.title
