"use client";

import { cn } from "@/lib/utils/cn";
import { getSpotifySearchUrl } from "@/lib/utils/spotify-links";
import type { TrackRecommendation } from "@/lib/utils/types";

interface TrackCardProps {
  track: TrackRecommendation;
  onExplainClick?: (trackId: string) => void;
}

export function TrackCard({ track, onExplainClick }: TrackCardProps) {
  const noveltyColor = getNoveltyColor(track.noveltyMatch);
  const spotifyUrl = getSpotifySearchUrl(track.title);

  return (
    <div className="group aura-card-hover relative flex gap-3 p-3 rounded-lg border border-white/[0.04] bg-spotify-surface hover:bg-spotify-elevated/80 hover:border-white/[0.08]">
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 rounded-lg cursor-pointer z-0"
        aria-label={`Open ${track.title} in Spotify`}
      />

      <div className="relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-spotify-elevated z-[1] pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center text-spotify-text-subdued">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        {track.albumArt && (
          <img
            src={track.albumArt}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <span className="text-[9px] font-bold text-white">{track.rank}</span>
        </div>
      </div>

      <div className="relative z-[1] flex-1 min-w-0 flex flex-col justify-center gap-1 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-white truncate leading-tight group-hover:text-spotify-green-light transition-colors">
              {track.title}
            </p>
            <p className="text-[12px] text-spotify-text-secondary truncate mt-0.5">
              {track.artist}
            </p>
          </div>
          <span className="inline-flex flex-shrink-0 items-center gap-0.5 text-[9px] font-semibold text-spotify-green/40 group-hover:text-spotify-green transition-colors">
            <SpotifyExternalIcon />
            Spotify
          </span>
        </div>

        <p className="text-[11px] text-white/40 italic leading-snug truncate">
          {track.oneLineHook}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/[0.05] text-white/60">
            {track.vibeMatch.split(" ").slice(0, 3).join(" ")}
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold",
              noveltyColor
            )}
          >
            {track.noveltyMatch.split(" — ")[0]}
          </span>
        </div>
      </div>

      {onExplainClick && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onExplainClick(track.id);
          }}
          className="relative z-[2] flex-shrink-0 self-start p-1.5 rounded-full text-spotify-text-subdued hover:text-spotify-green hover:bg-spotify-green/10 transition-colors cursor-pointer"
          aria-label={`Why ${track.title}?`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
      )}
    </div>
  );
}

function SpotifyExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function getNoveltyColor(noveltyMatch: string): string {
  if (noveltyMatch.toLowerCase().includes("familiar")) {
    return "bg-green-900/30 text-green-400";
  }
  if (noveltyMatch.toLowerCase().includes("adjacent")) {
    return "bg-blue-900/30 text-blue-400";
  }
  if (noveltyMatch.toLowerCase().includes("exploratory")) {
    return "bg-purple-900/30 text-purple-400";
  }
  return "bg-orange-900/30 text-orange-400";
}
