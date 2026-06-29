"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { VoiceButton } from "@/components/discovery/VoiceButton";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Utterance } from "@/lib/utils/types";

type ConversationState = "idle" | "listening" | "processing" | "error";

export default function ConversationPage() {
  const router = useRouter();
  const isHydrated = useDiscoveryStore((s) => s.isHydrated);
  const context = useDiscoveryStore((s) => s.session.context);
  const utterances = useDiscoveryStore((s) => s.session.utterances);
  const addUtterance = useDiscoveryStore((s) => s.addUtterance);
  const setDiscoveryResult = useDiscoveryStore((s) => s.setDiscoveryResult);
  const setLoading = useDiscoveryStore((s) => s.setLoading);
  const setError = useDiscoveryStore((s) => s.setError);

  const [textInput, setTextInput] = useState("");
  const [interimText, setInterimText] = useState("");
  const [conversationState, setConversationState] = useState<ConversationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [utterances, interimText]);

  const handleSubmit = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setConversationState("processing");
      setErrorMessage(null);
      setTextInput("");
      setInterimText("");

      const userUtterance: Utterance = {
        role: "user",
        text: text.trim(),
        timestamp: Date.now(),
      };
      addUtterance(userUtterance);
      setLoading(true);

      try {
        const res = await fetch("/api/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context,
            utterance: text.trim(),
            history: utterances.slice(-6),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Request failed (${res.status})`);
        }

        const data = await res.json();

        if (data.data?.intent && data.recommendations) {
          setDiscoveryResult(
            data.data,
            data.recommendations,
            data.recommendationSource
          );
        } else if (data.data?.intent) {
          setDiscoveryResult(data.data, [], data.recommendationSource);
        }

        const auraResponse: Utterance = {
          role: "aura",
          text: data.data?.explanation || buildAuraResponse(data.data),
          timestamp: Date.now(),
        };
        addUtterance(auraResponse);
        setConversationState("idle");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setErrorMessage(message);
        setError(message);
        setConversationState("error");

        const auraError: Utterance = {
          role: "aura",
          text: "I had trouble processing that. Could you try again or rephrase?",
          timestamp: Date.now(),
        };
        addUtterance(auraError);
      } finally {
        setLoading(false);
      }
    },
    [context, utterances, addUtterance, setDiscoveryResult, setLoading, setError]
  );

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      handleSubmit(text);
    },
    [handleSubmit]
  );

  const handleInterim = useCallback((text: string) => {
    setInterimText(text);
  }, []);

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSubmit(textInput);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(textInput);
    }
  }

  if (!isHydrated) {
    return <ConversationSkeleton />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pb-3 px-0.5">
        {utterances.length === 0 && !interimText && (
          <EmptyState />
        )}

        {utterances.map((msg, i) => (
          <MessageBubble key={`${msg.timestamp}-${i}`} message={msg} />
        ))}

        {/* Interim transcript (live) */}
        {interimText && (
          <div className="flex justify-end">
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-spotify-green/20 border border-spotify-green/30">
              <p className="text-sm text-spotify-green/80 italic">{interimText}</p>
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {conversationState === "processing" && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-spotify-elevated">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-spotify-green animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-spotify-green animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-spotify-green animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-spotify-text-subdued ml-2">Aura is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {conversationState === "error" && errorMessage && (
        <div className="mx-1 mb-2 px-3 py-2 rounded-lg bg-red-900/20 border border-red-500/20">
          <p className="text-xs text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/[0.04] pt-2.5 pb-1.5 space-y-2.5">
        {/* Voice button centered */}
        <div className="flex justify-center">
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            onInterim={handleInterim}
          />
        </div>

        {/* Text input */}
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Or type your request..."
            disabled={conversationState === "processing"}
            className="flex-1 bg-spotify-elevated rounded-full px-4 py-2.5 text-[13px] text-white placeholder:text-spotify-text-subdued focus:outline-none focus:ring-1 focus:ring-spotify-green/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || conversationState === "processing"}
            className="w-9 h-9 rounded-full bg-spotify-green flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
            aria-label="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* Quick prompts */}
        {utterances.length === 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSubmit(prompt)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-spotify-surface border border-white/[0.04] text-spotify-text-secondary hover:bg-spotify-elevated hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* View results link */}
        {utterances.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/results")}
              className="text-[11px] text-spotify-green font-semibold"
            >
              View Discovery Results →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Utterance }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
          isUser
            ? "rounded-br-sm bg-spotify-green text-black"
            : "rounded-bl-sm bg-spotify-elevated text-white"
        }`}
      >
        {!isUser && (
          <p className="text-[9px] font-semibold text-spotify-green mb-0.5 uppercase tracking-wider">
            Aura
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p className={`text-[9px] mt-1 ${isUser ? "text-black/50" : "text-spotify-text-subdued"}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-14 h-14 rounded-full bg-spotify-elevated flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spotify-green">
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>
      <div className="space-y-0.5">
        <h2 className="text-[14px] font-bold text-white">Voice Discovery</h2>
        <p className="text-[11px] text-spotify-text-secondary max-w-[220px] leading-relaxed">
          Tap the mic and tell Aura what you&apos;re in the mood for. Or type below.
        </p>
      </div>
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4 py-4">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-12 w-3/4 ml-auto rounded-2xl" />
        <Skeleton className="h-16 w-4/5 rounded-2xl" />
        <Skeleton className="h-10 w-2/3 ml-auto rounded-2xl" />
      </div>
      <div className="space-y-3 border-t border-spotify-elevated pt-3">
        <Skeleton className="h-14 w-14 rounded-full mx-auto" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

import type { DiscoveryResponse } from "@/lib/utils/types";

function buildAuraResponse(data: DiscoveryResponse | undefined): string {
  if (!data) return "I've processed your request. Check the results page for discoveries!";
  const parts: string[] = [];
  if (data.strategy) parts.push(data.strategy);
  if (data.recommendedGenres?.length > 0) {
    parts.push(`I'm exploring ${data.recommendedGenres.slice(0, 4).join(", ")} for you.`);
  }
  if (parts.length === 0) return "Got it! I've updated your discovery preferences.";
  return parts.join(" ");
}

const QUICK_PROMPTS = [
  "Something chill for studying",
  "High energy workout music",
  "I'm feeling nostalgic",
  "Surprise me with something new",
  "Late night driving vibes",
];
