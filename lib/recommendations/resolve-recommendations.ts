import { searchSpotifyTracks } from "@/lib/spotify/search";
import { isSpotifyConfigured } from "@/lib/env";
import { MOCK_TRACK_RECOMMENDATIONS } from "@/lib/utils/mock-recommendations";
import type {
  DiscoveryResponse,
  ExtractedIntent,
  TrackRecommendation,
} from "@/lib/utils/types";

export type RecommendationSource = "spotify" | "mock";

function filterMockTracks(intent: ExtractedIntent): TrackRecommendation[] {
  const avoidSet = new Set(intent.avoidArtists.map((a) => a.toLowerCase()));
  const genres = new Set(
    [...intent.seedGenres, ...intent.avoidGenres].map((g) => g.toLowerCase())
  );

  let pool = MOCK_TRACK_RECOMMENDATIONS.filter(
    (track) => !avoidSet.has(track.artist.toLowerCase())
  );

  if (intent.noveltyLevel === "exploratory" || intent.noveltyLevel === "left_field") {
    pool = [...pool].reverse();
  }

  if (genres.size > 0) {
    const ranked = pool.sort((a, b) => {
      const aScore = scoreTrack(a, intent);
      const bScore = scoreTrack(b, intent);
      return bScore - aScore;
    });
    pool = ranked;
  }

  return pool.slice(0, 8).map((track, index) => ({
    ...track,
    rank: index + 1,
    vibeMatch: track.vibeMatch || `Matches your ${intent.mood} mood`,
  }));
}

function scoreTrack(track: TrackRecommendation, intent: ExtractedIntent): number {
  const haystack = `${track.title} ${track.artist} ${track.vibeMatch} ${track.noveltyMatch}`.toLowerCase();
  return intent.seedGenres.reduce(
    (score, genre) => (haystack.includes(genre.toLowerCase()) ? score + 1 : score),
    0
  );
}

export async function resolveRecommendations(
  discovery: DiscoveryResponse,
  utterance: string
): Promise<{ tracks: TrackRecommendation[]; source: RecommendationSource }> {
  const { intent } = discovery;

  if (isSpotifyConfigured()) {
    try {
      const spotifyTracks = await searchSpotifyTracks(intent, utterance);
      if (spotifyTracks.length > 0) {
        return { tracks: spotifyTracks, source: "spotify" };
      }
    } catch {
      // Fall through to mock catalog
    }
  }

  return {
    tracks: filterMockTracks(intent),
    source: "mock",
  };
}
