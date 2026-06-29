import type { DiscoveryContext, Utterance } from "@/lib/utils/types";

const SYSTEM_PROMPT = `You are Aura, Spotify's AI music discovery companion. Your role is to understand what music the user wants to discover RIGHT NOW — based on mood, activity, energy, personality, and intent — then produce a structured discovery plan.

## Your Output
Return a JSON object with these fields:
- intent: structured intent extracted from the user's context
- recommendedGenres: 3–8 Spotify-compatible genre seeds best matching the request
- strategy: 1–2 sentence description of your recommendation approach
- noveltyScore: 0.0 (completely familiar) to 1.0 (entirely unfamiliar)
- diversityScore: 0.0 (single style) to 1.0 (wide variety of styles)
- explanation: 2–3 sentence explanation of why these choices fit the user's current state

## Audio Feature Mapping
- energy: 0 = ambient/calm, 1 = intense/aggressive
- valence (mood positivity): 0 = sad/dark/angry, 1 = happy/cheerful/euphoric
- danceability: 0 = freeform/irregular, 1 = strong beat/danceable
- tempo ranges: 60–80 chill, 80–110 moderate, 110–140 energetic, 140+ intense

## Valid Spotify Seed Genres
acoustic, alt-rock, ambient, blues, classical, club, country, dance, deep-house, disco, drum-and-bass, edm, electronic, folk, funk, garage, gospel, goth, grunge, happy, hip-hop, house, indie, indie-pop, j-pop, jazz, k-pop, latin, lo-fi, metal, minimal-techno, new-wave, opera, piano, pop, punk, r-n-b, reggae, rock, romance, sad, singer-songwriter, ska, sleep, soul, study, synth-pop, techno, trance, trip-hop, world-music

## Novelty Levels
- familiar: same styles/artists the user already gravitates toward
- adjacent: similar vibes but new artists/sub-genres
- exploratory: different sub-genres, unexpected sonic connections
- left_field: completely different from typical preferences

## Rules
1. Map mood/activity descriptions to specific audio feature targets
2. The exploration slider (0=familiar, 1=adventurous) directly influences noveltyLevel
3. Respect the avoid-artists list strictly
4. Preferred genres should be weighted but not exclusive
5. Discovery intent chips should shape the strategy
6. Personality tags influence how adventurous or conservative to be
7. Always provide a brief, engaging explanation of your reasoning
8. Never recommend genres the user is explicitly avoiding`;

export interface PromptMessages {
  role: "system" | "user" | "assistant";
  content: string;
}

export function buildDiscoveryPrompt(
  context: DiscoveryContext,
  utterance: string,
  history: Utterance[]
): PromptMessages[] {
  const contextBlock = buildContextBlock(context);
  const historyBlock = buildHistoryBlock(history);
  const fewShotExamples = buildFewShotExamples();

  const userMessage = `${contextBlock}

${historyBlock}

## Current Request
<user_input>${utterance || buildImplicitUtterance(context)}</user_input>

Analyze the context and request, then generate the discovery plan as JSON.`;

  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...fewShotExamples,
    { role: "user", content: userMessage },
  ];
}

function buildContextBlock(context: DiscoveryContext): string {
  return `## User Context
- Mood: ${context.mood || "not specified"}
- Activity: ${context.activity || "not specified"}
- Energy level: ${context.energy.toFixed(2)} (0=low, 1=high)
- Exploration level: ${context.exploration.toFixed(2)} (0=familiar, 1=adventurous)
- Discovery intent: ${context.discoveryIntent.length > 0 ? context.discoveryIntent.join(", ") : "not specified"}
- Personality: ${context.personalityTags.length > 0 ? context.personalityTags.join(", ") : "not specified"}
- Preferred genres: ${context.preferredGenres.length > 0 ? context.preferredGenres.join(", ") : "open to anything"}
- Artists to avoid: ${context.avoidArtists.length > 0 ? context.avoidArtists.map((a) => a.name).join(", ") : "none"}`;
}

function buildHistoryBlock(history: Utterance[]): string {
  if (history.length === 0) return "";
  const recent = history.slice(-6);
  const lines = recent.map((u) => `${u.role === "user" ? "User" : "Aura"}: ${u.text}`);
  return `## Recent Conversation\n${lines.join("\n")}`;
}

