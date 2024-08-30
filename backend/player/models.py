from django.db import models
from mutagen.mp3 import MP3
from datetime import timedelta


# Create your models here.
class Artist(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=50)
    artists = models.ManyToManyField(Artist, related_name="albums")
    image = models.ImageField(upload_to='albums/', null=True, blank=True)

    def __str__(self):
        return self.title
    
class Track(models.Model):
    title = models.CharField(max_length=50)
    album = models.ForeignKey(Album, related_name="tracks", on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, related_name="artist", on_delete=models.DO_NOTHING, null=True)
    duration = models.DurationField(null=True, blank=True)
    file = models.FileField(upload_to='tracks/', null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.file:
            file_path = self.file.path
            if file_path.endswith('.mp3'):
                audio = MP3(file_path)
            else:
                audio = None

            if audio:
                self.duration = timedelta(seconds=audio.info.length)
                super().save(update_fields=['duration'])
    
    @property
    def image(self):
        return self.album.image

    def __str__(self):
        return self.title
    
    
class Playlist(models.Model):
    name = models.CharField(max_length=50)
    tracks = models.ManyToManyField(Track)

    def __str__(self):
        return self.name