"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PatientError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Card className="dashboard-card max-w-lg">
      <CardContent className="space-y-4 p-6">
        <h2 className="font-heading text-lg font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We could not load this part of your patient portal. You can try again or return to your dashboard.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/patient/dashboard">Go to dashboard</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
