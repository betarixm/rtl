# Generated by Django 3.2.7 on 2022-04-24 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0002_event_remove_on_disconnect'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='id',
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
    ]