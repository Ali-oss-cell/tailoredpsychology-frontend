"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AdminSnapshotCardProps = {
  title: string
  rows: Array<Record<string, unknown>>
}

export function AdminSnapshotCard({ title, rows }: AdminSnapshotCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((row, idx) => (
          <div key={`${title}-${idx}`} className="grid grid-cols-2 gap-2 rounded-md border border-border/60 bg-muted/40 p-3 md:grid-cols-4">
            {Object.entries(row).map(([key, value]) => (
              <p key={key} className="text-xs">
                <span className="text-muted-foreground">{key}: </span>
                <span>{String(value)}</span>
              </p>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
