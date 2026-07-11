"use client"

import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getLatestIntakeDraft } from "@/src/patient/booking/api"
import { computeIntakeDraftPercent } from "@/src/patient/booking/intake-draft-progress"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"
import { usePatientPortalContext } from "@/src/patient/use-patient-portal-context"

type FirstTimeDashboardHeroProps = {
  loading?: boolean
}

export function FirstTimeDashboardHero({ loading = false }: FirstTimeDashboardHeroProps) {
  const portalContext = usePatientPortalContext()
  const userQuery = useCurrentUser()
  const [intakePercent, setIntakePercent] = React.useState<number | null>(null)

  React.useEffect(() => {
    const userId = userQuery.data?.id
    if (!userId || userQuery.data?.accountSetupComplete) {
      setIntakePercent(null)
      return
    }

    let cancelled = false
    void getLatestIntakeDraft(userId)
      .then((latest) => {
        if (cancelled) return
        setIntakePercent(
          computeIntakeDraftPercent(latest.data as Parameters<typeof computeIntakeDraftPercent>[0]),
        )
      })
      .catch(() => {
        if (!cancelled) setIntakePercent(null)
      })

    return () => {
      cancelled = true
    }
  }, [userQuery.data?.accountSetupComplete, userQuery.data?.id])

  if (loading || !portalContext.isFirstTime) return null

  const stepKey = portalContext.currentStepKey
  const isIntakeStep = stepKey === "intake_started" || stepKey === "intake_submitted"
  const hasUpcoming = portalContext.hasUpcomingSession

  if (hasUpcoming && !isIntakeStep && stepKey !== "booking_requested") return null

  let title = "Book your first appointment"
  let description = "Choose a time that works for you. We'll guide you through intake questions first."
  let ctaLabel = "Book appointment"
  const showProgress = isIntakeStep && intakePercent !== null && intakePercent > 0

  if (isIntakeStep) {
    title = showProgress ? "Continue your intake" : "Complete your intake"
    description = showProgress
      ? `You're ${intakePercent}% through — pick up where you left off.`
      : "Tell us about yourself so we can match you with the right care."
    ctaLabel = showProgress ? "Continue intake" : "Start intake"
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
          {showProgress ? (
            <div className="pt-1">
              <div
                className="bg-muted h-2 max-w-xs overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={intakePercent ?? 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Intake progress"
              >
                <div
                  className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500"
                  style={{ width: `${intakePercent}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs tabular-nums">{intakePercent}% complete</p>
            </div>
          ) : null}
        </div>
        <Button asChild size="lg" className="w-full shrink-0 rounded-full md:w-auto" data-tutorial="patient.dashboard.hero-book">
          <Link href="/patient/book-appointment">
            {ctaLabel}
            <ArrowRight size={18} aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
