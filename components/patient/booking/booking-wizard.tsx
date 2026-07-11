"use client"

import { WarningCircle } from "@phosphor-icons/react"

import { BookingActions } from "@/components/patient/booking/booking-actions"
import { BookingAppointmentSummaryChip } from "@/components/patient/booking/booking-appointment-summary-chip"
import { BookingDraftStatus } from "@/components/patient/booking/booking-progress-save"
import { BookingStepContent } from "@/components/patient/booking/booking-step-content"
import { BookingStepper } from "@/components/patient/booking/booking-stepper"
import { BookingWizardProvider } from "@/components/patient/booking/booking-wizard-context"
import { useBookingWizard } from "@/components/patient/booking/use-booking-wizard"
import { WhatHappensNext } from "@/components/shared/what-happens-next"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { bookingContent, bookingStepTimeEstimates, bookingStepWhatsNext } from "@/content/patient-booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export { findNextAvailableLabel } from "@/src/patient/booking/booking-schedule-utils"

export function BookingWizard() {
  const wizard = useBookingWizard()

  if (wizard.wizardLoading) {
    return (
      <PatientPortalPage
        title={bookingContent.header.title}
        description={bookingContent.header.description}
        eyebrow="Book care"
        tutorialId="patient.page.book-appointment"
      >
        <DashboardStateBlock variant="loading" message="Preparing your booking…" />
      </PatientPortalPage>
    )
  }

  return (
    <PatientPortalPage
      title={wizard.bookingEligibility.isNewPatient ? "Book your first appointment" : bookingContent.header.title}
      description={
        wizard.bookingEligibility.isNewPatient
          ? "Complete intake questions first, then choose your session time. Follow-up booking is available after your first visit."
          : bookingContent.header.description
      }
      eyebrow="Book care"
      tutorialId="patient.page.book-appointment"
      className="space-y-5 pb-2"
    >
      {wizard.paymentCancelled ? (
        <div className="border-warning/40 bg-warning/10 text-warning-foreground rounded-lg border p-4 text-sm">
          Payment was cancelled. Your slot may still be held briefly — return to review and choose{" "}
          <span className="font-medium">Pay & confirm booking</span> to try again.
        </div>
      ) : null}
      <BookingWizardProvider value={wizard.contextValue}>
        {wizard.activeStep !== "submitted" ? (
          <div className="w-full space-y-4">
            <BookingStepper steps={wizard.visibleSteps} currentIndex={wizard.stepIndex} />
            <Card className="dashboard-card w-full gap-0 overflow-hidden p-0 shadow-e1">
              <CardHeader className="border-border/50 gap-3 border-b px-4 pt-5 pb-4 md:px-6 md:pt-6 md:pb-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="card-eyebrow">
                      Step {wizard.stepIndex + 1} of {wizard.visibleSteps.length}
                    </p>
                    <CardTitle className="text-lg" id="booking-step-title">
                      {wizard.visibleSteps[wizard.stepIndex]?.label ?? "Booking request"}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs font-medium">
                      {bookingStepTimeEstimates[wizard.activeStep]}
                    </p>
                    <WhatHappensNext className="mt-2 border-0 bg-transparent p-0">
                      {bookingStepWhatsNext[wizard.activeStep]}
                    </WhatHappensNext>
                  </div>
                  <BookingDraftStatus
                    syncState={wizard.remoteSyncState}
                    localMessage={bookingContent.helper.save}
                    onRefreshDraft={wizard.refreshRemoteDraft}
                    className="shrink-0 lg:max-w-[14rem]"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-5 px-4 pt-5 pb-0 md:px-6">
                {wizard.errors.length > 0 ? (
                  <div className="border-destructive/40 bg-destructive/10 text-destructive rounded-xl border p-3 text-xs">
                    <p className="mb-2 flex items-center gap-1 font-medium">
                      <WarningCircle size={14} />
                      Please fix the following before continuing:
                    </p>
                    <ul className="list-inside list-disc space-y-1">
                      {wizard.errors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div key={wizard.activeStep} aria-labelledby="booking-step-title">
                  <BookingStepContent step={wizard.activeStep} />
                </div>

                <BookingActions
                  isFirstStep={wizard.isFirstStep}
                  isFinalStep={wizard.isFinalStep}
                  isSubmitting={wizard.isSubmitting}
                  onBack={wizard.goBack}
                  onNext={wizard.goNext}
                />
              </CardContent>
            </Card>
            {wizard.showAppointmentChip ? (
              <BookingAppointmentSummaryChip
                clinicianName={wizard.chipClinicianName}
                dateIso={wizard.draft.scheduleSelection.selectedDate}
                timeLabel={wizard.selectedSlotLabel}
              />
            ) : null}
          </div>
        ) : (
          <Card className="dashboard-card gap-0 overflow-hidden p-0 shadow-e1">
            <CardHeader className="border-border/50 border-b px-6 pt-6 pb-5">
              <p className="card-eyebrow">Complete</p>
              <CardTitle className="text-lg" id="booking-step-title">
                Request received
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-5">
              <div aria-labelledby="booking-step-title">
                <BookingStepContent step="submitted" />
              </div>
            </CardContent>
          </Card>
        )}
      </BookingWizardProvider>
    </PatientPortalPage>
  )
}
