interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-spotify-elevated" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-aura-purple animate-spin" />
      </div>
      <p className="text-xs text-spotify-text-subdued">{message}</p>
    </div>
  );
}
