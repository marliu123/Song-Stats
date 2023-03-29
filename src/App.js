import { useEffect, useState } from 'react';
import './App.css';
import logo from './media/whitespotifylogo.png';
import RecentlyPlayed from './RecentlyPlayed.js';
import Profile from './Profile';
import Logistics from './Logistics';

function App() {
  const [token, setToken] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const redirectUri = 'https://spotistats-rho.vercel.app/';
  //const redirectUri = 'http://localhost:3000/';
  const clientId = '1b71578fa02143ddac1ce48bb58fad1b';
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'user-top-read',
    'user-read-recently-played',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-playback-position',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-collaborative',
    'ugc-image-upload'
  ];
  

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    if (params.has('access_token')) {
      const accessToken = params.get('access_token');
      setToken(accessToken);
      window.localStorage.setItem('spotify_access_token', accessToken);
    } else if (window.localStorage.getItem('spotify_access_token')) {
      setToken(window.localStorage.getItem('spotify_access_token'));
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem('spotify_access_token');
  };

  
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "Recently Played") {
      setShowTable(true);
      setShowProfile(false);
      setShowLogistics(false);
    } else if(event.target.value === "Profile"){
      setShowProfile(true);
      setShowTable(false);
      setShowLogistics(false);
    } else if(event.target.value === "Logistics"){
      setShowLogistics(true);
      setShowProfile(false);
      setShowTable(false);

    }
  };

  return (
    <div className="App">
      <h1>
        <img className="logo" src={logo} alt="Spotify logo" />
        Spotistats
      </h1>
      {!token ? (
        <button className="log" onClick={handleLogin}>
          Log In
        </button>
      ) : (
        <>
          <button className="log" onClick={handleLogout}>
            Log out
          </button>
          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="Select an option">Select an option</option>\
            <option value="Profile">Profile</option>
            <option value="Logistics">Logistics</option>
            <option value="Recently Played">Recently Played</option>
          </select>
          {showTable && <RecentlyPlayed token={token} />}
          {showProfile && <Profile token={token} />}
          {showLogistics && <Logistics token={token} />}
        </>
      )}
    </div>
  );  
}

export default App;
