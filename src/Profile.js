import { useState, useEffect } from 'react';

function Profile({ token }) {
  const [userData, setUserData] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

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
        setUserData(data);
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
    </>
  );
  
}

export default Profile;

