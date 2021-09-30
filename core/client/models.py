from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from phonenumber_field.modelfields import PhoneNumberField


def validate_student_id(value):
    try:
        int(value)
    except ValueError:
        raise ValidationError(_("학번을 올바른 형식으로 입력해주세요."))

    if len(value) != 8:
        raise ValidationError(_("학번을 올바른 형식으로 입력해주세요."))

    if Client.objects.filter(id=value).first() is not None:
        raise ValidationError(_("해당 학번은 이미 등록되어 있습니다."))


class Client(models.Model):

    id = models.CharField(
        "학번",
        max_length=8,
        primary_key=True,
        null=False,
        blank=False,
        validators=[validate_student_id],
    )
    name = models.CharField("이름", max_length=1000, null=False, blank=False)
    phone_number = PhoneNumberField("전화번호", null=False, blank=False)
    last_access_at = models.DateTimeField(
        "마지막 접속 시간", default=now, null=False, blank=False
    )

    def clean(self):
        validate_student_id(self.id)

    class Meta:
        verbose_name = "클라이언트"
        verbose_name_plural = "클라이언트들"

    def __str__(self):
        return self.id
