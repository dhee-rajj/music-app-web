from django.db import models
from player.models import Artist  # Assuming your existing app is named 'player'

class Contract(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    terms = models.TextField()
    signed_date = models.DateField(null=True, blank=True, auto_now_add=True)