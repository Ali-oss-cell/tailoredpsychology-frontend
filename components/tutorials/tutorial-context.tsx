"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { PATIENT_WELCOME_STREAM_ID } from "@/content/tutorials/registry"
import { tutorialsEnabled } from "@/src/tutorials/flags"
import {
  ensureTutorialVersionMigrated,
  markStreamCompleted,
  shouldOfferStream,
  snoozeStream,
} from "@/src/tutorials/storage"

import { TutorialWelcomeDialog } from "@/components/tutorials/tutorial-welcome-dialog"
import { TourRunner } from "@/components/tutorials/tour-runner"

type TutorialContextValue = {
  activeTourStreamId: string | null
  /** True while the welcome layer is visible (avoid duplicate “start tour” prompts). */
  isWelcomeOpen: boolean
  startTour: (streamId: string) => void
  endTour: () => void
}

const TutorialContext = React.createContext<TutorialContextValue | null>(null)

export function useTutorial(): TutorialContextValue | null {
  return React.useContext(TutorialContext)
}

const WELCOME_DELAY_MS = 500
const SNOOZE_DAYS = 3

/** After the user starts the spotlight tour once, do not auto-open the welcome modal again this tab session (CTA / ? still work). */
export const WELCOME_AUTO_SUPPRESS_SESSION_KEY = "clink_tutorial_suppress_auto_welcome_session"

/** Registration sends patients here first; dashboard is the other common entry. */
const WELCOME_ELIGIBLE_PATHS = new Set(["/patient/dashboard", "/patient/onboarding"])

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ""
  const [welcomeOpen, setWelcomeOpen] = React.useState(false)
  const [activeTourStreamId, setActiveTourStreamId] = React.useState<string | null>(null)
  /** Bumps when starting (or restarting) a tour so `TourRunner` remounts even for the same stream id. */
  const [tourNonce, setTourNonce] = React.useState(0)

  React.useEffect(() => {
    ensureTutorialVersionMigrated()
  }, [])

  React.useEffect(() => {
    if (!tutorialsEnabled()) return
    if (!WELCOME_ELIGIBLE_PATHS.has(pathname)) {
      setWelcomeOpen(false)
      return
    }
    if (activeTourStreamId) {
      setWelcomeOpen(false)
      return
    }
    if (typeof window !== "undefined" && window.sessionStorage.getItem(WELCOME_AUTO_SUPPRESS_SESSION_KEY) === "1") {
      return
    }
    if (!shouldOfferStream(PATIENT_WELCOME_STREAM_ID)) return
    const timer = window.setTimeout(() => setWelcomeOpen(true), WELCOME_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [pathname, activeTourStreamId])

  const startTour = React.useCallback((streamId: string) => {
    setWelcomeOpen(false)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(WELCOME_AUTO_SUPPRESS_SESSION_KEY, "1")
    }
    setActiveTourStreamId(streamId)
    setTourNonce((n) => n + 1)
  }, [])

  const endTour = React.useCallback(() => {
    setActiveTourStreamId(null)
  }, [])

  const onStartTour = React.useCallback(() => {
    startTour(PATIENT_WELCOME_STREAM_ID)
  }, [startTour])

  const onSnooze = React.useCallback(() => {
    snoozeStream(PATIENT_WELCOME_STREAM_ID, SNOOZE_DAYS)
    setWelcomeOpen(false)
  }, [])

  const onDismissForever = React.useCallback(() => {
    markStreamCompleted(PATIENT_WELCOME_STREAM_ID)
    setWelcomeOpen(false)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(WELCOME_AUTO_SUPPRESS_SESSION_KEY, "1")
    }
  }, [])

  const handleTourClose = React.useCallback((completed: boolean) => {
    setActiveTourStreamId((current) => {
      if (completed && current) {
        markStreamCompleted(current)
      }
      return null
    })
  }, [])

  const value = React.useMemo(
    () => ({ activeTourStreamId, isWelcomeOpen: welcomeOpen, startTour, endTour }),
    [activeTourStreamId, welcomeOpen, startTour, endTour],
  )

  return (
    <TutorialContext.Provider value={value}>
      {children}
      <TutorialWelcomeDialog
        open={welcomeOpen && !activeTourStreamId}
        title="Welcome to your patient portal"
        description="You can manage appointments, see updates in notifications, and adjust account settings from here. This short tour highlights where everything lives—you can skip anytime."
        onStartTour={onStartTour}
        onSnooze={onSnooze}
        onDismissForever={onDismissForever}
      />
      <TourRunner key={tourNonce} streamId={activeTourStreamId} onClose={handleTourClose} />
    </TutorialContext.Provider>
  )
}
