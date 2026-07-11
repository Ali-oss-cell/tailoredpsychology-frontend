import { Info } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"

/** Static info card matching Stitch's appointments-screen "Cancellation Policy" panel. */
export function CancellationPolicyCard() {
  return (
    <Card className="dashboard-card border-info/20 bg-info/5 rounded-2xl shadow-e1">
      <CardContent className="flex gap-3 p-5">
        <Info className="text-info mt-0.5 shrink-0" size={20} weight="duotone" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p className="text-foreground text-sm font-semibold">Cancellation Policy</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Please provide at least 24 hours&apos; notice for cancellations to avoid standard cancellation fees.
            You can reschedule easily through the portal.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
