import type { ExplanationOutput } from "@/lib/ai/schemas/explanation.schema";

export interface MockTrackDetail {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  genres: string[];
  year: string;
  audioFeatures: {
    energy: number;
    valence: number;
    danceability: number;
    tempo: number;
    acousticness: number;
    instrumentalness: number;
  };
}

export const MOCK_TRACK_DETAILS: Record<string, MockTrackDetail> = {
  "3n3Ppam7vgaVa1iaRUc9Lp": {
    id: "3n3Ppam7vgaVa1iaRUc9Lp",
    title: "Midnight City",
    artist: "M83",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b5e8e6a8e0f6b3c5c5b0e2a1",
    genres: ["electronic", "synth-pop", "indie"],
    year: "2011",
    audioFeatures: {
      energy: 0.74,
      valence: 0.43,
      danceability: 0.62,
      tempo: 105,
      acousticness: 0.01,
      instrumentalness: 0.61,
    },
  },
  "7qiZfU4dY1lWllzX7mPBI3": {
    id: "7qiZfU4dY1lWllzX7mPBI3",
    title: "Skinny Love",
    artist: "Bon Iver",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273a2b4f37fa5e1e5bc12345678",
    genres: ["indie folk", "singer-songwriter", "chamber pop"],
    year: "2008",
    audioFeatures: {
      energy: 0.35,
      valence: 0.22,
      danceability: 0.41,
      tempo: 78,
      acousticness: 0.85,
      instrumentalness: 0.0,
    },
  },
  "4cOdK2wGLETKBW3PvgPWqT": {
    id: "4cOdK2wGLETKBW3PvgPWqT",
    title: "Never Gonna Give You Up",
    artist: "Khruangbin",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273c3d9f4e5a6b7c8d9e0f1a2b3",
    genres: ["psychedelic", "funk", "world"],
    year: "2020",
    audioFeatures: {
      energy: 0.55,
      valence: 0.68,
      danceability: 0.78,
      tempo: 98,
      acousticness: 0.15,
      instrumentalness: 0.72,
    },
  },
};

