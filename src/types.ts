export enum Options {
  Profile = "Profile",
  Logistics = "Logistics",
  RecentlyPlayed = "Recently Played",
}

export interface Track {
  id: string;
  name: string;
  album: { images: Array<{ url: string }> };
  artists: Array<{ name: string }>;
  external_urls: { spotify: string };
}

export interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
}

export interface UserData {
  id: string;
  display_name: string;
  images: Array<{ url: string }>;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface Playlist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
  owner: { id: string };
}

export interface RecentlyPlayedItem {
  played_at: string;
  track: {
    name: string;
    artists: Array<{ name: string }>;
    duration_ms: number;
  };
}
