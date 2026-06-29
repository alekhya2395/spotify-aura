"use client";

import { Button } from "@/components/ui/Button";

interface ResultsErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ResultsError({ message, onRetry }: ResultsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-5 px-6">
      {/* Error icon */}
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
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-white">Discovery Failed</h2>
        <p className="text-sm text-spotify-text-secondary max-w-[280px] leading-relaxed">
          {message || "Something went wrong while generating your recommendations. Please try again."}
        </p>
      </div>

      {/* Retry */}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
