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
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Appointment selection</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          {bookingTypeLabels[draft.bookingMeta.bookingType]} · {clinicianName} ·{" "}
          {slotDate ? formatDateAu(`${slotDate}T12:00:00`) : "Date not selected"} ·{" "}
          {slotTimeLabel || "Time not selected"} · {australianEasternTimezoneLabel(`${slotDate || new Date().toISOString()}T12:00:00`)}
        </p>
      </div>
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Patient and contact</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          {draft.patientIdentity.fullName || "—"} · {draft.patientIdentity.mobile || "—"} ·{" "}
          {draft.patientIdentity.email || "No email entered"}
        </p>
        {draft.patientIdentity.suburb || draft.patientIdentity.state ? (
          <p className="text-muted-foreground mt-1 text-xs">
            {draft.patientIdentity.suburb}
            {draft.patientIdentity.suburb && stateLabel ? ", " : ""}
            {stateLabel ?? draft.patientIdentity.state}
          </p>
        ) : null}
        <p className="text-muted-foreground mt-1 text-xs">Preferred contact: {contactLabel}</p>
        {draft.patientIdentity.dateOfBirth ? (
          <p className="text-muted-foreground mt-1 text-xs">
            Date of birth: {formatDateAu(`${draft.patientIdentity.dateOfBirth}T12:00:00`)}
          </p>
        ) : null}
        {draft.patientIdentity.indigenousStatus ? (
          <p className="text-muted-foreground mt-1 text-xs">Indigenous status: {indigenousLabel}</p>
        ) : null}
      </div>
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Care summary</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          {draft.careContext.presentingConcerns || "—"}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Urgency: {riskFlagLabels[draft.careContext.riskFlag]}
        </p>
        {draft.careContext.symptomDuration ? (
          <p className="text-muted-foreground mt-1 text-xs">Duration: {draft.careContext.symptomDuration}</p>
        ) : null}
      </div>
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Medicare and referral</p>
        <p className="text-muted-foreground mt-1 text-xs">
          MHTP: {mhtpStatusLabels[draft.medicarePath.hasMhtp]} · Referral:{" "}
          {yesNoLabels[draft.medicarePath.hasReferral]}
          {draft.medicarePath.hasReferral === "yes" ? ` (${referralTypeLabel})` : ""}
        </p>
      </div>
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Session preferences</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Format: {modalityLabel} · Clinician gender: {genderLabel}
          {draft.preferences.preferredLanguage ? ` · Language: ${draft.preferences.preferredLanguage}` : ""}
        </p>
      </div>
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Telehealth safety</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Session location: {draft.telehealthSafety.currentSessionLocation || "—"}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Emergency contact: {draft.telehealthSafety.emergencyContactName || "—"}
          {draft.telehealthSafety.emergencyContactPhone
            ? ` · ${draft.telehealthSafety.emergencyContactPhone}`
            : ""}
          {draft.telehealthSafety.emergencyContactRelationship
            ? ` (${draft.telehealthSafety.emergencyContactRelationship})`
            : ""}
        </p>
      </div>
      <div className="rounded-lg border border-border/60 p-3">
        <p className="text-sm font-medium">Referral PDF</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {draft.referralFile.fileName
            ? `${draft.referralFile.fileName} (${Math.round(draft.referralFile.fileSize / 1024)} KB)`
            : "No file uploaded"}
        </p>
      </div>
    </div>
  )
}