function buildImplicitUtterance(context: DiscoveryContext): string {
  const parts: string[] = [];
  if (context.mood) parts.push(`I'm feeling ${context.mood.toLowerCase()}`);
  if (context.activity) parts.push(`while ${context.activity.toLowerCase()}`);
  if (context.discoveryIntent.length > 0) {
    parts.push(`and I want to ${context.discoveryIntent[0].toLowerCase()}`);
  }
  if (parts.length === 0) return "Recommend me some music";
  return parts.join(" ");
}

function buildFewShotExamples(): PromptMessages[] {
  return [
    {
      role: "user",
      content: `## User Context
- Mood: Melancholic
- Activity: Driving
- Energy level: 0.40
- Exploration level: 0.70
- Discovery intent: Something emotional
- Personality: Introspective
- Preferred genres: indie, alt-rock
- Artists to avoid: none

## Current Request
<user_input>I'm driving late at night and want emotional, cinematic songs</user_input>

Analyze the context and request, then generate the discovery plan as JSON.`,
    },
    {
      role: "assistant",
      content: JSON.stringify({
        intent: {
          mood: "melancholic",
          activity: "driving",
          energyTarget: 0.45,
          valenceTarget: 0.25,
          danceabilityTarget: 0.3,
          tempoRange: [80, 120],
          seedGenres: ["indie", "alt-rock", "synth-pop", "ambient", "trip-hop"],
          noveltyLevel: "exploratory",
          avoidArtists: [],
          avoidGenres: [],
          rationale: "Late-night driving with melancholic mood suggests mid-energy atmospheric tracks with low valence. High exploration level pushes toward less obvious picks.",
        },
        recommendedGenres: ["indie", "alt-rock", "synth-pop", "ambient", "trip-hop", "post-rock", "shoegaze"],
        strategy: "Prioritize atmospheric, cinematic tracks with emotional depth. Mix familiar indie/alt-rock foundation with exploratory synth and post-rock textures for late-night driving tempo.",
        noveltyScore: 0.7,
        diversityScore: 0.65,
        explanation: "Your melancholic, introspective mood paired with nighttime driving calls for atmospheric tracks that build slowly. The high exploration setting means I'll push beyond your usual indie picks into cinematic synth-pop and post-rock territory.",
      }),
    },
    {
      role: "user",
      content: `## User Context
- Mood: Energetic
- Activity: Working Out
- Energy level: 0.90
- Exploration level: 0.30
- Discovery intent: Energize me
- Personality: Intense
- Preferred genres: hip-hop, electronic
- Artists to avoid: Drake, Ed Sheeran

## Current Request
<user_input>High energy workout music, aggressive beats</user_input>

Analyze the context and request, then generate the discovery plan as JSON.`,
    },
    {
      role: "assistant",
      content: JSON.stringify({
        intent: {
          mood: "energetic",
          activity: "working out",
          energyTarget: 0.92,
          valenceTarget: 0.7,
          danceabilityTarget: 0.85,
          tempoRange: [130, 170],
          seedGenres: ["hip-hop", "edm", "drum-and-bass", "electronic"],
          noveltyLevel: "familiar",
          avoidArtists: ["Drake", "Ed Sheeran"],
          avoidGenres: [],
          rationale: "Workout mode with high energy demands driving beats and aggression. Low exploration means sticking close to preferred hip-hop/electronic with proven workout energy.",
        },
        recommendedGenres: ["hip-hop", "edm", "drum-and-bass", "electronic", "trap"],
        strategy: "Focus on high-BPM, high-energy tracks with aggressive production. Stay within familiar hip-hop and electronic territory but surface the hardest-hitting tracks.",
        noveltyScore: 0.25,
        diversityScore: 0.4,
        explanation: "You want raw energy for your workout — high BPM, aggressive beats, and familiar styles. I'm keeping it in your comfort zone of hip-hop and electronic while avoiding Drake and Ed Sheeran, prioritizing tracks that hit hard from the first beat.",
      }),
    },
  ];
}
