import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryEngine } from "@/lib/ai/discovery-engine";
import { validateContext } from "@/lib/ai/schemas/context.schema";
import { resolveRecommendations } from "@/lib/recommendations/resolve-recommendations";
import { buildDefaultUtterance } from "@/lib/utils/build-default-utterance";
import type { DiscoveryContext, Utterance } from "@/lib/utils/types";

export const runtime = "nodejs";
export const maxDuration = 30;

interface DiscoverRequestBody {
  context: DiscoveryContext;
  utterance?: string;
  history?: Utterance[];
}

export async function POST(request: NextRequest) {
  try {
    const body: DiscoverRequestBody = await request.json();
    const { context, utterance, history } = body;

    if (!context) {
      return NextResponse.json(
        { error: "Missing required field: context" },
        { status: 400 }
      );
    }

    const validation = validateContext(context);
    if (!validation.success) {
      const issues = validation.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return NextResponse.json(
        { error: `Invalid context: ${issues}` },
        { status: 400 }
      );
    }

    const effectiveUtterance =
      utterance?.trim() || buildDefaultUtterance(context);

    const result = await runDiscoveryEngine(
      context,
      effectiveUtterance,
      history || []
    );

    const { tracks, source } = await resolveRecommendations(
      result,
      effectiveUtterance
    );

    return NextResponse.json({
      success: true,
      data: result,
      recommendations: tracks,
      recommendationSource: source,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[/api/discover] Error:", message);

    return NextResponse.json(
      { error: "Discovery engine failed", detail: message },
      { status: 500 }
    );
  }
}
