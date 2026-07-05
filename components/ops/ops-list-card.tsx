import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OpsListRow = Record<string, string>

type OpsListCardProps = {
  title: string
  rows: readonly OpsListRow[]
}

export function OpsListCard({ title, rows }: OpsListCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Records</p>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? <DashboardStateBlock variant="empty" message="No items yet." /> : null}
        {rows.map((row, index) => (
          <div
            key={`${title}-${index}`}
            className="bg-muted/40 border-border/60 grid grid-cols-2 gap-2 rounded-lg border p-3 md:grid-cols-4"
          >
            {Object.values(row).map((value, valueIndex) => (
              <p key={`${index}-${valueIndex}`} className="text-sm">
                {value === "Open" ? (
                  <span
                    className="bg-muted text-muted-foreground inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                    title="Not interactive in this release."
                  >
                    Planned
                  </span>
                ) : (
                  value
                )}
              </p>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
