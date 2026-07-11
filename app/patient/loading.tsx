export default function PatientLoading() {
  return (
    <div className="space-y-4 p-1" aria-busy="true" aria-label="Loading patient portal">
      <div className="bg-muted/40 h-8 w-48 animate-pulse rounded-lg" />
      <div className="bg-muted/30 h-4 w-full max-w-xl animate-pulse rounded" />
      <div className="bg-muted/20 h-64 animate-pulse rounded-xl border border-border/50" />
    </div>
  )
}
