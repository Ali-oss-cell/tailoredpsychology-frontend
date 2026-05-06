import { Skeleton } from "@/components/ui/skeleton"

/** Matches schedule step grid: clinician cards + calendar block (Wave 14). */
export function BookingScheduleSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading availability">
      <div className="grid gap-3 md:grid-cols-2">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="rounded-xl border border-border/60 bg-muted/25 p-4">
          <div className="mb-3 flex justify-between">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
