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
      className="group flex-shrink-0 w-[140px] space-y-2 cursor-pointer rounded-lg p-1 -m-1 transition-colors hover:bg-white/[0.03]"
      aria-label={`Open ${playlist.name} in Spotify`}
    >
      <div className="relative w-[140px] h-[140px] rounded-md overflow-hidden bg-spotify-elevated ring-1 ring-transparent group-hover:ring-white/[0.08] group-hover:brightness-110 transition-all">
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
        <p className="text-[12px] font-bold text-white truncate group-hover:text-spotify-green-light transition-colors">
          {playlist.name}
        </p>
        <p className="text-[10px] text-white/45 line-clamp-2 leading-snug">
          {playlist.description}
        </p>
        <p className="text-[9px] font-semibold text-spotify-green opacity-0 group-hover:opacity-100 transition-opacity">
          Open in Spotify
        </p>
      </div>
    </a>
  );
}
