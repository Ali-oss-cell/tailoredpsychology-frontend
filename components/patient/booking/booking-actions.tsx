import { Button } from "@/components/ui/button"

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
    <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
      <Button type="button" variant="outline" onClick={onBack} disabled={isFirstStep || isSubmitting}>
        Back
      </Button>
      <Button type="button" onClick={onNext} disabled={isSubmitting}>
        {isFinalStep ? (isSubmitting ? "Submitting..." : "Submit Request") : "Continue"}
      </Button>
    </div>
  )
}

