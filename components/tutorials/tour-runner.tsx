"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Config, DriveStep } from "driver.js"
import { driver } from "driver.js"

import "driver.js/dist/driver.css"

import {
  getTutorialStepsForStream,
  PATIENT_TELEHEALTH_101_LAST_STEP_ID,
  PATIENT_TELEHEALTH_101_STREAM_ID,
  PATIENT_WELCOME_LAST_STEP_ID,
  PATIENT_WELCOME_STREAM_ID,
} from "@/content/tutorials/registry"
import { TUTORIAL_EXPAND_PATIENT_SIDEBAR } from "@/src/tutorials/events"
import type { TutorialStepDef } from "@/src/tutorials/types"

/** driver.js leaves a single global overlay; destroy any stray instance before starting another (remounts, strict mode). */
let clinkDriverSingleton: ReturnType<typeof driver> | null = null

function destroyClinkDriverSingleton(): void {
  try {
    clinkDriverSingleton?.destroy()
  } catch {
    /* noop */
  }
  clinkDriverSingleton = null
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function pathMatchesRoutePrefix(pathname: string, routePrefix: string): boolean {
  const p = pathname.split("?")[0]
  return p === routePrefix || p.startsWith(`${routePrefix}/`)
}

/**
 * One ordered list for the whole Driver session — never `setSteps` again after `drive()`.
 * Only the onboarding-only step is omitted when the tour did not start from onboarding.
 */
function sessionDefsForPatientWelcome(all: TutorialStepDef[], entryPath: string): TutorialStepDef[] {
  const startedOnOnboarding = pathMatchesRoutePrefix(entryPath, "/patient/onboarding")
  if (startedOnOnboarding) return [...all]
  return all.filter((d) => d.id !== "patient.welcome.onboarding_area")
}

function toDriveStep(def: TutorialStepDef, streamProgress: { current: number; total: number }): DriveStep {
  return {
    element: `[data-tutorial="${def.target}"]`,
    popover: {
      title: def.title,
      description: def.body,
      side: def.side ?? "right",
      align: def.align ?? "start",
      showButtons: ["next", "previous", "close"],
      showProgress: true,
      progressText: `${streamProgress.current} of ${streamProgress.total}`,
    },
  }
}

/** Full ordered steps for Driver — every authored step is present; Driver resolves selectors when each step activates. */
function buildImmutableDriveSteps(sessionDefs: TutorialStepDef[]): { steps: DriveStep[]; defs: TutorialStepDef[] } {
  const total = sessionDefs.length
  const steps = sessionDefs.map((def, i) => toDriveStep(def, { current: i + 1, total }))
  return { steps, defs: sessionDefs }
}

function firstStepIndexWithDomTarget(sessionDefs: TutorialStepDef[]): number {
  for (let i = 0; i < sessionDefs.length; i++) {
    const t = sessionDefs[i]!.target
    if (document.querySelector(`[data-tutorial="${t}"]`)) return i
  }
  return 0
}

function patientTourExpandSidebarStream(streamId: string | null): boolean {
  return streamId === PATIENT_WELCOME_STREAM_ID || streamId === PATIENT_TELEHEALTH_101_STREAM_ID
}

function lastStepIdForStream(streamId: string | null): string | null {
  if (streamId === PATIENT_WELCOME_STREAM_ID) return PATIENT_WELCOME_LAST_STEP_ID
  if (streamId === PATIENT_TELEHEALTH_101_STREAM_ID) return PATIENT_TELEHEALTH_101_LAST_STEP_ID
  return null
}

function nextDefIdAfter(sessionDefs: TutorialStepDef[], currentId: string | null): string | null {
  if (!currentId) return null
  const i = sessionDefs.findIndex((d) => d.id === currentId)
  if (i < 0 || i + 1 >= sessionDefs.length) return null
  return sessionDefs[i + 1]!.id
}

type TourRunnerProps = {
  streamId: string | null
  onClose: (completed: boolean) => void
}

export function TourRunner({ streamId, onClose }: TourRunnerProps) {
  const router = useRouter()
  const routerRef = React.useRef(router)
  routerRef.current = router
  const pathname = usePathname() ?? ""
  const pathnameRef = React.useRef(pathname)
  pathnameRef.current = pathname

  const maxIndexReached = React.useRef(0)
  const driverRef = React.useRef<ReturnType<typeof driver> | null>(null)
  const defsForTourRef = React.useRef<TutorialStepDef[]>([])
  const visitedStepIdsRef = React.useRef<Set<string>>(new Set())
  /** Set before `router.push` from a step; pathname effect consumes it and calls `moveTo` only (no `setSteps`). */
  const pendingHighlightDefIdRef = React.useRef<string | null>(null)
  const pathnameSyncTimerRef = React.useRef<number | null>(null)

  const jumpToDefIdAfterRoute = React.useCallback((pendingDefId: string) => {
    const d = driverRef.current
    if (!d?.isActive()) return

    const session = defsForTourRef.current
    const idx = session.findIndex((x) => x.id === pendingDefId)
    if (idx < 0) return

    if (patientTourExpandSidebarStream(streamId)) {
      window.dispatchEvent(new Event(TUTORIAL_EXPAND_PATIENT_SIDEBAR))
    }

    const reduceMotion = prefersReducedMotion()
    d.moveTo(idx)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const dr = driverRef.current
        if (!dr?.isActive()) return
        dr.refresh()
        const el = dr.getActiveElement?.()
        if (el && el instanceof HTMLElement) {
          el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })
        }
      })
    })
  }, [streamId])

  React.useLayoutEffect(() => {
    if (!streamId) return

    const allDefs = getTutorialStepsForStream(streamId)
    if (!allDefs?.length) {
      onClose(false)
      return
    }

    const entryPath = pathnameRef.current.split("?")[0]
    const sessionDefs =
      streamId === PATIENT_WELCOME_STREAM_ID
        ? sessionDefsForPatientWelcome(allDefs, entryPath)
        : [...allDefs]

    let cancelled = false

    const startDelayMs = patientTourExpandSidebarStream(streamId) ? 90 : 0
    if (patientTourExpandSidebarStream(streamId)) {
      window.dispatchEvent(new Event(TUTORIAL_EXPAND_PATIENT_SIDEBAR))
    }

    const startTimer = window.setTimeout(() => {
      if (cancelled) return

      visitedStepIdsRef.current = new Set()
      pendingHighlightDefIdRef.current = null

      const { steps, defs } = buildImmutableDriveSteps(sessionDefs)
      defsForTourRef.current = defs

      if (steps.length === 0) {
        onClose(false)
        return
      }

      maxIndexReached.current = 0

      const reduceMotion = prefersReducedMotion()

      const advanceOrPush = (dr: ReturnType<typeof driver>) => {
        const idx = dr.getActiveIndex() ?? 0
        const def = defsForTourRef.current[idx]
        const push = def?.pushPathOnNext?.trim()
        if (push) {
          const currentPath = pathnameRef.current.split("?")[0]
          if (currentPath === push || currentPath.startsWith(`${push}/`)) {
            dr.moveNext()
            return
          }
          pendingHighlightDefIdRef.current = nextDefIdAfter(defsForTourRef.current, def?.id ?? null)
          routerRef.current.push(push)
          return
        }
        dr.moveNext()
      }

      const config: Config = {
        showProgress: true,
        animate: !reduceMotion,
        smoothScroll: !reduceMotion,
        allowClose: true,
        overlayOpacity: 0.45,
        stagePadding: 10,
        stageRadius: 10,
        popoverOffset: 14,
        popoverClass: "clink-driver-popover",
        overlayClickBehavior: "close",
        disableActiveInteraction: false,
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        onNextClick: (_element, _step, { driver: dr }) => {
          advanceOrPush(dr)
        },
        onHighlighted: (element, _step, { driver: dr }) => {
          if (element && element instanceof HTMLElement) {
            element.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })
          }
          const idx = dr.getActiveIndex()
          if (typeof idx === "number") {
            maxIndexReached.current = Math.max(maxIndexReached.current, idx)
            const id = defsForTourRef.current[idx]?.id
            if (id) {
              visitedStepIdsRef.current.add(id)
            }
          }
        },
        onDestroyed: () => {
          driverRef.current = null
          if (clinkDriverSingleton === d) {
            clinkDriverSingleton = null
          }
          const n = defsForTourRef.current.length
          const reachedLastIndex = n > 0 && maxIndexReached.current >= n - 1
          const lastId = lastStepIdForStream(streamId)
          const sawFinal = lastId ? visitedStepIdsRef.current.has(lastId) : false
          onClose(sawFinal || reachedLastIndex)
        },
        steps,
      }

      destroyClinkDriverSingleton()
      const d = driver(config)
      clinkDriverSingleton = d
      driverRef.current = d
      const startIdx = firstStepIndexWithDomTarget(defs)
      d.drive(startIdx)
    }, startDelayMs)

    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      if (pathnameSyncTimerRef.current) {
        window.clearTimeout(pathnameSyncTimerRef.current)
        pathnameSyncTimerRef.current = null
      }
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy()
      }
      if (clinkDriverSingleton === driverRef.current) {
        clinkDriverSingleton = null
      }
      driverRef.current = null
    }
  }, [streamId, onClose])

  React.useEffect(() => {
    if (!streamId) return

    if (pathnameSyncTimerRef.current) {
      window.clearTimeout(pathnameSyncTimerRef.current)
    }

    pathnameSyncTimerRef.current = window.setTimeout(() => {
      pathnameSyncTimerRef.current = null
      const pending = pendingHighlightDefIdRef.current
      if (!pending) return

      pendingHighlightDefIdRef.current = null
      jumpToDefIdAfterRoute(pending)
    }, 320)

    return () => {
      if (pathnameSyncTimerRef.current) {
        window.clearTimeout(pathnameSyncTimerRef.current)
        pathnameSyncTimerRef.current = null
      }
    }
  }, [pathname, streamId, jumpToDefIdAfterRoute])

  return null
}
