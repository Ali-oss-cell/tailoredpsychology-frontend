import { cn } from "@/lib/utils"

type PortalListRowProps = {
  children: React.ReactNode
  className?: string
  highlight?: boolean
}

export function PortalListRow({ children, className, highlight = false }: PortalListRowProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 border-border/50 grid gap-3 rounded-xl border p-3 transition-colors md:px-4 md:py-3",
        highlight && "border-primary/40 bg-primary/5 ring-1 ring-primary/15",
        className,
      )}
    >
      {children}
    </div>
  )
}

type PortalMetricTileProps = {
  label: string
  value: string | number
  className?: string
}

export function PortalMetricTile({ label, value, className }: PortalMetricTileProps) {
  return (
    <div className={cn("bg-muted/30 border-border/50 rounded-xl border p-3", className)}>
      <p className="card-eyebrow">{label}</p>
      <p className="font-heading mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}
