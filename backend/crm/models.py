from django.db import models
from django.conf import settings

class Ticket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    issue = models.TextField()
    response = models.TextField(blank=True, null=True)
    is_solved = models.BooleanField(default=False)