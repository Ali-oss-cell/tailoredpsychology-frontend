import { getCurrentUser } from "@/src/auth/current-user"
import { matchQuizToIntakeDelta } from "@/src/get-matched/match-quiz-to-intake"
import type { MatchQuizDraft } from "@/src/get-matched/types"
import { getLatestIntakeDraft, saveIntakeDraftDelta } from "@/src/patient/booking/api"

/** Persists match quiz answers into the patient's latest intake draft (post-register). */
export async function pushMatchQuizToIntakeDraft(quiz: MatchQuizDraft): Promise<void> {
  let user
  try {
    user = await getCurrentUser()
  } catch {
    return
  }
  if (user.role !== "patient") {
    return
  }

  const latest = await getLatestIntakeDraft(user.id)
  const existing = (latest.data ?? {}) as Record<string, unknown>
  const delta = matchQuizToIntakeDelta(quiz, existing)
  await saveIntakeDraftDelta({
    patientId: user.id,
    baseVersion: latest.draftVersion,
    delta,
  })
}
