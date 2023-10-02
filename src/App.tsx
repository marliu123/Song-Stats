import { useEffect, useState } from "react";
import { Options } from "./types";
import "./App.css";
import logo from "./media/Spotify_Icon_RGB_Green.png";
import RecentlyPlayed from "./RecentlyPlayed";
import Profile from "./Profile";
import Logistics from "./Logistics";
import ProfileIcon from "./media/user.png";
import StatsIcon from "./media/statistics.png";
import HistoryIcon from "./media/history.png";
import github from "./media/github-mark-white.png";
import Playlists from "./Playlist";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<Options>(
    Options.Profile,
  );
  const authEndpoint = "https://accounts.spotify.com/authorize";
  //const redirectUri = "https://songify-rho.vercel.app/";
  const redirectUri = "http://localhost:3000/";
  const clientId = "1b71578fa02143ddac1ce48bb58fad1b";
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "playlist-read-private",
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-playback-position",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-playback-position",
    "user-read-recently-played",
    "user-follow-read",
    "user-follow-modify",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-collaborative",
    "ugc-image-upload",
  ];

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    if (params.has("access_token")) {
      const accessToken = params.get("access_token")!;
      setToken(accessToken);
      window.localStorage.setItem("spotify_access_token", accessToken);
    } else if (window.localStorage.getItem("spotify_access_token")) {
      setToken(window.localStorage.getItem("spotify_access_token")!);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = generateAuthUrl();
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("spotify_access_token");
  };

  const generateAuthUrl = (): string => {
    return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      "%20",
    )}&response_type=token&show_dialog=true`;
  };

  const componentsMap = {
    "Select an option": null,
    "Recently Played": <RecentlyPlayed token={token!} />,
    Profile: <Profile token={token!} />,
    Logistics: <Logistics token={token!} />,
    Playlists: <Playlists token={token!} />,
  };

  return (
    <div className="App">
      <div className="logo-container">
        <img className="logo" src={logo} alt="Spotify logo" />
        <h1>Songify</h1>
      </div>
      <div className="sidebar">
        <div className="options-container">
        <ul className="options-list">
          {Object.values(Options).map((option) => (
            <li
              key={option}
              className={`option-item ${
                selectedOption === option ? "active" : ""
              }`}
              onClick={() => setSelectedOption(option)}
            >
             {option === Options.RecentlyPlayed && (
                <div className="icon-container">
                  <img src={HistoryIcon} alt="Recently Played" className="icon" />
                  Recent
                </div>
              )}
              {option === Options.Profile && (
                <div className="icon-container">
                  <img src={ProfileIcon} alt="Profile" className="icon" />
                  {option}
                </div>
              )}
              {option === Options.Logistics && (
                <div className="icon-container">
                  <img src={StatsIcon} alt="Logistics" className="icon" />
                  {option}
                </div>
              )}
              {option === Options.Playlists && (
                <div className="icon-container">
                  <img src={StatsIcon} alt="Playlist" className="icon" />
                  {option}
                </div>
              )}
            </li>
          ))}
        </ul>
        </div>
        <div className="github-icon-container">
              <a href="https://github.com/marliu123/spotistats" target="_blank" rel="noopener noreferrer">
                <img className="github-icon" src={github} alt="GitHub" />
              </a>
            </div>
      </div>
      <div className="content">
        {!token ? (
          <button className="log" onClick={handleLogin}>
            Log In
          </button>
        ) : (
          <>
            <button className="log" onClick={handleLogout}>
              Log out
            </button>
            {componentsMap[selectedOption]}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
