# Generated by Django 3.2.7 on 2021-10-08 04:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='remove_on_disconnect',
            field=models.BooleanField(default=True, verbose_name='치밀한 실시간 집계'),
            preserve_default=False,
        ),
    ]