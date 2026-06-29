"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ResultsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center space-y-4 px-6">
      <div className="w-16 h-16 rounded-full bg-spotify-elevated flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-spotify-green"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6M11 8v6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="space-y-1">
        <h2 className="text-[15px] font-bold text-white">No Discoveries Yet</h2>
        <p className="text-[12px] text-spotify-text-secondary max-w-[260px] leading-relaxed">
          Set your mood and context, then let Aura find music that matches your exact vibe.
        </p>
      </div>

      <div className="space-y-2 w-full max-w-[220px]">
        <Link href="/context" className="block">
          <Button variant="primary" fullWidth size="md">
            Set Your Context
          </Button>
        </Link>
        <Link href="/conversation" className="block">
          <Button variant="secondary" fullWidth size="md">
            Start Conversation
          </Button>
        </Link>
      </div>
    </div>
  );
}
