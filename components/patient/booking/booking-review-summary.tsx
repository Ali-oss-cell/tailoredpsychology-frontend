import type * as React from "react"

import {
  appointmentModalityOptions,
  bookingTypeLabels,
  clinicianGenderOptions,
  indigenousStatusOptions,
  mhtpStatusLabels,
  preferredContactMethodOptions,
  referralSourceOptions,
  riskFlagLabels,
  yesNoLabels,
} from "@/content/patient-booking"
import { australianStates } from "@/content/get-matched-quiz"
import { formatDateAu, australianEasternTimezoneLabel } from "@/src/lib/format-au"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

type BookingReviewSummaryProps = {
  draft: BookingRequestDraft
  clinicianName: string
  slotDate: string
  slotTimeLabel: string
}

function labelFor<T extends string>(
  value: T,
  options: readonly { value: T | ""; label: string }[],
): string {
  return options.find((opt) => opt.value === value)?.label ?? value
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dashboard-card rounded-dashboard-card border-border/50 space-y-2 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <div className="text-muted-foreground space-y-1 text-xs leading-relaxed">{children}</div>
    </div>
  )
}

export function BookingReviewSummary({
  draft,
  clinicianName,
  slotDate,
  slotTimeLabel,
}: BookingReviewSummaryProps) {
  const stateLabel = australianStates.find((s) => s.value === draft.patientIdentity.state)?.label
  const contactLabel = labelFor(draft.patientIdentity.preferredContactMethod, preferredContactMethodOptions)
  const modalityLabel = labelFor(draft.preferences.modality, appointmentModalityOptions)
  const genderLabel = labelFor(draft.preferences.preferredClinicianGender, clinicianGenderOptions)
  const indigenousLabel = labelFor(draft.patientIdentity.indigenousStatus, indigenousStatusOptions)
  const referralTypeLabel = draft.medicarePath.referralType
    ? labelFor(draft.medicarePath.referralType, referralSourceOptions)
    : "—"

  return (
    <div className="space-y-5">
      <div className="from-primary/8 via-card to-card rounded-dashboard-card border-primary/25 relative overflow-hidden border bg-gradient-to-br p-6 shadow-e1">
        <p className="text-primary text-xs font-semibold tracking-wide uppercase">Review before payment</p>
        <h3 className="font-heading mt-2 text-xl font-semibold tracking-tight">
          {clinicianName !== "Not selected" ? clinicianName : "Your appointment"}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {bookingTypeLabels[draft.bookingMeta.bookingType]} ·{" "}
          {slotDate ? formatDateAu(`${slotDate}T12:00:00`) : "Date not selected"} ·{" "}
          {slotTimeLabel || "Time not selected"} ·{" "}
          {australianEasternTimezoneLabel(`${slotDate || new Date().toISOString()}T12:00:00`)}
        </p>
        <p className="text-muted-foreground mt-3 text-xs">
          Confirm details below, then continue to secure payment.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ReviewSection title="Patient and contact">
          <p>
            {draft.patientIdentity.fullName || "—"} · {draft.patientIdentity.mobile || "—"} ·{" "}
            {draft.patientIdentity.email || "No email entered"}
          </p>
          {draft.patientIdentity.suburb || draft.patientIdentity.state ? (
            <p>
              {draft.patientIdentity.suburb}
              {draft.patientIdentity.suburb && stateLabel ? ", " : ""}
              {stateLabel ?? draft.patientIdentity.state}
            </p>
          ) : null}
          <p>Preferred contact: {contactLabel}</p>
          {draft.patientIdentity.dateOfBirth ? (
            <p>Date of birth: {formatDateAu(`${draft.patientIdentity.dateOfBirth}T12:00:00`)}</p>
          ) : null}
          {draft.patientIdentity.indigenousStatus ? <p>Indigenous status: {indigenousLabel}</p> : null}
        </ReviewSection>

        <ReviewSection title="Care summary">
          <p>{draft.careContext.presentingConcerns || "—"}</p>
          <p>Urgency: {riskFlagLabels[draft.careContext.riskFlag]}</p>
          {draft.careContext.symptomDuration ? <p>Duration: {draft.careContext.symptomDuration}</p> : null}
        </ReviewSection>

        <ReviewSection title="Medicare and referral">
          <p>
            MHTP: {mhtpStatusLabels[draft.medicarePath.hasMhtp]} · Referral:{" "}
            {yesNoLabels[draft.medicarePath.hasReferral]}
            {draft.medicarePath.hasReferral === "yes" ? ` (${referralTypeLabel})` : ""}
          </p>
        </ReviewSection>

        <ReviewSection title="Session preferences">
          <p>
            Format: {modalityLabel} · Clinician gender: {genderLabel}
            {draft.preferences.preferredLanguage ? ` · Language: ${draft.preferences.preferredLanguage}` : ""}
          </p>
        </ReviewSection>

        <ReviewSection title="Telehealth safety">
          <p>Session location: {draft.telehealthSafety.currentSessionLocation || "—"}</p>
          <p>
            Emergency contact: {draft.telehealthSafety.emergencyContactName || "—"}
            {draft.telehealthSafety.emergencyContactPhone
              ? ` · ${draft.telehealthSafety.emergencyContactPhone}`
              : ""}
            {draft.telehealthSafety.emergencyContactRelationship
              ? ` (${draft.telehealthSafety.emergencyContactRelationship})`
              : ""}
          </p>
        </ReviewSection>

        <ReviewSection title="Referral PDF">
          <p>
            {draft.referralFile.fileName
              ? `${draft.referralFile.fileName} (${Math.round(draft.referralFile.fileSize / 1024)} KB)`
              : "No file uploaded"}
          </p>
        </ReviewSection>
      </div>
    </div>
  )
}
