import { CheckCircle } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import type { BookingStep } from "@/src/patient/booking/types"

type BookingStepperProps = {
  steps: BookingStep[]
  currentIndex: number
}

export function BookingStepper({ steps, currentIndex }: BookingStepperProps) {
  return (
    <ol className="grid gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 md:grid-cols-4 xl:grid-cols-7">
      {steps.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <li
            key={step.id}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
              isCurrent && "bg-background border border-border/70",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-medium",
                isDone && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary text-primary",
                !isDone && !isCurrent && "border-border text-muted-foreground",
              )}
            >
              {isDone ? <CheckCircle size={12} weight="bold" /> : index + 1}
            </span>
            <span className={cn(isCurrent ? "text-foreground" : "text-muted-foreground")}>
              {step.shortLabel}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

