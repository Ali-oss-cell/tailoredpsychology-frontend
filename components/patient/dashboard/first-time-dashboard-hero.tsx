"use client"

import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getActivePatientBookingRequest, getLatestIntakeDraft } from "@/src/patient/booking/api"
import {
  buildIntakeProgressSnapshot,
  type IntakeProgressContext,
} from "@/src/patient/booking/intake-draft-progress"
import type { BookingRequestDraft } from "@/src/patient/booking/types"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"
import { usePatientPortalContext } from "@/src/patient/use-patient-portal-context"

type FirstTimeDashboardHeroProps = {
  loading?: boolean
}

type IntakeHeroState = {
  snapshot: ReturnType<typeof buildIntakeProgressSnapshot>
}

function bookingProgressContext(
  booking: Awaited<ReturnType<typeof getActivePatientBookingRequest>>,
): IntakeProgressContext | undefined {
  if (!booking) return undefined
  if (booking.state === "pending_payment") return { paymentPending: true }
  if (booking.state === "payment_abandoned") return { paymentAbandoned: true }
  return undefined
}

export function FirstTimeDashboardHero({ loading = false }: FirstTimeDashboardHeroProps) {
  const portalContext = usePatientPortalContext()
  const userQuery = useCurrentUser()
  const [intakeHero, setIntakeHero] = React.useState<IntakeHeroState | null>(null)

  React.useEffect(() => {
    const userId = userQuery.data?.id
    if (!userId || userQuery.data?.accountSetupComplete) {
      setIntakeHero(null)
      return
    }

    let cancelled = false
    void Promise.all([getLatestIntakeDraft(userId), getActivePatientBookingRequest().catch(() => null)])
      .then(([latest, activeBooking]) => {
        if (cancelled) return
        const draft = latest.data as Partial<BookingRequestDraft>
        const progressContext = bookingProgressContext(activeBooking)
        const mergedDraft: Partial<BookingRequestDraft> = {
          ...draft,
          wizardMeta: {
            ...(draft.wizardMeta ?? {}),
            pendingBookingRequestId:
              draft.wizardMeta?.pendingBookingRequestId ?? activeBooking?.bookingRequestId,
          },
        }
        setIntakeHero({
          snapshot: buildIntakeProgressSnapshot(mergedDraft, progressContext),
        })
      })
      .catch(() => {
        if (!cancelled) setIntakeHero(null)
      })

    return () => {
      cancelled = true
    }
  }, [userQuery.data?.accountSetupComplete, userQuery.data?.id])

  if (loading || !portalContext.isFirstTime) return null

  const stepKey = portalContext.currentStepKey
  const isIntakeStep = stepKey === "intake_started" || stepKey === "intake_submitted"
  const hasUpcoming = portalContext.hasUpcomingSession
  const intakeSnapshot = intakeHero?.snapshot
  const paymentPhase = intakeSnapshot?.phase === "payment"

  if (hasUpcoming && !isIntakeStep && stepKey !== "booking_requested" && !paymentPhase) return null

  let title = "Book your first appointment"
  let description = "Choose a time that works for you. We'll guide you through intake questions first."
  let ctaLabel = "Book appointment"
  let resumeHref = "/patient/book-appointment"
  const showProgress = Boolean(intakeSnapshot && intakeSnapshot.percent > 0)

  if (isIntakeStep || paymentPhase || intakeSnapshot?.phase === "review" || intakeSnapshot?.phase === "schedule") {
    if (intakeSnapshot) {
      title = intakeSnapshot.heroTitle
      description = intakeSnapshot.heroDescription
      ctaLabel = intakeSnapshot.ctaLabel
      resumeHref = intakeSnapshot.resumeHref
    } else if (isIntakeStep) {
      title = "Complete your intake"
      description = "Tell us about yourself so we can match you with the right care."
      ctaLabel = "Start intake"
    }
  } else if (stepKey === "booking_requested") {
    description = "Intake is saved — choose a session time when you're ready."
  }

  return (
    <Card
      className="dashboard-card border-primary/25 bg-gradient-to-br from-primary/[0.08] via-card to-card shadow-e1"
      data-tutorial="patient.dashboard.first-time-hero"
    >
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h2 className="font-heading text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          {showProgress && intakeSnapshot ? (
            <div className="pt-1">
              <div
                className="bg-muted h-2 max-w-xs overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={intakeSnapshot.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Intake progress"
              >
                <div
                  className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500"
                  style={{ width: `${intakeSnapshot.percent}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs tabular-nums">{intakeSnapshot.percent}% complete</p>
            </div>
          ) : null}
        </div>
        <Button asChild size="lg" className="w-full shrink-0 rounded-full md:w-auto" data-tutorial="patient.dashboard.hero-book">
          <Link href={resumeHref}>
            {ctaLabel}
            <ArrowRight size={18} aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
