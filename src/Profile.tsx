import { useState, useEffect } from "react";
import { UserData, Playlist } from "./types";

type Props = {
  token: string;
};

function Profile({ token }: Props) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  const fetchData = async (url: string, headers: HeadersInit) => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error("Response not ok");
    }
    return await response.json();
  };

  const fetchUserPlaylists = async (userID: string) => {
    const url = `https://api.spotify.com/v1/users/${userID}/playlists?limit=50`;
    const headers = { Authorization: "Bearer " + token };
    const data = await fetchData(url, headers);
    return data.items.filter(
      (playlist: Playlist) => playlist.owner.id === userID,
    );
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const headers = { Authorization: "Bearer " + token };

        const userData = await fetchData(
          "https://api.spotify.com/v1/me",
          headers,
        );
        setUserData(userData);

        const currentlyPlaying = await fetchData(
          "https://api.spotify.com/v1/me/player/currently-playing",
          headers,
        );
        setCurrentlyPlaying(currentlyPlaying);

        const userPlaylists = await fetchUserPlaylists(userData.id);
        setPlaylists(userPlaylists);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllData();
  }, [token]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { display_name, images, followers } = userData;

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <a
            href={userData.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="profile-image" src={images[0].url} alt="Profile" />
          </a>
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
            <img
              src={currentlyPlaying.item.album.images[0].url}
              alt="Album cover"
              className="profile-track-image"
            />
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
              <a
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-playlist"
                key={playlist.id}
              >
                <img
                  src={playlist.images[0].url}
                  alt="Playlist cover"
                  className="profile-playlist-image"
                />
                <p className="profile-playlist-name">{playlist.name}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
