import { initialMatchQuizDraft } from "@/content/get-matched-quiz"
import type { MatchQuizDraft, MatchQuizStep } from "@/src/get-matched/types"

export const MATCH_QUIZ_STORAGE_KEY = "tp_match_quiz_v1"

export type MatchQuizSession = {
  draft: MatchQuizDraft
  step: MatchQuizStep
}

export function deserializeMatchQuizSession(raw: string): MatchQuizSession | null {
  try {
    const parsed = JSON.parse(raw) as { draft?: MatchQuizDraft; step?: MatchQuizStep }
    if (!parsed.draft || !parsed.step) return null
    return {
      draft: { ...initialMatchQuizDraft, ...parsed.draft },
      step: parsed.step,
    }
  } catch {
    return null
  }
}

/** One-time migration from pre-refactor sessionStorage persistence. */
export function migrateLegacyMatchQuizSession(): MatchQuizSession | null {
  if (typeof window === "undefined") return null
  const legacy = window.sessionStorage.getItem(MATCH_QUIZ_STORAGE_KEY)
  if (!legacy) return null
  const session = deserializeMatchQuizSession(legacy)
  if (session) {
    window.localStorage.setItem(MATCH_QUIZ_STORAGE_KEY, JSON.stringify(session))
  }
  window.sessionStorage.removeItem(MATCH_QUIZ_STORAGE_KEY)
  return session
}

export function loadMatchQuizDraft(): MatchQuizDraft | null {
  const session = loadMatchQuizSession()
  return session?.draft ?? null
}

export function saveMatchQuizDraft(draft: MatchQuizDraft, step: MatchQuizStep): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(MATCH_QUIZ_STORAGE_KEY, JSON.stringify({ draft, step }))
}

export function loadMatchQuizSession(): MatchQuizSession | null {
  if (typeof window === "undefined") return null
  const local = window.localStorage.getItem(MATCH_QUIZ_STORAGE_KEY)
  if (local) return deserializeMatchQuizSession(local)
  return migrateLegacyMatchQuizSession()
}

export function clearMatchQuizSession(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(MATCH_QUIZ_STORAGE_KEY)
  window.sessionStorage.removeItem(MATCH_QUIZ_STORAGE_KEY)
}
