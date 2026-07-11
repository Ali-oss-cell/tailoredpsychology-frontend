import { Check } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import type { BookingStep } from "@/src/patient/booking/types"

type BookingStepperProps = {
  steps: BookingStep[]
  currentIndex: number
}

export function BookingStepper({ steps, currentIndex }: BookingStepperProps) {
  const doneCount = currentIndex
  const pct = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0

  return (
    <nav aria-label="Booking progress" className="dashboard-card rounded-dashboard-card overflow-hidden">
      <div className="border-border/50 space-y-3 border-b px-4 py-4 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-foreground text-sm font-medium">
            Step {currentIndex + 1} of {steps.length}
          </p>
          <p className="text-muted-foreground text-xs tabular-nums">
            {doneCount} of {steps.length} completed
          </p>
        </div>
        <div
          className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Booking progress"
        >
          <div
            className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ol className="chat-scroll flex snap-x items-start gap-0 overflow-x-auto px-4 py-5 md:px-6">
        {steps.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = !isDone && !isCurrent
          const connectorFilled = index > 0 && index <= currentIndex

          return (
            <li key={step.id} className="flex shrink-0 items-start">
              {index > 0 ? (
                <div
                  aria-hidden
                  className={cn(
                    "mt-6 h-0.5 min-w-6 flex-1 rounded-full transition-colors duration-500",
                    connectorFilled ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex w-[5.25rem] shrink-0 snap-start flex-col items-center gap-2 rounded-lg px-1 text-center",
                  isCurrent && "scale-105",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-250",
                    isDone && "border-primary bg-primary text-primary-foreground h-11 w-11",
                    isCurrent && "border-primary bg-primary text-primary-foreground shadow-primary-glow h-12 w-12",
                    isUpcoming && "border-border bg-card text-muted-foreground h-11 w-11",
                  )}
                >
                  {isDone ? <Check size={18} weight="bold" aria-hidden /> : <span className="text-sm">{index + 1}</span>}
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-tight font-medium",
                    isCurrent ? "text-foreground" : isDone ? "text-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {step.shortLabel}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
