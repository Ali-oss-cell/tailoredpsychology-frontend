import { matchClinicianCatalog } from "@/content/get-matched-quiz"
import type { MatchedClinician, MatchQuizDraft } from "@/src/get-matched/types"

type CatalogEntry = (typeof matchClinicianCatalog)[number]

function scoreClinician(entry: CatalogEntry, draft: MatchQuizDraft): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  if (draft.state && (entry.states as readonly string[]).includes(draft.state)) {
    score += 40
    reasons.push(`Registered to see clients in ${draft.state}`)
  } else if (draft.state) {
    return { score: 0, reasons: [] }
  }

  const concernOverlap = draft.concerns.filter((c) => entry.concerns.includes(c))
  if (concernOverlap.length > 0) {
    score += concernOverlap.length * 12
    reasons.push("Experience relevant to what you shared")
  }

  if (draft.audience && entry.audiences.includes(draft.audience)) {
    score += 18
    if (draft.audience === "couple") {
      reasons.push("Offers couples therapy")
    } else if (draft.audience === "teen" || draft.audience === "child") {
      reasons.push("Works with younger clients")
    } else {
      reasons.push("Sees individual adults")
    }
  }

  if (draft.genderPreference !== "no_preference" && entry.gender === draft.genderPreference) {
    score += 10
    reasons.push("Matches your clinician gender preference")
  }

  if (draft.language && (entry.languages as readonly string[]).includes(draft.language)) {
    score += 8
    if (draft.language !== "english") {
      reasons.push("Speaks your preferred language")
    }
  }

  if (draft.modality === "telehealth" && (entry.modalities as readonly string[]).includes("telehealth")) {
    score += 6
    reasons.push("Telehealth sessions available")
  } else if (draft.modality === "in_clinic" && (entry.modalities as readonly string[]).includes("in_clinic")) {
    score += 6
    reasons.push("In-clinic sessions when available")
  } else if (draft.modality === "either") {
    score += 4
  }

  if (reasons.length === 0 && score > 0) {
    reasons.push("Strong overall fit for your answers")
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 3) }
}

export function rankMatchedClinicians(draft: MatchQuizDraft, limit = 3): MatchedClinician[] {
  const ranked = matchClinicianCatalog
    .map((entry) => {
      const { score, reasons } = scoreClinician(entry, draft)
      return {
        id: entry.id,
        name: entry.name,
        specialty: entry.specialty,
        bio: entry.bio,
        profileImageUrl: entry.profileImageUrl,
        nextAvailable: entry.nextAvailable,
        matchReasons: reasons,
        score,
      }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) {
    return matchClinicianCatalog.slice(0, limit).map((entry) => ({
      id: entry.id,
      name: entry.name,
      specialty: entry.specialty,
      bio: entry.bio,
      profileImageUrl: entry.profileImageUrl,
      nextAvailable: entry.nextAvailable,
      matchReasons: ["Available for telehealth across Australia — our team can confirm state eligibility at booking."],
      score: 1,
    }))
  }

  return ranked.slice(0, limit)
}
