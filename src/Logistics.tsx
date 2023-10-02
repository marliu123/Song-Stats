import { useState, useEffect } from "react";
import { Track, Artist } from "./types";

type Props = {
  token: string;
};

function Logistics({ token }: Props) {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("short_term");
  const [displayType, setDisplayType] = useState<"tracks" | "artists">(
    "tracks",
  );

  const fetchData = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.items;
  };

  useEffect(() => {
    const fetchTopData = async () => {
      try {
        if (displayType === "tracks") {
          const tracks = await fetchData(
            `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`,
          );
          setTopTracks(tracks);
        } else if (displayType === "artists") {
          const artists = await fetchData(
            `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
          );
          setTopArtists(artists);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopData();
  }, [token, timeRange, displayType]);

  return (
    <div className="logistics-container">
      <div className="display-options">
        <button
          onClick={() => setDisplayType("tracks")}
          className={`display-option ${
            displayType === "tracks" ? "active" : ""
          }`}
        >
          Top Tracks
        </button>
        <button
          onClick={() => setDisplayType("artists")}
          className={`display-option ${
            displayType === "artists" ? "active" : ""
          }`}
        >
          Top Artists
        </button>
      </div>
      <div className="display-options">
        <button
          onClick={() => setTimeRange("short_term")}
          className={`display-option ${
            timeRange === "short_term" ? "active" : ""
          }`}
        >
          4 Weeks
        </button>
        <button
          onClick={() => setTimeRange("medium_term")}
          className={`display-option ${
            timeRange === "medium_term" ? "active" : ""
          }`}
        >
          6 Months
        </button>
        <button
          onClick={() => setTimeRange("long_term")}
          className={`display-option ${
            timeRange === "long_term" ? "active" : ""
          }`}
        >
          All Time
        </button>
      </div>
      {displayType === "tracks" && (
        <div className="top-tracks-container">
          <h2>Top Tracks:</h2>
          <ul className="top-tracks">
            {topTracks.map((track, index) => (
              <li className="top-track" key={track.id}>
                <div className="track-rank">{index + 1}</div>
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="track-image"
                    src={track.album.images[0].url}
                    alt={track.name}
                  />
                </a>
                <div className="track-name scroll-text-ellipsis">
                  <div className="scroll-text">{track.name}</div>
                </div>
                <div className="track-artist">
                  {track.artists[0].name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {displayType === "artists" && (
        <div className="top-artists-container">
          <h2>Top Artists:</h2>
          <ul className="top-artists">
            {topArtists.map((artist, index) => (
              <li className="top-artist" key={artist.id}>
                <div className="artist-rank">{index + 1}</div>
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="artist-image"
                    src={artist.images[0].url}
                    alt={artist.name}
                  />
                </a>
                <div className="artist-name">
                  {artist.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Logistics;
