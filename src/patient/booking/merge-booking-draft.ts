import type { MatchQuizDraft } from "@/src/get-matched/types"
import { matchQuizToIntakeDelta } from "@/src/get-matched/match-quiz-to-intake"
import type { CurrentUser } from "@/src/auth/current-user"
import type { BookingRequestDraft, IndigenousStatusOption } from "@/src/patient/booking/types"

function fill(current: string, next: string | undefined): string {
  if (current.trim().length > 0) {
    return current
  }
  return next?.trim() ?? ""
}

function asIndigenousStatus(value: string | undefined): IndigenousStatusOption {
  const allowed: IndigenousStatusOption[] = [
    "",
    "aboriginal",
    "torres_strait_islander",
    "both",
    "neither",
    "prefer_not_to_say",
  ]
  if (value && allowed.includes(value as IndigenousStatusOption)) {
    return value as IndigenousStatusOption
  }
  return ""
}

export type MergeBookingDraftSources = {
  intake?: Partial<BookingRequestDraft>
  user?: CurrentUser | null
  matchQuiz?: MatchQuizDraft | null
}

/**
 * Merges remote intake, account profile, and local match quiz into the booking draft.
 * Account email is always authoritative; other fields fill empty draft slots only.
 */
export function mergeBookingDraftFromSources(
  draft: BookingRequestDraft,
  sources: MergeBookingDraftSources,
): BookingRequestDraft {
  const intake = sources.intake ?? {}
  const fromQuiz = sources.matchQuiz ? (matchQuizToIntakeDelta(sources.matchQuiz) as Partial<BookingRequestDraft>) : {}

  const merged: BookingRequestDraft = {
    ...draft,
    ...intake,
    bookingMeta: { ...draft.bookingMeta, ...(intake.bookingMeta ?? {}) },
    scheduleSelection: { ...draft.scheduleSelection, ...(intake.scheduleSelection ?? {}) },
    patientIdentity: {
      ...draft.patientIdentity,
      ...(intake.patientIdentity ?? {}),
      ...(fromQuiz.patientIdentity ?? {}),
    },
    careContext: {
      ...draft.careContext,
      ...(intake.careContext ?? {}),
      ...(fromQuiz.careContext ?? {}),
    },
    medicarePath: {
      ...draft.medicarePath,
      ...(intake.medicarePath ?? {}),
      ...(fromQuiz.medicarePath ?? {}),
    },
    telehealthSafety: { ...draft.telehealthSafety, ...(intake.telehealthSafety ?? {}) },
    referralFile: {
      ...draft.referralFile,
      ...(intake.referralFile ?? {}),
      file: null,
    },
    preferences: {
      ...draft.preferences,
      ...(intake.preferences ?? {}),
      ...(fromQuiz.preferences ?? {}),
    },
    consents: { ...draft.consents, ...(intake.consents ?? {}) },
  }

  const user = sources.user
  if (user?.role === "patient") {
    merged.patientIdentity.email = user.email
    merged.patientIdentity.fullName = fill(merged.patientIdentity.fullName, user.displayName)
    const contact = user.patientContactProfile
    if (contact) {
      merged.patientIdentity.mobile = fill(merged.patientIdentity.mobile, contact.phoneMobile)
      if (!merged.patientIdentity.preferredContactMethod && contact.preferredContactMethod) {
        merged.patientIdentity.preferredContactMethod = contact.preferredContactMethod
      }
      merged.telehealthSafety.emergencyContactName = fill(
        merged.telehealthSafety.emergencyContactName,
        contact.emergencyContactName,
      )
      merged.telehealthSafety.emergencyContactPhone = fill(
        merged.telehealthSafety.emergencyContactPhone,
        contact.emergencyContactPhone,
      )
      merged.telehealthSafety.emergencyContactRelationship = fill(
        merged.telehealthSafety.emergencyContactRelationship,
        contact.emergencyContactRelationship,
      )
    }
    const demographics = user.patientDemographics
    if (demographics) {
      merged.patientIdentity.dateOfBirth = fill(merged.patientIdentity.dateOfBirth, demographics.dateOfBirth)
      merged.patientIdentity.state = fill(merged.patientIdentity.state, demographics.state)
      merged.patientIdentity.suburb = fill(merged.patientIdentity.suburb, demographics.suburb)
      if (!merged.patientIdentity.indigenousStatus && demographics.indigenousStatus) {
        merged.patientIdentity.indigenousStatus = asIndigenousStatus(demographics.indigenousStatus)
      }
    }
  }

  return merged
}