export const MOCK_EXPLANATIONS: Record<string, ExplanationOutput> = {
  "3n3Ppam7vgaVa1iaRUc9Lp": {
    moodMatch:
      "The track's 0.74 energy and 0.43 valence create a bittersweet atmosphere — high sonic intensity with dark undertones that perfectly mirrors your melancholic yet driven mood.",
    contextMatch:
      "At 105 BPM with layered synth textures, this builds gradually over its runtime — ideal pacing for a late-night drive where you want atmospheric momentum without jarring transitions.",
    energyMatch:
      "Your energy level (0.40) paired with the track's 0.74 energy creates an uplifting effect — the music gently elevates without overwhelming your reflective state.",
    discoveryIntent:
      "You wanted 'something emotional' — this delivers cinematic emotion through instrumental synth-pop rather than lyrical vulnerability, offering a different route to emotional resonance.",
    noveltyLevel:
      "Adjacent: While electronic/synth-pop sits near your indie preferences, M83's particular blend of shoegaze textures with pop hooks represents a slightly different sonic approach than your typical picks.",
    rationale:
      "Midnight City was recommended because it bridges your melancholic mood with your moderate energy need. The instrumental nature (0.61 instrumentalness) means the emotion is carried through sound design rather than lyrics — perfect for introspective driving. The valence (0.43) keeps things contemplative without being depressive, while the BPM (105) creates a comfortable driving tempo. It's familiar enough to feel safe but different enough from typical indie folk to expand your sonic palette.",
    confidenceScores: {
      mood: 0.88,
      context: 0.92,
      energy: 0.75,
      novelty: 0.7,
      diversity: 0.65,
    },
  },
  "7qiZfU4dY1lWllzX7mPBI3": {
    moodMatch:
      "With 0.22 valence and 0.35 energy, this track inhabits the same emotional territory as your melancholic mood — quiet sadness expressed through raw, unprocessed vocal performance.",
    contextMatch:
      "High acousticness (0.85) and slow tempo (78 BPM) make this deeply intimate — best suited for quiet, reflective moments rather than high-stimulus environments.",
    energyMatch:
      "Your energy level aligns closely with this track's low intensity. The minimal instrumentation creates space for emotional breathing room without demanding attention.",
    discoveryIntent:
      "This directly serves your 'something emotional' intent — Bon Iver's falsetto delivery is one of the most emotionally charged vocal performances in modern indie.",
    noveltyLevel:
      "Familiar: This sits squarely in the indie folk space you already gravitate toward. The recommendation is based on emotional precision rather than sonic novelty.",
    rationale:
      "Skinny Love serves as an emotional anchor in your discovery session. While it doesn't push your boundaries genre-wise, its particular brand of vulnerability — detuned guitar, cracked vocals, minimal production — delivers exactly the emotional catharsis your mood calls for. Think of it as the 'familiar comfort' pick in a session that also includes more adventurous choices.",
    confidenceScores: {
      mood: 0.95,
      context: 0.72,
      energy: 0.88,
      novelty: 0.4,
      diversity: 0.5,
    },
  },
  "4cOdK2wGLETKBW3PvgPWqT": {
    moodMatch:
      "The 0.68 valence and 0.55 energy create an unexpectedly warm groove — lighter than your melancholic baseline, offering contrast and emotional relief through rhythm rather than lyrical weight.",
    contextMatch:
      "High danceability (0.78) with moderate tempo (98 BPM) creates a head-nodding groove perfect for transitioning moods — it doesn't demand attention but rewards it.",
    energyMatch:
      "Sitting at 0.55 energy with high instrumentalness (0.72), this floats in the mid-range — neither demanding nor passive. A palette cleanser between heavier emotional picks.",
    discoveryIntent:
      "This fulfills your 'find hidden gems' intent — Khruangbin's particular fusion of Thai funk, dub, and psychedelia is genuinely hard to categorize and likely outside your usual listening.",
    noveltyLevel:
      "Exploratory: This psychedelic-funk-world fusion is genuinely different from your indie/electronic preferences. The connection is through mood and feel rather than genre.",
    rationale:
      "This pick is intentionally left-field. Your high exploration setting (0.70) signals openness to surprise, and Khruangbin delivers that through a completely unexpected genre intersection. The 0.72 instrumentalness means you can appreciate it without needing to parse lyrics, and the warm valence provides emotional variety in your otherwise melancholic session. It's the kind of artist that expands what you think you like.",
    confidenceScores: {
      mood: 0.62,
      context: 0.7,
      energy: 0.78,
      novelty: 0.92,
      diversity: 0.88,
    },
  },
};

export function getMockExplanation(trackId: string): ExplanationOutput {
  return (
    MOCK_EXPLANATIONS[trackId] || {
      moodMatch:
        "This track's sonic profile aligns with your current emotional state, creating a cohesive listening experience that matches the tone you're looking for.",
      contextMatch:
        "The tempo, energy, and production style are well-suited to your current activity and environment, providing the right level of engagement.",
      energyMatch:
        "The track's energy level complements your selected energy preference, creating a comfortable intensity without being overwhelming or underwhelming.",
      discoveryIntent:
        "Based on your discovery preferences, this track represents the type of music exploration you indicated interest in.",
      noveltyLevel:
        "This recommendation balances familiarity with discovery, sitting at a point that matches your exploration slider setting.",
      rationale:
        "This track was selected because it represents a strong intersection of your mood, activity context, and discovery preferences. The audio features align well with your specified parameters while introducing enough variety to keep the session interesting.",
      confidenceScores: {
        mood: 0.7,
        context: 0.7,
        energy: 0.7,
        novelty: 0.6,
        diversity: 0.6,
      },
    }
  );
}

export function getMockTrackDetail(trackId: string): MockTrackDetail {
  return (
    MOCK_TRACK_DETAILS[trackId] || {
      id: trackId,
      title: "Unknown Track",
      artist: "Unknown Artist",
      albumArt: "",
      genres: ["indie", "alternative"],
      year: "2024",
      audioFeatures: {
        energy: 0.5,
        valence: 0.5,
        danceability: 0.5,
        tempo: 120,
        acousticness: 0.3,
        instrumentalness: 0.2,
      },
    }
  );
}
