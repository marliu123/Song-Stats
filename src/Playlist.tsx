import React, { useState, useEffect } from "react";
import { Playlist } from "./types";

type Props = {
  token: string;
};

function Playlists({ token }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  const fetchData = async (url: string, headers: HeadersInit) => {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("Response not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const fetchAllPlaylists = async () => {
    try {
      const headers = { Authorization: "Bearer " + token };

      const url = `https://api.spotify.com/v1/me/playlists?limit=50`;
      const data = await fetchData(url, headers);

      // Now, data contains all playlists, including those from other users
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllPlaylists();
    }
  }, [token]);

  return (
    <div className="playlist-section"> {/* Apply the playlist section styles */}
      {playlists && playlists.length > 0 ? (
        <div>
          <h2 className="playlist-title">All Playlists</h2> {/* Apply the title styles */}
          <ul className="playlist-list"> {/* Apply the playlist list styles */}
            {playlists.map((playlist) => (
              <li className="playlist-item" key={playlist.id}> {/* Apply the list item styles */}
                <span className="playlist-name">{playlist.name}</span>
                <button className="playlist-button">Play</button> {/* Apply the button styles */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading playlists...</p>
      )}
    </div>
  );
}

export default Playlists;
