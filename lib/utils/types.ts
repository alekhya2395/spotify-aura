export type DiscoveryContext = {
  mood: string | null;
  activity: string | null;
  energy: number;
  exploration: number;
  discoveryIntent: string[];
  personalityTags: string[];
  avoidArtists: Array<{ id: string; name: string }>;
  preferredGenres: string[];
  freeText: string;
};

export type Utterance = {
  role: "user" | "aura";
  text: string;
  timestamp: number;
};

export type ExtractedIntent = {
  mood: string;
  activity?: string;
  energyTarget: number;
  valenceTarget: number;
  danceabilityTarget?: number;
  tempoRange?: [number, number];
  seedGenres: string[];
  noveltyLevel: "familiar" | "adjacent" | "exploratory" | "left_field";
  avoidArtists: string[];
  avoidGenres: string[];
  rationale: string;
};

export type TrackRecommendation = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  rank: number;
  vibeMatch: string;
  noveltyMatch: string;
  oneLineHook: string;
};

export type TrackExplanation = {
  moodMatch: string;
  contextMatch: string;
  noveltyLevel: string;
  rationale: string;
};

export type FeedbackAction =
  | "more_like_this"
  | "less_similar"
  | "more_adventurous"
  | "change_mood"
  | "more_from_artist";

export type DiscoveryResponse = {
  intent: ExtractedIntent;
  recommendedGenres: string[];
  strategy: string;
  noveltyScore: number;
  diversityScore: number;
  explanation: string;
};

export type DiscoveryMeta = {
  strategy: string;
  noveltyScore: number;
  diversityScore: number;
  explanation: string;
  recommendedGenres: string[];
  recommendationSource?: "spotify" | "mock";
};

export type DiscoverySession = {
  context: DiscoveryContext;
  utterances: Utterance[];
  lastIntent: ExtractedIntent | null;
  discoveryMeta: DiscoveryMeta | null;
  recommendations: TrackRecommendation[];
  history: string[];
  sessionId: string;
};
