import { initialMatchQuizDraft } from "@/content/get-matched-quiz"
import type { MatchQuizDraft, MatchQuizStep } from "@/src/get-matched/types"

const STORAGE_KEY = "tp_match_quiz_v1"

export function loadMatchQuizDraft(): MatchQuizDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return { ...initialMatchQuizDraft, ...(JSON.parse(raw) as Partial<MatchQuizDraft>) }
  } catch {
    return null
  }
}

export function saveMatchQuizDraft(draft: MatchQuizDraft, step: MatchQuizStep): void {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, step }))
}

export function loadMatchQuizSession(): { draft: MatchQuizDraft; step: MatchQuizStep } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
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

export function clearMatchQuizSession(): void {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(STORAGE_KEY)
}
