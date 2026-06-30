"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { TrackCard } from "@/components/results/TrackCard";
import { PlaylistCard } from "@/components/results/PlaylistCard";
import { ArtistCard } from "@/components/results/ArtistCard";
import { DiscoveryScores } from "@/components/results/DiscoveryScores";
import { ChipLabel } from "@/components/ui/Pill";
import { ResultsSkeleton } from "@/components/results/ResultsSkeleton";
import { ResultsEmpty } from "@/components/results/ResultsEmpty";
import { ResultsError } from "@/components/results/ResultsError";
import {
  MOCK_TRACK_RECOMMENDATIONS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
  MOCK_DISCOVERY_META,
} from "@/lib/utils/mock-recommendations";

type ViewState = "loading" | "empty" | "results" | "error";

export default function ResultsPage() {
  const router = useRouter();
  const isHydrated = useDiscoveryStore((s) => s.isHydrated);
  const recommendations = useDiscoveryStore((s) => s.session.recommendations);
  const lastIntent = useDiscoveryStore((s) => s.session.lastIntent);
  const discoveryMeta = useDiscoveryStore((s) => s.session.discoveryMeta);
  const context = useDiscoveryStore((s) => s.session.context);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    // Simulate loading and decide state
    const timer = setTimeout(() => {
      if (recommendations.length > 0) {
        setViewState("results");
      } else if (lastIntent && discoveryMeta) {
        setErrorMessage("No recommendations were found. Try discovering again.");
        setViewState("error");
      } else if (context.mood || context.activity || lastIntent) {
        setViewState("results");
      } else {
        setViewState("empty");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isHydrated, recommendations, discoveryMeta, context.mood, context.activity, lastIntent]);

  function handleExplainClick(trackId: string) {
    router.push(`/why/${trackId}`);
  }

  function handleRetry() {
    setViewState("loading");
    setErrorMessage(null);
    setTimeout(() => {
      setViewState("results");
    }, 1000);
  }

  if (!isHydrated || viewState === "loading") {
    return <ResultsSkeleton />;
  }

  if (viewState === "error") {
    return <ResultsError message={errorMessage || undefined} onRetry={handleRetry} />;
  }

  if (viewState === "empty") {
    return <ResultsEmpty />;
  }

  // Use real recommendations if available, otherwise use mocked data
  const tracks = recommendations.length > 0
    ? recommendations
    : MOCK_TRACK_RECOMMENDATIONS;
  const meta = discoveryMeta ?? MOCK_DISCOVERY_META;
  const artists = MOCK_ARTISTS;
  const playlists = MOCK_PLAYLISTS;

  return (
    <div className="space-y-5 pb-6">
      {/* Discovery Header */}
      <section className="space-y-1.5 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-spotify-green animate-pulse" />
          <h1 className="text-[17px] font-bold tracking-tight text-white">Your Discovery</h1>
        </div>
        <p className="text-[13px] text-white/60 leading-relaxed">
          {meta.explanation}
        </p>
      </section>

      {/* Strategy */}
      <section className="p-3 rounded-lg bg-spotify-surface border border-white/[0.04]">
        <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1 font-bold">
          Strategy
        </p>
        <p className="text-[13px] text-white/65 leading-relaxed">
          {meta.strategy}
        </p>
      </section>

      {/* Discovery Scores */}
      <section className="space-y-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          Discovery Metrics
        </h2>
        <DiscoveryScores
          noveltyScore={meta.noveltyScore}
          diversityScore={meta.diversityScore}
          energy={context.energy}
        />
      </section>

      {/* Genre Seeds */}
      <section className="space-y-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          Genre Seeds
        </h2>
        <div className="aura-chip-grid">
          {meta.recommendedGenres.map((genre) => (
            <ChipLabel key={genre} label={genre} />
          ))}
        </div>
      </section>

      {/* Track Recommendations */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-white">
            Recommended Tracks
          </h2>
          <span className="text-[10px] font-semibold text-white/40 bg-white/[0.04] px-2 py-0.5 rounded-full">
            {tracks.length} tracks
          </span>
        </div>
        <div className="space-y-1.5">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onExplainClick={handleExplainClick}
            />
          ))}
        </div>
      </section>

      {/* Suggested Artists */}
      <section className="space-y-2.5">
        <h2 className="text-[14px] font-bold text-white">Artists to Explore</h2>
        <div className="-mx-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide">
          <div className="flex flex-nowrap gap-4 w-max px-4 pr-6 pb-3">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Playlists */}
      <section className="space-y-2.5">
        <h2 className="text-[14px] font-bold text-white">Curated for You</h2>
        <div className="-mx-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide">
          <div className="flex flex-nowrap gap-4 w-max px-4 pr-6 pb-3">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="flex gap-2.5 pt-1">
        <button
          onClick={() => router.push("/feedback")}
          className="flex-1 py-3 rounded-full bg-spotify-green text-black text-[13px] font-bold active:scale-[0.97] transition-transform"
        >
          Rate Discovery
        </button>
        <button
          onClick={() => router.push("/context")}
          className="flex-1 py-3 rounded-full bg-spotify-elevated text-white text-[13px] font-semibold border border-white/[0.06] active:scale-[0.97] transition-transform"
        >
          Refine Context
        </button>
      </section>
    </div>
  );
}
