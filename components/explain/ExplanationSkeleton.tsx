import { Skeleton } from "@/components/ui/Skeleton";

export function ExplanationSkeleton() {
  return (
    <div className="space-y-5 py-3 animate-in fade-in duration-300">
      <div className="flex gap-3 items-center p-3 rounded-lg bg-spotify-surface border border-white/[0.04]">
        <Skeleton className="w-14 h-14 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-1.5">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-14 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3 rounded-lg bg-spotify-surface border border-white/[0.04]">
        <Skeleton className="h-3 w-28" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
        ))}
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/[0.04] border-l-[3px] border-l-spotify-elevated p-3 bg-spotify-surface space-y-2"
        >
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}
