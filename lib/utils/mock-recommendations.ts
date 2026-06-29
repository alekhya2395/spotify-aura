import type { TrackRecommendation } from "./types";

export interface MockArtist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  followers: number;
  matchReason: string;
}

export interface MockPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  curator: string;
  matchReason: string;
}

export const MOCK_TRACK_RECOMMENDATIONS: TrackRecommendation[] = [
  {
    id: "3n3Ppam7vgaVa1iaRUc9Lp",
    title: "Midnight City",
    artist: "M83",
    artistId: "5JnZbKmEMPL0laZqUUf1o8",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b5e8e6a8e0f6b3c5c5b0e2a1",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
    rank: 1,
    vibeMatch: "Dreamy synths meet nocturnal energy",
    noveltyMatch: "Adjacent — familiar electronic with cinematic twist",
    oneLineHook: "The synth anthem for your midnight drive",
  },
  {
    id: "7qiZfU4dY1lWllzX7mPBI3",
    title: "Skinny Love",
    artist: "Bon Iver",
    artistId: "4LEiUm1SRbFMgfqnQTwUbQ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273a2b4f37fa5e1e5bc12345678",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
    rank: 2,
    vibeMatch: "Raw emotion and stripped-back vulnerability",
    noveltyMatch: "Familiar — indie folk at its most intimate",
    oneLineHook: "Fragile falsetto over detuned guitar, pure emotion",
  },
  {
    id: "4cOdK2wGLETKBW3PvgPWqT",
    title: "Never Gonna Give You Up",
    artist: "Khruangbin",
    artistId: "2mVVjNmdjXZZDvhgQWiakk",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273c3d9f4e5a6b7c8d9e0f1a2b3",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
    rank: 3,
    vibeMatch: "Psychedelic groove with global textures",
    noveltyMatch: "Exploratory — funk-soul-psych blend rarely heard",
    oneLineHook: "Thai-funk-dub fusion that floats like a dream",
  },
  {
    id: "2takcwOaAZWiXQijPHIx7B",
    title: "Motion Sickness",
    artist: "Phoebe Bridgers",
    artistId: "1r1uxoy19fzMxunt3ONAkG",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273d4e5f6a7b8c9d0e1f2a3b4c5",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/2takcwOaAZWiXQijPHIx7B",
    rank: 4,
    vibeMatch: "Biting wit wrapped in folk-rock warmth",
    noveltyMatch: "Adjacent — singer-songwriter with indie edge",
    oneLineHook: "Heartbreak has never sounded so clever",
  },
  {
    id: "5HCyWlXZPP0y6469KN4J8n",
    title: "Flume",
    artist: "Bon Iver",
    artistId: "4LEiUm1SRbFMgfqnQTwUbQ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273e5f6a7b8c9d0e1f2a3b4c5d6",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/5HCyWlXZPP0y6469KN4J8n",
    rank: 5,
    vibeMatch: "Intimate acoustic layered with subtle production",
    noveltyMatch: "Familiar — classic indie folk warmth",
    oneLineHook: "A whispered invitation to slow down",
  },
  {
    id: "6habFhsAe1zPmFGF4Mo4aL",
    title: "Saturn",
    artist: "SZA",
    artistId: "7tYKF4w9nC0nq9CsPZTHyP",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273f6a7b8c9d0e1f2a3b4c5d6e7",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/6habFhsAe1zPmFGF4Mo4aL",
    rank: 6,
    vibeMatch: "Dreamy R&B with existential lyricism",
    noveltyMatch: "Adjacent — pop-R&B pushed into ethereal space",
    oneLineHook: "Floating between planets and self-discovery",
  },
  {
    id: "1Mo4aY1YLGPbW3PCVMbz4r",
    title: "Genesis",
    artist: "Grimes",
    artistId: "053q0ukIDRgzwTr4vNSwab",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273a7b8c9d0e1f2a3b4c5d6e7f8",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/1Mo4aY1YLGPbW3PCVMbz4r",
    rank: 7,
    vibeMatch: "Art-pop deconstructed into electronic bliss",
    noveltyMatch: "Exploratory — experimental pop few dare to make",
    oneLineHook: "Angelic vocals over glitchy, alien production",
  },
  {
    id: "3CRDbSIZ4r5MsZ0YwxuEkn",
    title: "Robson Girl",
    artist: "Mac DeMarco",
    artistId: "3Sz7ZnJQBIHsXLUSo0OQtM",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b8c9d0e1f2a3b4c5d6e7f8a9",
    previewUrl: null,
    spotifyUrl: "https://open.spotify.com/track/3CRDbSIZ4r5MsZ0YwxuEkn",
    rank: 8,
    vibeMatch: "Sun-faded slacker rock with nostalgic haze",
    noveltyMatch: "Familiar — jangle-pop comfort food",
    oneLineHook: "Lo-fi sunshine for a lazy afternoon",
  },
];

