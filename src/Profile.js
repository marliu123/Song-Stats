import { useState, useEffect } from 'react';

function Profile({ token }) {
  const [userData, setUserData] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        const data = await response.json();
        const userID = data.id;
        setUserData(data);
        fetchUserPlaylists(userID);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        const data = await response.json();
        setCurrentlyPlaying(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUserPlaylists = async (userID) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists?limit=50`, {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        const data = await response.json();
        const userPlaylists = data.items.filter((playlist) => playlist.owner.id === userID);
        // Loop through the playlists and retrieve the image for each one
        for (let i = 0; i < userPlaylists.length; i++) {
          const playlistImage = await fetchUserPlaylistImage(userPlaylists[i].id);
          userPlaylists[i].images = [{ url: playlistImage }];
        }
        setPlaylists(userPlaylists);
      } catch (err) {
        console.error(err);
      }
    };
    
    const fetchUserPlaylistImage = async (playlist_id) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/images`, {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        const data = await response.json();
        const playlistImage = data[0]?.url || null;
        return playlistImage;
      } catch (err) {
        console.error(err);
        return null;
      }
    };    
    
    fetchUserData();
    fetchCurrentlyPlaying();
  }, [token]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { display_name, images, followers } = userData;

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <img className="profile-image" src={images[0].url} alt="Profile" />
          <div>
            <h1 className="profile-name">{display_name}</h1>
            <p className="profile-followers">{followers.total} followers</p>
          </div>
          {currentlyPlaying && (
            <div className="profile-track-status">
              <div className="blue-dot"></div>
            </div>
          )}
        </div>
        {currentlyPlaying && (
          <div className="profile-track-info">
            <img src={currentlyPlaying.item.album.images[0].url} alt="Album cover" className="profile-track-image" />
            <p>{currentlyPlaying.item.name}</p>
            <p>{currentlyPlaying.item.artists[0].name}</p>
          </div>
        )}
      </div>
      {playlists && (
          <div className="profile-playlists">
            <h2 className="profile-playlists-header">Playlists</h2>
            <div className="profile-playlists-container">
              {playlists.map((playlist) => (
                <div className="profile-playlist" key={playlist.id}>
                  <img src={playlist.images[0].url} alt="Playlist cover" className="profile-playlist-image" />
                  <p className="profile-playlist-name">{playlist.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  );
}  

export default Profile;
