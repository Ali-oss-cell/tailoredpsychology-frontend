"use client"

import { VideoCamera, Play } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { PATIENT_TELEHEALTH_101_STREAM_ID } from "@/content/tutorials/registry"
import { shouldOfferStream } from "@/src/tutorials/storage"

import { useTutorial } from "@/components/tutorials/tutorial-context"

/**
 * Short telehealth tips tour (Wave 17 / Wave 16 `patient.telehealth_101`). Dashboard only; does not block join.
 */
export function PatientTelehealth101Cta() {
  const tutorial = useTutorial()
  const pathname = usePathname() ?? ""
  const [clientReady, setClientReady] = React.useState(false)

  React.useEffect(() => {
    setClientReady(true)
  }, [])

  if (!clientReady) {
    return null
  }

  const onDashboard = pathname.split("?")[0] === "/patient/dashboard"
  const canOffer = shouldOfferStream(PATIENT_TELEHEALTH_101_STREAM_ID)
  const tourActive = Boolean(tutorial?.activeTourStreamId)

  if (!tutorial || !onDashboard || !canOffer || tourActive || tutorial.isWelcomeOpen) {
    return null
  }

  return (
    <div
      className="border-border/60 bg-muted/20 rounded-xl border p-4 md:flex md:items-center md:justify-between md:gap-4"
      data-testid="patient-telehealth-101-cta"
    >
      <div className="flex gap-3">
        <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <VideoCamera size={22} weight="duotone" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-foreground font-heading text-sm font-semibold tracking-tight">First video visit?</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Two-minute tour: notifications, where to join, and how to test your camera and microphone without starting a
            session.
          </p>
        </div>
      </div>
      <div className="mt-4 shrink-0 md:mt-0">
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2 sm:w-auto"
          onClick={() => tutorial.startTour(PATIENT_TELEHEALTH_101_STREAM_ID)}
        >
          <Play size={18} weight="fill" aria-hidden />
          Telehealth tips tour
        </Button>
      </div>
    </div>
  )
}
