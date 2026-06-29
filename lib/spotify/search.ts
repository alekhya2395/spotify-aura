import { getSpotifyAccessToken } from "./auth";
import type { ExtractedIntent, TrackRecommendation } from "@/lib/utils/types";

interface SpotifyTrackItem {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: { images: Array<{ url: string }> };
  preview_url: string | null;
  external_urls: { spotify: string };
}

interface SpotifySearchResponse {
  tracks?: { items: SpotifyTrackItem[] };
}

function buildSearchQuery(intent: ExtractedIntent, utterance: string): string {
  const genreQuery = intent.seedGenres
    .slice(0, 3)
    .map((g) => `genre:${g.replace(/\s+/g, "-")}`)
    .join(" OR ");

  const moodQuery = intent.mood ? intent.mood.replace(/_/g, " ") : "";
  const textQuery = utterance.slice(0, 80).trim();

  return [genreQuery, moodQuery, textQuery].filter(Boolean).join(" ");
}

function mapSpotifyTrack(
  track: SpotifyTrackItem,
  rank: number,
  intent: ExtractedIntent
): TrackRecommendation {
  const artist = track.artists[0];
  return {
    id: track.id,
    title: track.name,
    artist: artist?.name ?? "Unknown Artist",
    artistId: artist?.id ?? "",
    albumArt: track.album.images[0]?.url ?? "",
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    rank,
    vibeMatch: `Matches your ${intent.mood} mood`,
    noveltyMatch: `${intent.noveltyLevel.replace("_", " ")} discovery pick`,
    oneLineHook: track.name,
  };
}

export async function searchSpotifyTracks(
  intent: ExtractedIntent,
  utterance: string,
  limit = 8
): Promise<TrackRecommendation[]> {
  const token = await getSpotifyAccessToken();
  if (!token) return [];

  const query = buildSearchQuery(intent, utterance);
  if (!query) return [];

  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(limit),
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) return [];

  const data: SpotifySearchResponse = await response.json();
  const items = data.tracks?.items ?? [];

  const avoidSet = new Set(intent.avoidArtists.map((a) => a.toLowerCase()));

  return items
    .filter((track) => {
      const artistName = track.artists[0]?.name?.toLowerCase() ?? "";
      return !avoidSet.has(artistName);
    })
    .slice(0, limit)
    .map((track, index) => mapSpotifyTrack(track, index + 1, intent));
}
