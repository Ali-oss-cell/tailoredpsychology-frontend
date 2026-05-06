"use client"

import { MapTrifold, Play } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { PATIENT_WELCOME_STREAM_ID } from "@/content/tutorials/registry"
import { shouldOfferStream } from "@/src/tutorials/storage"

import { useTutorial } from "@/components/tutorials/tutorial-context"

/**
 * Always-visible entry to the guided tour on onboarding (welcome modal is easy to miss or dismiss).
 */
export function PatientTutorialOnboardingCta() {
  const tutorial = useTutorial()
  const [clientReady, setClientReady] = React.useState(false)

  React.useEffect(() => {
    setClientReady(true)
  }, [])

  // `shouldOfferStream` reads localStorage — must not affect the first paint or SSR and client diverge.
  if (!clientReady) {
    return null
  }

  const canOffer = shouldOfferStream(PATIENT_WELCOME_STREAM_ID)
  const tourActive = Boolean(tutorial?.activeTourStreamId)

  if (!tutorial || !canOffer || tourActive || tutorial.isWelcomeOpen) {
    return null
  }

  return (
    <div
      className="border-primary/25 from-primary/[0.08] to-background bg-gradient-to-r rounded-xl border p-4 shadow-sm md:flex md:items-center md:justify-between md:gap-4 md:p-5"
      data-testid="patient-tutorial-onboarding-cta"
    >
      <div className="flex gap-3">
        <span className="bg-primary/15 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <MapTrifold size={22} weight="duotone" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-foreground font-heading text-sm font-semibold tracking-tight">
            New to the patient portal?
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We&apos;ll spotlight the sidebar, notifications, and profile—use{" "}
            <span className="text-foreground font-medium">Next</span> in each popup to move through the steps. You can
            close anytime.
          </p>
        </div>
      </div>
      <div className="mt-4 shrink-0 md:mt-0">
        <Button type="button" className="w-full gap-2 sm:w-auto" onClick={() => tutorial.startTour(PATIENT_WELCOME_STREAM_ID)}>
          <Play size={18} weight="fill" aria-hidden />
          Start guided tour
        </Button>
      </div>
    </div>
  )
}
