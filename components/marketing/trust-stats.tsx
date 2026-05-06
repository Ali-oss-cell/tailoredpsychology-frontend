import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent } from "@/components/ui/card"

type TrustStat = {
  value: string
  label: string
}

type TrustStatsProps = {
  stats: TrustStat[]
}

export function TrustStats({ stats }: TrustStatsProps) {
  return (
    <PageContainer>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-surface-1 dark:bg-surface-2 p-0">
            <CardContent className="space-y-1 p-5">
              <p className="font-heading text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
