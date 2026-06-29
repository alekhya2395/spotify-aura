"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { buildDefaultUtterance } from "@/lib/utils/build-default-utterance";

export function useStartDiscovery() {
  const router = useRouter();
  const context = useDiscoveryStore((s) => s.session.context);
  const utterances = useDiscoveryStore((s) => s.session.utterances);
  const setDiscoveryResult = useDiscoveryStore((s) => s.setDiscoveryResult);
  const setLoading = useDiscoveryStore((s) => s.setLoading);
  const setError = useDiscoveryStore((s) => s.setError);
  const [isStarting, setIsStarting] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  const clearToastError = useCallback(() => setToastError(null), []);

  const startDiscovery = useCallback(async () => {
    setIsStarting(true);
    setLoading(true);
    setError(null);
    setToastError(null);

    try {
      const utterance = buildDefaultUtterance(context);

      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          utterance,
          history: utterances.slice(-6),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || data.detail || `Request failed (${res.status})`
        );
      }

      const data = await res.json();

      if (!data.data?.intent) {
        throw new Error("Invalid discovery response");
      }

      setDiscoveryResult(
        data.data,
        data.recommendations ?? [],
        data.recommendationSource
      );

      router.push("/results");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Discovery failed. Please try again.";
      setError(message);
      setToastError(message);
    } finally {
      setIsStarting(false);
      setLoading(false);
    }
  }, [
    context,
    utterances,
    router,
    setDiscoveryResult,
    setLoading,
    setError,
  ]);

  return {
    startDiscovery,
    isStarting,
    toastError,
    clearToastError,
  };
}
