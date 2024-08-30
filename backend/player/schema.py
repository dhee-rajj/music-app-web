import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from .models import Artist, Album, Track, Playlist
from mutagen.mp3 import MP3
from django.core.files.base import ContentFile

class UserType(DjangoObjectType):
    class Meta:
        model = User

class ArtistType(DjangoObjectType):
    class Meta:
        model = Artist

class AlbumType(DjangoObjectType):
    class Meta:
        model = Album

class TrackType(DjangoObjectType):
    class Meta:
        model = Track

    duration  = graphene.String()
    image = graphene.String()

    def resolve_image(self, info):
        return self.image.url if self.image else None

    def resolve_duration(self, info):
        if self.duration:
            total_seconds = int(self.duration.total_seconds())
            minutes, seconds = divmod(total_seconds, 60)
            return f"{minutes}m {seconds}s"
        return None

class PlaylistType(DjangoObjectType):
    class Meta:
        model = Playlist

class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    all_artists = graphene.List(ArtistType)
    all_albums = graphene.List(AlbumType)
    all_tracks = graphene.List(TrackType)
    all_playlists = graphene.List(PlaylistType)
    track_by_title = graphene.Field(TrackType, title=graphene.String(required=True))

    def resolve_all_users(self, info):
        return User.objects.all()

    def resolve_all_artists(self, info):
        return Artist.objects.all()
    
    def resolve_all_albums(self, info):
        return Album.objects.all()
    
    def resolve_all_tracks(self, info):
        return Track.objects.all()
    
    def resolve_all_playlists(self, info):
        return Playlist.objects.all()
    
    def resolve_track_by_title(self, info, title):
        try:
            return Track.objects.get(title=title)
        except Track.DoesNotExist:
            raise Exception("Track not found")

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = User(username=user)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)
    
class AddTrackToLiked(graphene.Mutation):
    playlist = graphene.Field(PlaylistType)

    class Arguments:
        username = graphene.String(required=True)
        track_id = graphene.Int(required=True)

    def mutate(self, info, username, track_id):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Exception("User not found")

        try:
            track = Track.objects.get(id=track_id)
        except Track.DoesNotExist:
            raise Exception("Track not found")

        # Check if the "Liked Tracks" playlist exists
        playlist, created = Playlist.objects.get_or_create(
            user=user, name="Liked Tracks"
        )

        # Add the track to the playlist if it's not already added
        if track not in playlist.tracks.all():
            playlist.tracks.add(track)
            playlist.save()

        return AddTrackToLiked(playlist=playlist)

class UploadTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String(required=True)
        album_title = graphene.String(required=True)
        file = graphene.String(required=True)
    
    def mutate(self, info, title, album_title, file):
        # Find the album by title
        try:
            album = Album.objects.get(title=album_title)
        except Album.DoesNotExist:
            raise Exception("Album not found")

        # Decode the base64 file content
        file_content = ContentFile(base64.b64decode(file), name=title + '.mp3')

        # Calculate the duration using mutagen
        audio = MP3(file_content)
        duration = int(audio.info.length)

        # Save the track
        track = Track(title=title, album=album, duration=duration, file=file_content)
        track.save()

        return UploadTrack(track=track)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    upload_track  = UploadTrack.Field()
    add_track_to_liked = AddTrackToLiked.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)