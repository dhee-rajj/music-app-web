import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client'; // Adjust the import path as needed
import {gql} from "@apollo/client";
import '../Styles/SearchTrack.css'

const SEARCH_TRACK_BY_TITLE = gql`
  query SearchTrackByTitle($title: String!) {
    trackByTitle(title: $title) {
      title
      file
      artist {
        name
      }
      album {
        title
      }
    }
  }
`;

const SearchTrack = () => {
  const [title, setTitle] = useState('');
  const [searchTrack, { loading, data, error }] = useLazyQuery(SEARCH_TRACK_BY_TITLE);

  const handleSearch = () => {
    searchTrack({ variables: { title } });
  };

  return (
    <div className='search-bar'>
      <h1>Search Track</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter track title"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p className='search-error'>Error: {error.message}</p>}
      {data && data.trackByTitle && (
        <div className='search-details'>
          <h2>{title} Track Details</h2>
          <p>Title: {data.trackByTitle.title}</p>
          <p>Album: {data.trackByTitle.album.title}</p>
          <p>Artist: {data.trackByTitle.artist.name}</p>
          <audio controls>
            <source src={`http://localhost:8000/media/${data.trackByTitle.file}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default SearchTrack;