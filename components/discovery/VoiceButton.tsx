"use client";

import { cn } from "@/lib/utils/cn";
import { useVoiceCapture } from "@/lib/utils/voice";
import { useEffect, useRef, useState, useCallback } from "react";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  className?: string;
}

export function VoiceButton({ onTranscript, onInterim, className }: VoiceButtonProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error,
  } = useVoiceCapture();

  const submittedRef = useRef<string | null>(null);

  useEffect(() => {
    if (transcript && !isListening && transcript !== submittedRef.current) {
      submittedRef.current = transcript;
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  useEffect(() => {
    if (interimTranscript && onInterim) {
      onInterim(interimTranscript);
    }
  }, [interimTranscript, onInterim]);

  function handlePress() {
    if (isListening) {
      stopListening();
    } else {
      submittedRef.current = null;
      startListening();
    }
  }

  if (!isSupported) {
    return (
      <WhisperRecordButton onTranscript={onTranscript} className={className} />
    );
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {isListening && (
        <>
          <span className="absolute inset-0 w-14 h-14 rounded-full bg-spotify-green/20 animate-ping" />
          <span className="absolute inset-1 w-12 h-12 rounded-full bg-spotify-green/10 animate-pulse" />
        </>
      )}

      <button
        onClick={handlePress}
        className={cn(
          "relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
          isListening
            ? "bg-spotify-green scale-110 shadow-lg shadow-spotify-green/30"
            : "bg-spotify-elevated hover:bg-spotify-highlight hover:scale-105"
        )}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <WaveformIcon /> : <MicIcon />}
      </button>

      <div className="h-5 mt-2 flex items-center">
        {isListening && (
          <span className="text-[10px] text-spotify-green font-medium animate-pulse">
            Listening...
          </span>
        )}
        {!isListening && confidence > 0 && transcript && (
          <span className="text-[10px] text-spotify-text-subdued">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
        {error && (
          <span className="text-[10px] text-red-400 max-w-[150px] text-center">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

function WhisperRecordButton({
  onTranscript,
  className,
}: {
  onTranscript: (text: string) => void;
  className?: string;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const canRecord =
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia;

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const transcribeAudio = useCallback(
    async (blob: Blob) => {
      setIsTranscribing(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        const res = await fetch("/api/voice/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Transcription failed");
        }

        if (data.text?.trim()) {
          onTranscript(data.text.trim());
        } else {
          setError("No speech detected. Try again or type below.");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Transcription failed";
        setError(message);
      } finally {
        setIsTranscribing(false);
      }
    },
    [onTranscript]
  );

  async function handlePress() {
    if (!canRecord) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stopStream();
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size > 0) {
          await transcribeAudio(blob);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone permission denied.");
      stopStream();
    }
  }

  if (!canRecord) {
    return (
      <div className={cn("relative", className)}>
        <button
          disabled
          className="w-14 h-14 rounded-full bg-spotify-elevated/50 flex items-center justify-center opacity-50 cursor-not-allowed"
          aria-label="Voice input not supported"
        >
          <MicOffIcon />
        </button>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-spotify-text-subdued whitespace-nowrap">
          Use text input
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {isRecording && (
        <span className="absolute inset-0 w-14 h-14 rounded-full bg-spotify-green/20 animate-ping" />
      )}

      <button
        onClick={handlePress}
        disabled={isTranscribing}
        className={cn(
          "relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
          isRecording
            ? "bg-spotify-green scale-110 shadow-lg shadow-spotify-green/30"
            : "bg-spotify-elevated hover:bg-spotify-highlight hover:scale-105",
          isTranscribing && "opacity-50 cursor-wait"
        )}
        aria-label={
          isTranscribing
            ? "Transcribing audio"
            : isRecording
              ? "Stop recording"
              : "Record voice message"
        }
      >
        {isRecording || isTranscribing ? <WaveformIcon /> : <MicIcon />}
      </button>

      <div className="h-5 mt-2 flex items-center">
        {isRecording && (
          <span className="text-[10px] text-spotify-green font-medium animate-pulse">
            Recording...
          </span>
        )}
        {isTranscribing && (
          <span className="text-[10px] text-spotify-text-subdued">
            Transcribing...
          </span>
        )}
        {error && (
          <span className="text-[10px] text-red-400 max-w-[150px] text-center">
            {error}
          </span>
        )}
        {!isRecording && !isTranscribing && !error && (
          <span className="text-[10px] text-spotify-text-subdued">
            Tap to record
          </span>
        )}
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-spotify-text-subdued">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .68-.1 1.34-.28 1.97" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function WaveformIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
      <line x1="4" y1="8" x2="4" y2="16" className="animate-[waveform_0.8s_ease-in-out_infinite]" />
      <line x1="8" y1="5" x2="8" y2="19" className="animate-[waveform_0.6s_ease-in-out_infinite_0.1s]" />
      <line x1="12" y1="3" x2="12" y2="21" className="animate-[waveform_0.7s_ease-in-out_infinite_0.2s]" />
      <line x1="16" y1="5" x2="16" y2="19" className="animate-[waveform_0.6s_ease-in-out_infinite_0.3s]" />
      <line x1="20" y1="8" x2="20" y2="16" className="animate-[waveform_0.8s_ease-in-out_infinite_0.4s]" />
    </svg>
  );
}
