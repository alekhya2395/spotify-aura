"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Spotify Aura]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 px-6">
      <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-red-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-white">Something went wrong</h2>
      <p className="text-sm text-spotify-text-secondary max-w-xs">
        Aura hit an unexpected error. You can try again or return home.
      </p>
      <div className="flex gap-3 pt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full bg-spotify-green text-black text-sm font-bold hover:scale-[1.02] transition-transform"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-spotify-elevated text-white text-sm font-semibold hover:bg-spotify-highlight transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
