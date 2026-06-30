"use client";

import { getSpotifySearchUrl } from "@/lib/utils/spotify-links";
import type { MockArtist } from "@/lib/utils/mock-recommendations";

interface ArtistCardProps {
  artist: MockArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const formattedFollowers = formatFollowers(artist.followers);

  return (
    <a
      href={getSpotifySearchUrl(artist.name)}
      target="_blank"
      rel="noopener noreferrer"
      className="group snap-start flex-shrink-0 w-[140px] flex flex-col items-center text-center gap-1.5 cursor-pointer rounded-xl p-3 transition-all duration-200 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:brightness-110"
      aria-label={`Open ${artist.name} in Spotify`}
    >
      <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden bg-spotify-elevated ring-1 ring-white/[0.06] group-hover:ring-white/[0.12] transition-all">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-spotify-text-subdued">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        {artist.imageUrl && (
          <img
            src={artist.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      <div className="w-full space-y-px">
        <p className="text-[11px] font-semibold text-white truncate group-hover:text-spotify-green-light transition-colors">
          {artist.name}
        </p>
        <p className="text-[9px] text-white/60">
          {formattedFollowers} followers
        </p>
        <div className="flex flex-wrap justify-center gap-0.5 pt-0.5">
          {artist.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-[8px] font-medium px-1.5 py-px rounded-full bg-white/[0.05] text-white/45"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return String(count);
}
