import Link from "next/link"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type OpsItem = {
  title: string
  subtitle: string
  href?: string
}

type OpsBentoCardProps = {
  items: OpsItem[]
}

export function OpsBentoCard({ items }: OpsBentoCardProps) {
  return (
    <Card className="md:col-span-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? <DashboardStateBlock variant="empty" message="No actions yet." /> : null}
        {items.map((item) =>
          item.href ? (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "hover:bg-muted/70 block w-full rounded-lg border border-border/50 p-3 text-left transition-colors",
              )}
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-muted-foreground text-xs">{item.subtitle}</p>
            </Link>
          ) : (
            <button
              key={item.title}
              type="button"
              className="hover:bg-muted/70 w-full rounded-lg border border-border/50 p-3 text-left transition-colors"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-muted-foreground text-xs">{item.subtitle}</p>
            </button>
          ),
        )}
      </CardContent>
    </Card>
  )
}
