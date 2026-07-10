"use client"

import * as React from "react"

type UseWizardDraftOptions<T> = {
  storageKey: string
  initialValue: T
  /** When true, skip persisting (e.g. submitted state). */
  paused?: boolean
  serialize?: (value: T) => string
  deserialize?: (raw: string) => T | null
}

export function useWizardDraft<T>({
  storageKey,
  initialValue,
  paused = false,
  serialize = JSON.stringify,
  deserialize,
}: UseWizardDraftOptions<T>) {
  const [draft, setDraft] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return initialValue
    try {
      if (deserialize) {
        return deserialize(raw) ?? initialValue
      }
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  React.useEffect(() => {
    if (typeof window === "undefined" || paused) {
      return
    }
    window.localStorage.setItem(storageKey, serialize(draft))
  }, [draft, paused, storageKey, serialize])

  const clearDraft = React.useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  return { draft, setDraft, clearDraft }
}
