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
        "border-border/50 bg-card/95 supports-[backdrop-filter]:bg-card/90 -mx-6 flex flex-wrap justify-end gap-3 border-t px-6 py-4 backdrop-blur-sm",
        "sticky bottom-0 z-10 md:relative md:bottom-auto md:bg-muted/15 md:backdrop-blur-none",
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="min-w-[5.5rem]"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
      >
        Back
      </Button>
      <Button
        type="button"
        size="lg"
        className="min-w-[5.5rem] font-semibold"
        onClick={onNext}
        disabled={isSubmitting}
      >
        {isFinalStep
          ? isSubmitting
            ? "Redirecting to payment…"
            : "Pay & confirm booking"
          : "Continue"}
      </Button>
    </div>
  )
}
