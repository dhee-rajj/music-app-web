from django.contrib import admin
from .models import Artist, Album, Track, Playlist

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_artists')
    search_fields = ('title', 'artists__name')
    list_filter = ('artists',)

    def get_artists(self, obj):
        return ", ".join([artist.name for artist in obj.artists.all()])
    get_artists.short_description = 'Artists'
    
@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'album', 'duration')
    search_fields = ('title', 'album__title')
    list_filter = ('album',)

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('tracks',)