import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BookingActionsProps = {
  isFirstStep: boolean
  isFinalStep: boolean
  isSubmitting?: boolean
  onBack: () => void
  onNext: () => void
}

export function BookingActions({
  isFirstStep,
  isFinalStep,
  isSubmitting = false,
  onBack,
  onNext,
}: BookingActionsProps) {
  return (
    <div
      className={cn(
        "border-border/50 bg-muted/15 -mx-6 flex flex-wrap justify-end gap-3 border-t px-6 py-4",
      )}
    >
      <Button
        type="button"
        variant="outline"
        className="min-w-[5.5rem] rounded-lg"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
      >
        Back
      </Button>
      <Button type="button" className="min-w-[5.5rem] rounded-lg" onClick={onNext} disabled={isSubmitting}>
        {isFinalStep
          ? isSubmitting
            ? "Redirecting to payment…"
            : "Pay & confirm booking"
          : "Continue"}
      </Button>
    </div>
  )
}
