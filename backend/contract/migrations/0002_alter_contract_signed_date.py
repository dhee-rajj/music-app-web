# Generated by Django 5.1 on 2024-09-01 11:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contract', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contract',
            name='signed_date',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]
