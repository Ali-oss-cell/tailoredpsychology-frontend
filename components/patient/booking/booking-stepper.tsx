import { CheckCircle } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import type { BookingStep } from "@/src/patient/booking/types"

type BookingStepperProps = {
  steps: BookingStep[]
  currentIndex: number
}

export function BookingStepper({ steps, currentIndex }: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress">
      <ol
        className={cn(
          "grid gap-3 rounded-2xl border border-border/50 bg-muted/25 p-4 shadow-sm",
          "sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8",
        )}
      >
        {steps.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = !isDone && !isCurrent

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors",
                isCurrent &&
                  "border-primary bg-background text-foreground shadow-sm ring-1 ring-primary/15",
                isDone && "border-border/40 bg-background/80",
                isUpcoming && "border-border/40 bg-background/40",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  isUpcoming && "border-border/70 bg-muted/40 text-muted-foreground",
                )}
              >
                {isDone ? <CheckCircle size={13} weight="bold" /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-xs leading-tight font-medium",
                  isCurrent && "text-foreground",
                  isDone && "text-foreground/80",
                  isUpcoming && "text-muted-foreground",
                )}
              >
                {step.shortLabel}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
