"use client"

import { BookingTypeOptionCard } from "@/components/patient/booking/booking-type-option-card"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { StepIntro } from "@/components/shared/step-intro"
import { PortalSelect } from "@/components/shared/portal-form-field"
import { Badge } from "@/components/ui/badge"
import { bookingContent, bookingTypeOptions } from "@/content/patient-booking"

export function BookingModeStep() {
  const { draft, updateDraft, bookingEligibility } = useBookingWizardContext()

  if (bookingEligibility.isNewPatient) {
    return (
      <div className="space-y-5">
        <StepIntro
          title="Your first appointment"
          description="We'll guide you through intake questions before you choose a session time."
        />
        <div className="dashboard-card rounded-dashboard-card border-primary/25 from-primary/5 to-card space-y-3 border bg-gradient-to-br p-5">
          <Badge variant="secondary" className="rounded-full">
            New patient
          </Badge>
          <p className="text-sm font-semibold">{bookingContent.newPatient.modeTitle}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{bookingContent.newPatient.modeDescription}</p>
        </div>
      </div>
    )
  }

  const typeOptions = bookingEligibility.canBookFollowUp
    ? bookingTypeOptions
    : bookingTypeOptions.filter((o) => o.value === "initial")

  return (
    <div className="space-y-5">
      <StepIntro
        title="Booking type"
        description={bookingContent.returningPatient.modeDescription}
      />
      {bookingEligibility.canBookFollowUp ? (
        <p className="text-muted-foreground text-sm">
          Welcome back — you have {bookingEligibility.pastAppointmentCount} prior visit
          {bookingEligibility.pastAppointmentCount === 1 ? "" : "s"} on file.
        </p>
      ) : null}
      <div className={`grid gap-4 ${typeOptions.length > 1 ? "md:grid-cols-2" : ""}`} id="booking-type">
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
        <div className="dashboard-card rounded-dashboard-card border-border/50 bg-muted/15 space-y-3 p-5">
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
