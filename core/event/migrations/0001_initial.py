# Generated by Django 3.2.7 on 2021-10-07 12:37

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100, verbose_name='제목')),
            ],
            options={
                'verbose_name': '이벤트',
                'verbose_name_plural': '이벤트들',
            },
        ),
    ]