"use client";

import { useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import type { FeedbackAction } from "@/lib/utils/types";

export default function FeedbackPage() {
  const router = useRouter();
  const applyFeedback = useDiscoveryStore((s) => s.applyFeedback);

  function handleFeedback(action: FeedbackAction) {
    applyFeedback(action);
    if (action === "change_mood") {
      router.push("/context");
      return;
    }
    router.push("/conversation");
  }

  return (
    <div className="space-y-6 py-4">
      <section className="text-center space-y-1">
        <h2 className="text-xl font-bold">Discovery Feedback</h2>
        <p className="text-xs text-spotify-text-secondary">
          Help Aura refine your next discovery session.
        </p>
      </section>

      <div className="space-y-3">
        <button
          onClick={() => handleFeedback("more_like_this")}
          className="w-full bg-spotify-elevated rounded-lg px-4 py-3.5 text-sm text-spotify-text-primary text-left hover:bg-spotify-highlight transition-colors"
        >
          More like this
        </button>
        <button
          onClick={() => handleFeedback("more_adventurous")}
          className="w-full bg-spotify-elevated rounded-lg px-4 py-3.5 text-sm text-spotify-text-primary text-left hover:bg-spotify-highlight transition-colors"
        >
          More adventurous
        </button>
        <button
          onClick={() => handleFeedback("less_similar")}
          className="w-full bg-spotify-elevated rounded-lg px-4 py-3.5 text-sm text-spotify-text-primary text-left hover:bg-spotify-highlight transition-colors"
        >
          Less similar
        </button>
        <button
          onClick={() => handleFeedback("change_mood")}
          className="w-full bg-spotify-elevated rounded-lg px-4 py-3.5 text-sm text-spotify-text-primary text-left hover:bg-spotify-highlight transition-colors"
        >
          Change my mood
        </button>
        <button
          onClick={() => router.push("/conversation")}
          className="w-full bg-spotify-green rounded-pill px-4 py-3.5 text-sm font-bold text-black hover:bg-spotify-green-light transition-colors"
        >
          Discover again
        </button>
      </div>
    </div>
  );
}
