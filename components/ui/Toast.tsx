"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ToastProps {
  message: string;
  type?: "info" | "error" | "success";
  duration?: number;
  onDismiss: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={cn(
        "fixed top-16 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg transition-all duration-200",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        type === "error" && "bg-red-900/90 text-red-200",
        type === "success" && "bg-green-900/90 text-green-200",
        type === "info" && "bg-spotify-elevated text-spotify-text-secondary"
      )}
    >
      {message}
    </div>
  );
}
