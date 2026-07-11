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
    <nav aria-label="Booking progress" className="dashboard-card w-full rounded-dashboard-card overflow-hidden">
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

      <ol className="chat-scroll flex snap-x items-start gap-0 overflow-x-auto px-3 py-4 md:px-5 md:py-5 lg:overflow-visible lg:px-6">
        {steps.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = !isDone && !isCurrent
          const connectorFilled = index > 0 && index <= currentIndex

          return (
            <li key={step.id} className="flex min-w-[4.5rem] flex-1 items-start lg:min-w-0">
              {index > 0 ? (
                <div
                  aria-hidden
                  className={cn(
                    "mt-5 h-0.5 min-w-4 flex-1 rounded-full transition-colors duration-500 lg:mt-6",
                    connectorFilled ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex w-full min-w-[4.5rem] shrink-0 snap-start flex-col items-center gap-2 px-1 text-center lg:min-w-0",
                  isCurrent && "scale-105",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 font-semibold transition-colors duration-250",
                    isDone && "border-primary bg-primary text-primary-foreground h-10 w-10 md:h-11 md:w-11",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground shadow-primary-glow h-11 w-11 md:h-12 md:w-12",
                    isUpcoming && "border-border bg-card text-muted-foreground h-10 w-10 md:h-11 md:w-11",
                  )}
                >
                  {isDone ? <Check size={18} weight="bold" aria-hidden /> : <span className="text-sm">{index + 1}</span>}
                </span>
                <span
                  className={cn(
                    "max-w-[5.5rem] text-[11px] leading-tight font-medium lg:max-w-none",
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
