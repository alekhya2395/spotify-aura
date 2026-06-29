import { Skeleton } from "@/components/ui/Skeleton";

export function ResultsSkeleton() {
  return (
    <div className="space-y-5 py-3 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>

      <Skeleton className="h-16 w-full rounded-lg" />

      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="aura-chip-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 rounded-full" />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg border border-white/[0.03] bg-spotify-surface">
            <Skeleton className="w-14 h-14 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2 py-0.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
