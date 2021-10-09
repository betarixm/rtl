# Generated by Django 3.2.7 on 2021-10-07 12:37

import client.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.CharField(max_length=8, primary_key=True, serialize=False, validators=[client.models.validate_student_id], verbose_name='학번')),
                ('name', models.CharField(max_length=1000, verbose_name='이름')),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, verbose_name='전화번호')),
                ('last_access_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='마지막 접속 시간')),
            ],
            options={
                'verbose_name': '클라이언트',
                'verbose_name_plural': '클라이언트들',
            },
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_access_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='마지막 접속 시간')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='client.client')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.event')),
            ],
            options={
                'verbose_name': '티켓',
                'verbose_name_plural': '티켓들',
            },
        ),
    ]