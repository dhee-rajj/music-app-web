import {useQuery, gql} from "@apollo/client";
import '../Styles/MusicList.css';

const GET_TRACKS = gql`
  query {
    allTracks {
      title
      file
      image
      artist {
        name
      }
      album {
        title
      }
    }
  }
`;

const MusicList = () => {
  const { loading, error, data } = useQuery(GET_TRACKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div  className="music-list">
      {data.allTracks.map((track) => (
        <div key={track.title} className="music">
          <img src={`http://localhost:8000/${track.image}`} />
          <h3>{track.title}</h3>
          <p>{track.album.title}</p>
          <p>{track.artist.name}</p>
          <audio controls>
            <source src={`http://localhost:8000/media/${track.file}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default MusicList