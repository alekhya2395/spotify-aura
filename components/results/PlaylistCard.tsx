"use client";

import { getSpotifySearchUrl } from "@/lib/utils/spotify-links";
import type { MockPlaylist } from "@/lib/utils/mock-recommendations";

interface PlaylistCardProps {
  playlist: MockPlaylist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <a
      href={getSpotifySearchUrl(playlist.name)}
      target="_blank"
      rel="noopener noreferrer"
      className="group snap-start flex-shrink-0 w-[140px] max-w-[140px] space-y-1.5 cursor-pointer rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
      aria-label={`Open ${playlist.name} in Spotify`}
    >
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-spotify-elevated ring-1 ring-white/[0.06] group-hover:ring-white/[0.12] group-hover:brightness-110 transition-all">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-spotify-text-subdued">
            <path d="M4 6h16M4 10h16M4 14h12M4 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {playlist.imageUrl && (
          <img
            src={playlist.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-bold text-white/80">
            {playlist.trackCount} tracks
          </span>
        </div>
      </div>

      <div className="space-y-0.5">
        <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight group-hover:text-spotify-green-light transition-colors">
          {playlist.name}
        </p>
        <p className="text-[10px] text-white/45 line-clamp-2 leading-snug">
          {playlist.description}
        </p>
        <p className="text-[9px] font-semibold text-spotify-green mt-0.5">
          Open in Spotify
        </p>
      </div>
    </a>
  );
}
