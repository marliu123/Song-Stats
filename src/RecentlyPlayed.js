import { useEffect, useState } from 'react';

function RecentlyPlayed({ token }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchRecentlyPlayed = async (token) => {
        try {
          const limit = 30;
          const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=' + limit, {
            headers: {
              'Authorization': 'Bearer ' + token,
            },
          });
          if (!response.ok) {
            throw new Error('Response not ok');
          }
          const data = await response.json();
          setRecentlyPlayed(data.items);
        } catch (err) {
          console.error(err);
        }
      };
      fetchRecentlyPlayed(token);
    }
  }, [token]);

  function formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  }
  
  return (
    <>
      {showTable && (
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
            {recentlyPlayed.map((item) => (
              <tr key={item.played_at}>
                <td>{item.track.name}</td>
                <td>{item.track.artists[0].name}</td>
                <td>{formatDuration(item.track.duration_ms)}</td>
                <td>{formatTimestamp(item.played_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default RecentlyPlayed;
