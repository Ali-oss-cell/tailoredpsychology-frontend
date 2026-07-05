import { Skeleton } from "@/components/ui/skeleton"

export function MoodCheckinSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading mood check-in">
      <Skeleton className="mx-auto h-4 w-40" />
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-12 rounded-full" />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-3">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-2.5 w-2.5 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
