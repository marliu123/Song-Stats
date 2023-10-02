import { useState, useEffect } from "react";
import { UserData} from "./types";

type Props = {
  token: string;
};

function Profile({ token }: Props) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any | null>(null);

  const fetchData = async (url: string, headers: HeadersInit) => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error("Response not ok");
    }
    return await response.json();
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
    </>
  );
}

export default Profile;
