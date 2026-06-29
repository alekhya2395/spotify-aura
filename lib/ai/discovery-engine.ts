import { buildDiscoveryPrompt } from "./prompts";
import { DiscoveryOutputSchema, type DiscoveryOutput } from "./schemas/intent.schema";
import type { DiscoveryContext, Utterance, DiscoveryResponse } from "@/lib/utils/types";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 25000;

export async function runDiscoveryEngine(
  context: DiscoveryContext,
  utterance: string,
  history: Utterance[]
): Promise<DiscoveryResponse> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    console.warn("[Discovery Engine] No valid GROQ_API_KEY — using fallback");
    return generateFallbackResponse(context, utterance);
  }

  const messages = buildDiscoveryPrompt(context, utterance, history);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await callGroq(apiKey, messages);
      const parsed = parseAndValidate(response);
      return toDiscoveryResponse(parsed);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[Discovery Engine] Attempt ${attempt + 1} failed: ${message}`
      );

      if (attempt === MAX_RETRIES) {
        console.warn("[Discovery Engine] All retries exhausted — using fallback");
        return generateFallbackResponse(context, utterance);
      }

      await sleep(1000 * (attempt + 1));
    }
  }

  return generateFallbackResponse(context, utterance);
}

async function callGroq(
  apiKey: string,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 800,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      if (response.status === 429) {
        throw new Error(`Groq rate limited (429)`);
      }
      if (response.status === 401) {
        throw new Error(`Groq auth failed (401): check API key`);
      }
      throw new Error(
        `Groq API error ${response.status}: ${errorBody.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

function parseAndValidate(rawJson: string): DiscoveryOutput {
  const parsed = JSON.parse(rawJson);
  const result = DiscoveryOutputSchema.safeParse(parsed);

  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Schema validation failed: ${issues}`);
  }

  return result.data;
}

function toDiscoveryResponse(output: DiscoveryOutput): DiscoveryResponse {
  return {
    intent: output.intent,
    recommendedGenres: output.recommendedGenres,
    strategy: output.strategy,
    noveltyScore: output.noveltyScore,
    diversityScore: output.diversityScore,
    explanation: output.explanation,
  };
}

export function generateFallbackResponse(
  context: DiscoveryContext,
  utterance: string
): DiscoveryResponse {
  const exploration = context.exploration;
  const energy = context.energy;

  const noveltyLevel = exploration > 0.7
    ? "exploratory" as const
    : exploration > 0.4
      ? "adjacent" as const
      : "familiar" as const;

  const moodGenreMap: Record<string, string[]> = {
    Chill: ["ambient", "lo-fi", "indie", "acoustic"],
    Energetic: ["edm", "dance", "hip-hop", "drum-and-bass"],
    Melancholic: ["indie", "sad", "singer-songwriter", "piano"],
    Focused: ["lo-fi", "study", "ambient", "classical"],
    Euphoric: ["dance", "edm", "happy", "pop"],
    Nostalgic: ["indie-pop", "synth-pop", "rock", "soul"],
    Dreamy: ["ambient", "trip-hop", "indie", "synth-pop"],
    Angry: ["metal", "punk", "grunge", "hip-hop"],
    Romantic: ["romance", "r-n-b", "soul", "jazz"],
    Empowered: ["hip-hop", "rock", "edm", "pop"],
    Anxious: ["ambient", "electronic", "minimal-techno", "indie"],
    Peaceful: ["ambient", "acoustic", "classical", "sleep"],
  };

  const moodGenres = context.mood
    ? moodGenreMap[context.mood] || ["indie", "pop", "electronic"]
    : ["indie", "pop", "electronic"];

  const preferredMerge = context.preferredGenres.length > 0
    ? [...new Set([...context.preferredGenres, ...moodGenres])].slice(0, 8)
    : moodGenres;

  const seedGenres = preferredMerge.slice(0, 5);

  const valenceTarget = context.mood
    ? getValenceForMood(context.mood)
    : 0.5;

  return {
    intent: {
      mood: context.mood?.toLowerCase() || "neutral",
      activity: context.activity?.toLowerCase(),
      energyTarget: energy,
      valenceTarget,
      seedGenres,
      noveltyLevel,
      avoidArtists: context.avoidArtists.map((a) => a.name),
      avoidGenres: [],
      rationale: `Fallback response based on context: mood=${context.mood || "none"}, activity=${context.activity || "none"}, energy=${energy.toFixed(2)}, exploration=${exploration.toFixed(2)}. ${utterance ? `User said: "${utterance.slice(0, 100)}"` : "No text input."}`,
    },
    recommendedGenres: preferredMerge,
    strategy: `Recommending ${noveltyLevel} tracks matching your ${context.mood || "current"} mood${context.activity ? ` for ${context.activity.toLowerCase()}` : ""}. Energy level: ${energy > 0.6 ? "high" : energy > 0.3 ? "moderate" : "low"}.`,
    noveltyScore: exploration,
    diversityScore: Math.min(0.9, exploration + 0.2),
    explanation: buildFallbackExplanation(context),
  };
}

function getValenceForMood(mood: string): number {
  const valenceMap: Record<string, number> = {
    Chill: 0.5,
    Energetic: 0.75,
    Melancholic: 0.2,
    Focused: 0.45,
    Euphoric: 0.9,
    Nostalgic: 0.4,
    Dreamy: 0.5,
    Angry: 0.15,
    Romantic: 0.65,
    Empowered: 0.7,
    Anxious: 0.25,
    Peaceful: 0.6,
  };
  return valenceMap[mood] ?? 0.5;
}

function buildFallbackExplanation(context: DiscoveryContext): string {
  const parts: string[] = [];

  if (context.mood) {
    parts.push(`Your ${context.mood.toLowerCase()} mood shapes the emotional tone.`);
  }
  if (context.activity) {
    parts.push(`Optimized for ${context.activity.toLowerCase()} tempo and energy.`);
  }
  if (context.discoveryIntent.length > 0) {
    parts.push(`Focused on: ${context.discoveryIntent.join(", ").toLowerCase()}.`);
  }
  if (context.personalityTags.length > 0) {
    parts.push(`Tuned for your ${context.personalityTags[0].toLowerCase()} personality.`);
  }

  if (parts.length === 0) {
    return "Here's a balanced mix to get you started. Refine your preferences for more tailored results.";
  }

  return parts.join(" ");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
