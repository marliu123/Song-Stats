// Playlist.tsx

import React, { useState, useEffect } from "react";
import { UserData, Playlist } from "./types";

type Props = {
  token: string;
};

function Playlists({ token }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );

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

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  return (
    <div>
      <div className="playlist-section">
        <div className="playlist-list">
          {playlists &&
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={`playlist-item ${
                  selectedPlaylist?.id === playlist.id ? "selected" : ""
                }`}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <img
                  className="playlist-image"
                  src={playlist.images[0]?.url || ""}
                  alt={playlist.name}
                />
                <div className="playlist-title">{playlist.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Playlists;