export const MOCK_ARTISTS: MockArtist[] = [
  {
    id: "4LEiUm1SRbFMgfqnQTwUbQ",
    name: "Bon Iver",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273a1b2c3d4e5f6a7b8c9d0e1f2",
    genres: ["indie folk", "chamber pop", "alternative"],
    followers: 3200000,
    matchReason: "Matches your melancholic mood with layered intimacy",
  },
  {
    id: "1r1uxoy19fzMxunt3ONAkG",
    name: "Phoebe Bridgers",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273b2c3d4e5f6a7b8c9d0e1f2a3",
    genres: ["indie rock", "singer-songwriter", "sad"],
    followers: 4100000,
    matchReason: "Witty vulnerability that resonates with your introspective side",
  },
  {
    id: "2mVVjNmdjXZZDvhgQWiakk",
    name: "Khruangbin",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273c3d4e5f6a7b8c9d0e1f2a3b4",
    genres: ["psychedelic", "funk", "world"],
    followers: 2800000,
    matchReason: "Global sonic exploration for adventurous listeners",
  },
  {
    id: "7tYKF4w9nC0nq9CsPZTHyP",
    name: "SZA",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273d4e5f6a7b8c9d0e1f2a3b4c5",
    genres: ["r&b", "pop", "neo soul"],
    followers: 18500000,
    matchReason: "Ethereal R&B that floats between moods effortlessly",
  },
];

export const MOCK_PLAYLISTS: MockPlaylist[] = [
  {
    id: "pl-1",
    name: "Midnight Indie",
    description: "Late-night indie for introspective souls",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273e5f6a7b8c9d0e1f2a3b4c5d6",
    trackCount: 45,
    curator: "Spotify Aura",
    matchReason: "Curated around your melancholic + indie preferences",
  },
  {
    id: "pl-2",
    name: "Dreamy Explorations",
    description: "Genre-bending discoveries for open minds",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273f6a7b8c9d0e1f2a3b4c5d6e7",
    trackCount: 32,
    curator: "Spotify Aura",
    matchReason: "High exploration matches your adventurous personality",
  },
  {
    id: "pl-3",
    name: "Lo-Fi Focus",
    description: "Ambient beats to keep you in the zone",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273a7b8c9d0e1f2a3b4c5d6e7f8",
    trackCount: 60,
    curator: "Spotify Aura",
    matchReason: "Perfect for your study session energy level",
  },
];

export interface MockDiscoveryMeta {
  strategy: string;
  noveltyScore: number;
  diversityScore: number;
  explanation: string;
  recommendedGenres: string[];
}

export const MOCK_DISCOVERY_META: MockDiscoveryMeta = {
  strategy:
    "Blending indie folk foundations with exploratory electronic and art-pop textures for a diverse yet cohesive listening experience.",
  noveltyScore: 0.65,
  diversityScore: 0.72,
  explanation:
    "Your melancholic mood with high exploration desire calls for music that feels emotionally resonant yet sonically surprising. I'm mixing familiar indie comfort with left-field electronic discoveries.",
  recommendedGenres: ["indie", "electronic", "folk", "art-pop", "ambient", "r-n-b"],
};
