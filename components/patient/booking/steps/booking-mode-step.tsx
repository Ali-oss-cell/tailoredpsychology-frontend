"use client"

import { Badge } from "@/components/ui/badge"
import { BookingTypeOptionCard } from "@/components/patient/booking/booking-type-option-card"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { PortalSelect, portalInputClassName } from "@/components/shared/portal-form-field"
import { bookingContent, bookingTypeOptions } from "@/content/patient-booking"

export function BookingModeStep() {
  const { draft, updateDraft, bookingEligibility } = useBookingWizardContext()

  if (bookingEligibility.isNewPatient) {
    return (
      <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Badge className="rounded-full">New patient</Badge>
        <p className="text-sm font-semibold">{bookingContent.newPatient.modeTitle}</p>
        <p className="text-muted-foreground text-sm">{bookingContent.newPatient.modeDescription}</p>
      </div>
    )
  }

  const typeOptions = bookingEligibility.canBookFollowUp
    ? bookingTypeOptions
    : bookingTypeOptions.filter((o) => o.value === "initial")

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{bookingContent.returningPatient.modeDescription}</p>
      {bookingEligibility.canBookFollowUp ? (
        <p className="text-muted-foreground text-xs">
          Welcome back — you have {bookingEligibility.pastAppointmentCount} prior visit
          {bookingEligibility.pastAppointmentCount === 1 ? "" : "s"} on file.
        </p>
      ) : null}
      <div className={`grid gap-4 ${typeOptions.length > 1 ? "md:grid-cols-2" : ""}`}>
        {typeOptions.map((option) => {
          const selected = draft.bookingMeta.bookingType === option.value
          return (
            <BookingTypeOptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={selected}
              onSelect={() =>
                updateDraft("bookingMeta", {
                  bookingType: option.value,
                  changesSinceLastVisit: draft.bookingMeta.changesSinceLastVisit,
                })
              }
            />
          )
        })}
      </div>
      {draft.bookingMeta.bookingType === "follow_up" ? (
        <div className="space-y-2 rounded-xl border border-border/50 bg-muted/15 p-4">
          <label className="text-sm font-medium">Has anything changed since your last visit?</label>
          <PortalSelect
            value={draft.bookingMeta.changesSinceLastVisit}
            onChange={(event) =>
              updateDraft("bookingMeta", {
                ...draft.bookingMeta,
                changesSinceLastVisit: event.target.value as "yes" | "no",
              })
            }
          >
            <option value="no">No major change</option>
            <option value="yes">Yes, there are changes to share</option>
          </PortalSelect>
        </div>
      ) : null}
    </div>
  )
}
