import { audienceOptions, concernOptions } from "@/content/get-matched-quiz"
import type { MatchInsurance, MatchQuizDraft } from "@/src/get-matched/types"
import type {
  AppointmentModality,
  BookingRequestDraft,
  ClinicianGender,
} from "@/src/patient/booking/types"

function concernLabels(concerns: MatchQuizDraft["concerns"]): string {
  return concerns
    .map((id) => concernOptions.find((o) => o.value === id)?.label)
    .filter(Boolean)
    .join(", ")
}

function audienceLabel(audience: MatchQuizDraft["audience"]): string {
  if (!audience) return ""
  return audienceOptions.find((o) => o.value === audience)?.label ?? ""
}

function mapInsurance(insurance: MatchInsurance | ""): Partial<BookingRequestDraft["medicarePath"]> {
  switch (insurance) {
    case "medicare_mhtp":
      return { hasMhtp: "yes", hasReferral: "no" }
    case "medicare_unsure":
      return { hasMhtp: "unsure", hasReferral: "no" }
    case "private":
      return { hasMhtp: "no", hasReferral: "no" }
    case "not_sure":
      return { hasMhtp: "unsure", hasReferral: "no" }
    default:
      return {}
  }
}

function mapModality(modality: MatchQuizDraft["modality"]): AppointmentModality {
  if (modality === "in_clinic") return "in_person"
  return modality
}

function mapGender(pref: MatchQuizDraft["genderPreference"]): ClinicianGender {
  return pref
}

function mapLanguage(code: string): string {
  const labels: Record<string, string> = {
    english: "English",
    mandarin: "Mandarin",
    arabic: "Arabic",
    other: "Other / bilingual preferred",
  }
  return labels[code] ?? code
}

/**
 * Builds an intake delta (shallow-merge safe) from match quiz answers.
 * Merges with existing intake sections when `existing` is provided.
 */
export function matchQuizToIntakeDelta(
  quiz: MatchQuizDraft,
  existing: Record<string, unknown> = {},
): Record<string, unknown> {
  const existingPi = (existing.patientIdentity as Record<string, unknown> | undefined) ?? {}
  const existingCare = (existing.careContext as Record<string, unknown> | undefined) ?? {}
  const existingMedicare = (existing.medicarePath as Record<string, unknown> | undefined) ?? {}
  const existingPrefs = (existing.preferences as Record<string, unknown> | undefined) ?? {}

  const displayName = `${quiz.firstName.trim()} ${quiz.lastName.trim()}`.trim()
  const concernText = concernLabels(quiz.concerns)
  const audLabel = audienceLabel(quiz.audience)
  const careLines = [concernText, audLabel ? `Care for: ${audLabel}` : ""].filter(Boolean)
  const presentingConcerns =
    careLines.length > 0 ? careLines.join("\n") : (existingCare.presentingConcerns as string | undefined) ?? ""

  const patientIdentity = {
    ...existingPi,
    ...(displayName ? { fullName: displayName } : {}),
    ...(quiz.email.trim() ? { email: quiz.email.trim().toLowerCase() } : {}),
    ...(quiz.state ? { state: quiz.state } : {}),
  }

  const medicarePath = {
    ...existingMedicare,
    ...mapInsurance(quiz.insurance),
  }

  const preferences = {
    ...existingPrefs,
    modality: mapModality(quiz.modality),
    preferredClinicianGender: mapGender(quiz.genderPreference),
    preferredLanguage: mapLanguage(quiz.language),
  }

  return {
    patientIdentity,
    careContext: {
      ...existingCare,
      ...(presentingConcerns ? { presentingConcerns } : {}),
    },
    medicarePath,
    preferences,
    matchMeta: {
      source: "get_matched_quiz",
      state: quiz.state,
      insurance: quiz.insurance,
      concerns: quiz.concerns,
      audience: quiz.audience,
      syncedAt: new Date().toISOString(),
    },
  }
}
