import { useState, useEffect } from "react";

type Playlist = {
  id: string;
  name: string;
};

type Props = {
  token: string;
};

function Playlists({ token }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    // Fetch the user's playlists using the Spotify API
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("YOUR_SPOTIFY_API_ENDPOINT", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Assuming the data structure from Spotify's API, update the state
          setPlaylists(data.items);
        } else {
          // Handle error here
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [token]);

  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
