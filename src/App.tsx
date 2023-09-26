import { useEffect, useState } from "react";
import { Options } from "./types";
import "./App.css";
import logo from "./media/whitespotifylogo.png";
import RecentlyPlayed from "./RecentlyPlayed";
import Profile from "./Profile";
import Logistics from "./Logistics";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<Options>(
    Options.Profile,
  );
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const redirectUri = "https://songify-rho.vercel.app/";
  //const redirectUri = "http://localhost:3000/";
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
  };

  return (
    <div className="App">
      <h1>
        <img className="logo" src={logo} alt="Spotify logo" />
        Songify
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
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as Options)}
          >
            {Object.values(Options).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {componentsMap[selectedOption]}
        </>
      )}
    </div>
  );
}

export default App;
