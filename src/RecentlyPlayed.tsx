import { useEffect, useState } from "react";
import { RecentlyPlayedItem } from "./types";

type Props = {
  token: string;
};

function Recent({ token }: Props) { // Updated component name here
  const [recentlyrePlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(
    [],
  );
  const fetchData = async (url: string, headers: HeadersInit) => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error("Response not ok");
    }
    return await response.json();
  };

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        const limit = 30;
        const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
        const headers = { Authorization: `Bearer ${token}` };
        const data = await fetchData(url, headers);
        setRecentlyPlayed(data.items);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchRecentlyPlayed();
    }
  }, [token]);

  function formatDuration(durationMs: number) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <>
    <div className="track-history">
      <table>
        <thead>
          <tr>
            <th>Track Name</th>
            <th>Artist</th>
            <th>Duration</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {recentlyrePlayed.map((item) => (
            <tr key={item.played_at}>
              <td>{item.track.name}</td>
              <td>{item.track.artists[0].name}</td>
              <td>{formatDuration(item.track.duration_ms)}</td>
              <td>{formatTimestamp(item.played_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

export default Recent; // Updated export name here
