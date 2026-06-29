import { NextRequest, NextResponse } from "next/server";
import { ExplanationSchema } from "@/lib/ai/schemas/explanation.schema";
import {
  getMockExplanation,
  getMockTrackDetail,
} from "@/lib/utils/mock-explanations";

export const runtime = "nodejs";
export const maxDuration = 30;

const GROQ_MODEL = "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = 20000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackId } = body as { trackId: string };

    if (!trackId) {
      return NextResponse.json(
        { error: "Missing required field: trackId" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      return buildFallbackResponse(trackId);
    }

    try {
      const explanation = await callGroqForExplanation(apiKey, trackId);
      const track = getMockTrackDetail(trackId);
      return NextResponse.json({ explanation, track });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[/api/explain] Groq failed, using fallback:", message);
      return buildFallbackResponse(trackId);
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[/api/explain] Error:", message);

    return NextResponse.json(
      { error: "Explanation generation failed", detail: message },
      { status: 500 }
    );
  }
}

function buildFallbackResponse(trackId: string) {
  const explanation = getMockExplanation(trackId);
  const track = getMockTrackDetail(trackId);
  return NextResponse.json({ explanation, track });
}

async function callGroqForExplanation(
  apiKey: string,
  trackId: string
) {
  const trackDetail = getMockTrackDetail(trackId);
  const af = trackDetail.audioFeatures;

  const systemPrompt = `You are Aura's explanation engine. Given a track's audio features and metadata, explain WHY it was recommended.

Output a JSON object with these fields:
- moodMatch: 1-2 sentences on how the track's sonic qualities match the user's mood
- contextMatch: 1-2 sentences on how it serves their activity/energy needs
- energyMatch: 1-2 sentences comparing track energy to user preference
- discoveryIntent: 1-2 sentences on how this serves their discovery goals
- noveltyLevel: 1 sentence on how different this is from their usual zone
- rationale: A short paragraph (3-4 sentences) tying the recommendation together
- confidenceScores: object with mood (0-1), context (0-1), energy (0-1), novelty (0-1), diversity (0-1)

Rules:
- ONLY reference factual data provided (audio features, genres, artist, year)
- Ground mood claims in specific audio feature values
- Be conversational and engaging, not clinical`;

  const userPrompt = `## Track
- "${trackDetail.title}" by ${trackDetail.artist}
- Year: ${trackDetail.year}
- Genres: ${trackDetail.genres.join(", ")}
- Energy: ${af.energy.toFixed(2)}, Valence: ${af.valence.toFixed(2)}, Danceability: ${af.danceability.toFixed(2)}
- Tempo: ${af.tempo} BPM, Acousticness: ${af.acousticness.toFixed(2)}, Instrumentalness: ${af.instrumentalness.toFixed(2)}

Generate the explanation as JSON.`;

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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.6,
          max_tokens: 600,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    const parsed = JSON.parse(content);
    const validated = ExplanationSchema.safeParse(parsed);

    if (!validated.success) {
      throw new Error("Schema validation failed for explanation");
    }

    return validated.data;
  } finally {
    clearTimeout(timeout);
  }
}
