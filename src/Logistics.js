import { useState, useEffect } from 'react';

function Logistics({ token }) {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('short_term');
  const [displayType, setDisplayType] = useState('tracks');

  useEffect(() => {
    const fetchTopTracks = async () => {
      const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await response.json();
      setTopTracks(data.items);
    };

    const fetchTopArtists = async () => {
      const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await response.json();
      setTopArtists(data.items);
    };

    if (displayType === 'tracks') {
      fetchTopTracks();
    } else if (displayType === 'artists') {
      fetchTopArtists();
    }
  }, [token, timeRange, displayType]);

  const handleDisplayTypeChange = (type) => {
    setDisplayType(type);
  };

  return (
    <div className="logistics-container">
      <div className="display-options">
        <button onClick={() => setDisplayType('tracks')} className={`display-option ${displayType === 'tracks' ? 'active' : ''}`}>Top Tracks</button>
        <button onClick={() => setDisplayType('artists')} className={`display-option ${displayType === 'artists' ? 'active' : ''}`}>Top Artists</button>
      </div>
      <div className="display-options">
        <button onClick={() => setTimeRange('short_term')} className={`display-option ${timeRange === 'short_term' ? 'active' : ''}`}>4 Weeks</button>
        <button onClick={() => setTimeRange('medium_term')} className={`display-option ${timeRange === 'medium_term' ? 'active' : ''}`}>6 Months</button>
        <button onClick={() => setTimeRange('long_term')} className={`display-option ${timeRange === 'long_term' ? 'active' : ''}`}>All Time</button>
      </div>
      {displayType === 'tracks' && (
        <div className="top-tracks-container">
          <h2>Top Tracks:</h2>
          <ul className="top-tracks">
            {topTracks.map((track, index) => (
              <li className="top-track" key={track.id}>
                <div className="track-rank">{index + 1}</div>
                <img className="track-image" src={track.album.images[0].url} alt={track.name} />
                <div className="track-name">{track.name}</div>
                <div className="track-artist">{track.artists[0].name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {displayType === 'artists' && (
        <div className="top-artists-container">
          <h2>Top Artists:</h2>
          <ul className="top-artists">
            {topArtists.map((artist, index) => (
              <li className="top-artist" key={artist.id}>
                <div className="artist-rank">{index + 1}</div>
                <img className="artist-image" src={artist.images[0].url} alt={artist.name} />
                <div className="artist-name">{artist.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );  
}

export default Logistics;
