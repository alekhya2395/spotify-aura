"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import { ExplanationCard } from "@/components/explain/ExplanationCard";
import { ConfidenceBar } from "@/components/explain/ConfidenceBar";
import { AudioFeatureRadar } from "@/components/explain/AudioFeatureRadar";
import { ExplanationSkeleton } from "@/components/explain/ExplanationSkeleton";
import { ChipLabel } from "@/components/ui/Pill";
import {
  getMockExplanation,
  getMockTrackDetail,
} from "@/lib/utils/mock-explanations";
import type { ExplanationOutput } from "@/lib/ai/schemas/explanation.schema";
import type { MockTrackDetail } from "@/lib/utils/mock-explanations";

export default function WhyPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [explanation, setExplanation] = useState<ExplanationOutput | null>(null);
  const [trackDetail, setTrackDetail] = useState<MockTrackDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExplanation() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackId }),
        });

        if (res.ok) {
          const data = await res.json();
          setExplanation(data.explanation);
          setTrackDetail(data.track);
        } else {
          setExplanation(getMockExplanation(trackId));
          setTrackDetail(getMockTrackDetail(trackId));
        }
      } catch {
        setExplanation(getMockExplanation(trackId));
        setTrackDetail(getMockTrackDetail(trackId));
      } finally {
        setIsLoading(false);
      }
    }

    fetchExplanation();
  }, [trackId]);

  if (isLoading) {
    return <ExplanationSkeleton />;
  }

  if (error && !explanation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 px-6">
        <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-sm text-spotify-text-secondary">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-spotify-green font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!explanation || !trackDetail) return null;

  return (
    <div className="space-y-5 pb-6">
      {/* Track Header */}
      <section className="flex gap-3 items-center pt-1 p-3 rounded-lg bg-spotify-surface border border-white/[0.04]">
        <div className="relative w-14 h-14 rounded-md overflow-hidden bg-spotify-elevated flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center text-spotify-text-subdued">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          {trackDetail.albumArt && (
            <Image
              src={trackDetail.albumArt}
              alt={trackDetail.title}
              fill
              sizes="56px"
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-[15px] font-bold text-white truncate leading-tight">
            {trackDetail.title}
          </h1>
          <p className="text-[12px] text-spotify-text-secondary truncate">
            {trackDetail.artist}
          </p>
          <div className="aura-chip-grid">
            {trackDetail.genres.slice(0, 3).map((genre) => (
              <ChipLabel key={genre} label={genre} />
            ))}
            <ChipLabel label={String(trackDetail.year)} />
          </div>
        </div>
      </section>

      {/* Section Heading */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-spotify-green/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-spotify-green">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="text-[14px] font-bold text-white">Why This Track?</h2>
      </div>

      {/* Confidence Scores */}
      <section className="p-3 rounded-lg bg-spotify-surface border border-white/[0.04] space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          Match Confidence
        </h3>
        <ConfidenceBar label="Mood Match" value={explanation.confidenceScores.mood} color="green" />
        <ConfidenceBar label="Context Match" value={explanation.confidenceScores.context} color="blue" />
        <ConfidenceBar label="Energy Match" value={explanation.confidenceScores.energy} color="purple" />
        <ConfidenceBar label="Novelty" value={explanation.confidenceScores.novelty} color="amber" />
        <ConfidenceBar label="Diversity" value={explanation.confidenceScores.diversity} color="pink" />
      </section>

      {/* Explanation Cards */}
      <section className="space-y-2">
        <ExplanationCard
          icon={<MoodIcon />}
          title="Mood Match"
          content={explanation.moodMatch}
          accentColor="green"
        />
        <ExplanationCard
          icon={<ContextIcon />}
          title="Context Match"
          content={explanation.contextMatch}
          accentColor="blue"
        />
        <ExplanationCard
          icon={<EnergyIcon />}
          title="Energy Match"
          content={explanation.energyMatch}
          accentColor="purple"
        />
        <ExplanationCard
          icon={<IntentIcon />}
          title="Discovery Intent"
          content={explanation.discoveryIntent}
          accentColor="amber"
        />
        <ExplanationCard
          icon={<NoveltyIcon />}
          title="Novelty Level"
          content={explanation.noveltyLevel}
          accentColor="pink"
        />
      </section>

      {/* Rationale */}
      <section className="p-3 rounded-lg bg-spotify-surface border border-white/[0.04] space-y-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          Full Rationale
        </h3>
        <p className="text-[13px] text-white/65 leading-relaxed">
          {explanation.rationale}
        </p>
      </section>

      {/* Audio Features */}
      <section className="p-3 rounded-lg bg-spotify-surface border border-white/[0.04] space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          Audio Features
        </h3>
        <AudioFeatureRadar features={trackDetail.audioFeatures} />
        <p className="text-[10px] font-semibold text-white/40 text-center">
          {trackDetail.audioFeatures.tempo} BPM
        </p>
      </section>

      {/* Back button */}
      <section className="pt-1">
        <button
          onClick={() => router.back()}
          className="w-full py-3 rounded-full bg-spotify-elevated text-white text-[13px] font-semibold border border-white/[0.06] active:scale-[0.97] transition-transform"
        >
          Back to Results
        </button>
      </section>
    </div>
  );
}

function MoodIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-400">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function ContextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EnergyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IntentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function NoveltyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-pink-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
