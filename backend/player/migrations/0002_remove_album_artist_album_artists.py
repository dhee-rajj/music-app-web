# Generated by Django 5.1 on 2024-08-26 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('player', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='album',
            name='artist',
        ),
        migrations.AddField(
            model_name='album',
            name='artists',
            field=models.ManyToManyField(related_name='albums', to='player.artist'),
        ),
    ]
