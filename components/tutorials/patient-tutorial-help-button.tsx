"use client"

import { Question } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { PATIENT_TELEHEALTH_101_STREAM_ID, PATIENT_WELCOME_STREAM_ID } from "@/content/tutorials/registry"
import { markStreamCompleted, replayStream } from "@/src/tutorials/storage"

import { useTutorial, WELCOME_AUTO_SUPPRESS_SESSION_KEY } from "@/components/tutorials/tutorial-context"

/**
 * Question-mark entry beside notifications: replay the welcome tour or hide tutorials.
 * Only renders when the patient tutorial provider is active (`NEXT_PUBLIC_TUTORIALS=1`).
 */
export function PatientTutorialHelpButton() {
  const tutorial = useTutorial()
  const [open, setOpen] = React.useState(false)
  const [clientReady, setClientReady] = React.useState(false)
  const wrapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setClientReady(true)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  if (!clientReady || !tutorial) {
    return null
  }

  const tourActive = Boolean(tutorial.activeTourStreamId)

  return (
    <div className="relative" ref={wrapRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Tour help: replay or hide the guided tour"
        data-tutorial="shell.header.tour-help"
        onClick={() => setOpen((o) => !o)}
      >
        <Question size={20} weight="bold" />
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-label="Tour options"
          className="bg-background border-border absolute right-0 z-50 mt-2 w-56 rounded-lg border p-3 shadow-md"
        >
          <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
            Replay the walkthrough, stop the current tour, or hide tutorials for this browser.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                replayStream(PATIENT_WELCOME_STREAM_ID)
                if (typeof window !== "undefined") {
                  window.sessionStorage.removeItem(WELCOME_AUTO_SUPPRESS_SESSION_KEY)
                }
                tutorial.startTour(PATIENT_WELCOME_STREAM_ID)
                setOpen(false)
              }}
            >
              Replay portal tour
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                replayStream(PATIENT_TELEHEALTH_101_STREAM_ID)
                tutorial.startTour(PATIENT_TELEHEALTH_101_STREAM_ID)
                setOpen(false)
              }}
            >
              Replay telehealth tips
            </Button>
            {tourActive ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  tutorial.endTour()
                  setOpen(false)
                }}
              >
                Skip / close tour
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                markStreamCompleted(PATIENT_WELCOME_STREAM_ID)
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem(WELCOME_AUTO_SUPPRESS_SESSION_KEY, "1")
                }
                tutorial.endTour()
                setOpen(false)
              }}
            >
              Don&apos;t show tutorials
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
