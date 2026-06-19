import { Skeleton } from "@/components/ui/skeleton"

export function UpcomingSessionCardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading upcoming session">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-5 w-36" />
        <div className="space-y-2 text-right">
          <Skeleton className="ml-auto h-6 w-24" />
          <Skeleton className="ml-auto h-4 w-32" />
        </div>
      </div>
      <div className="flex gap-2 border-t border-border/60 pt-4">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  )
}

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

export function BillingSnapshotSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading billing snapshot">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-28 rounded-md" />
    </div>
  )
}
