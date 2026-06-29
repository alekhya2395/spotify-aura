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
      className="group flex-shrink-0 w-[120px] flex flex-col items-center text-center space-y-2 cursor-pointer rounded-lg p-1 -m-1 transition-colors hover:bg-white/[0.03]"
      aria-label={`Open ${artist.name} in Spotify`}
    >
      <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden bg-spotify-elevated ring-1 ring-transparent group-hover:ring-white/[0.08] transition-all">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-spotify-text-subdued">
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

      <div className="space-y-0.5 w-full">
        <p className="text-[12px] font-bold text-white truncate group-hover:text-spotify-green-light transition-colors">
          {artist.name}
        </p>
        <p className="text-[10px] text-white/40">
          {formattedFollowers} followers
        </p>
        <p className="text-[9px] font-semibold text-spotify-green opacity-0 group-hover:opacity-100 transition-opacity">
          Open in Spotify
        </p>
        <div className="flex flex-wrap justify-center gap-1 pt-0.5">
          {artist.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-[9px] font-medium px-1.5 py-px rounded-full bg-white/[0.05] text-white/50"
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
