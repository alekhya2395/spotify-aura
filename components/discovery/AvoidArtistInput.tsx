"use client";

import { useState } from "react";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export function AvoidArtistInput() {
  const [inputValue, setInputValue] = useState("");
  const avoidArtists = useDiscoveryStore((s) => s.session.context.avoidArtists);
  const addAvoidArtist = useDiscoveryStore((s) => s.addAvoidArtist);
  const removeAvoidArtist = useDiscoveryStore((s) => s.removeAvoidArtist);

  const isMaxed = avoidArtists.length >= 10;

  function handleAdd() {
    const name = inputValue.trim();
    if (!name || isMaxed) return;

    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    addAvoidArtist({ id, name });
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-spotify-text-subdued">
          Artists to Avoid
        </h3>
        <span className="text-[10px] text-spotify-text-subdued">
          {avoidArtists.length}/10
        </span>
      </div>

      {avoidArtists.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {avoidArtists.map((artist) => (
            <span
              key={artist.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-spotify-elevated rounded-pill text-xs text-spotify-text-secondary"
            >
              {artist.name}
              <button
                onClick={() => removeAvoidArtist(artist.id)}
                className="text-spotify-text-subdued hover:text-white transition-colors ml-0.5"
                aria-label={`Remove ${artist.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {!isMaxed && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type artist name and press Enter..."
            className="flex-1 bg-spotify-elevated rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-spotify-text-subdued focus:outline-none focus:ring-1 focus:ring-spotify-green/50 transition-shadow"
            maxLength={50}
          />
          <button
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="px-3 py-2.5 bg-spotify-elevated rounded-lg text-sm text-spotify-text-secondary hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {isMaxed && (
        <p className="text-[10px] text-spotify-text-subdued">
          Maximum 10 artists. Remove one to add more.
        </p>
      )}
    </section>
  );
}
