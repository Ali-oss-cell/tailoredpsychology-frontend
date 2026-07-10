"use client"

import Link from "next/link"
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChatCircle,
  CheckCircle,
  CircleNotch,
  SealCheck,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { PatientTutorialOnboardingCta } from "@/components/tutorials/patient-tutorial-onboarding-cta"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { EmptyState, EmptyStateAction } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/src/auth/current-user"
import { getLatestIntakeDraft } from "@/src/patient/booking/api"
import { computeIntakeDraftPercent } from "@/src/patient/booking/intake-draft-progress"

const steps = [
  {
    title: "Confirm your profile",
    description:
      "Check your display name, email, and password. Turn on notifications so we can reach you about sessions.",
    href: "/patient/account",
    icon: UserCircle,
    accent: "from-sky-500/15 to-sky-500/5",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  {
    title: "Complete booking intake",
    description:
      "Australian telehealth details: identity, Medicare path, safety contact, and consents. You can save progress and return anytime.",
    href: "/patient/book-appointment",
    icon: BookOpen,
    accent: "from-primary/20 to-primary/5",
    iconClass: "text-primary",
  },
  {
    title: "Stay in the loop",
    description: "Open the bell for welcome messages, reminders before visits, and clinic updates.",
    href: "/patient/dashboard?openNotifications=1",
    icon: Bell,
    accent: "from-violet-500/15 to-violet-500/5",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
] as const

function firstName(displayName: string): string {
  const part = displayName.trim().split(/\s+/)[0]
  return part || "there"
}

export function PatientOnboardingChecklist() {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [complete, setComplete] = React.useState<boolean | null>(null)
  const [displayName, setDisplayName] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)
  const [intakePercent, setIntakePercent] = React.useState<number | null>(null)

  const refreshStatus = React.useCallback(async () => {
    setError(null)
    setIsRefreshing(true)
    try {
      const user = await getCurrentUser()
      setComplete(user.accountSetupComplete)
      setDisplayName(user.displayName)
      if (user.role === "patient" && !user.accountSetupComplete) {
        try {
          const latest = await getLatestIntakeDraft(user.id)
          setIntakePercent(computeIntakeDraftPercent(latest.data as Parameters<typeof computeIntakeDraftPercent>[0]))
        } catch {
          setIntakePercent(null)
        }
      } else {
        setIntakePercent(null)
      }
      window.dispatchEvent(new Event("clink:current-user-invalidated"))
    } catch {
      setComplete(null)
      setDisplayName("")
      setError("We could not load your account status. Try again.")
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      void refreshStatus()
    }, 0)
    return () => window.clearTimeout(id)
  }, [refreshStatus])

  const greeting = displayName ? `Welcome, ${firstName(displayName)}` : "Welcome to Tailored Psychology"

  return (
    <PatientPortalPage
      title="Get set for care"
      description="A short path so your profile, intake, and notifications are ready before your first session. Your progress syncs automatically when required fields are saved."
      eyebrow="Onboarding"
      tutorialId="patient.page.onboarding"
      className="mx-auto max-w-5xl pb-8"
    >

      <PatientTutorialOnboardingCta />

      {/* Hero status */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-6 shadow-sm md:p-8",
          "border-border/80 bg-gradient-to-br from-primary/[0.07] via-background to-background",
          "ring-1 ring-primary/10",
        )}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary/15 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
                <Sparkle size={14} weight="fill" aria-hidden />
                Onboarding
              </span>
              {complete !== null ? (
                <Badge variant={complete ? "default" : "secondary"} className="font-medium">
                  {complete ? "Setup complete" : intakePercent !== null ? `Intake ~${intakePercent}%` : "Action needed"}
                </Badge>
              ) : (
                <Badge variant="outline" className="font-normal text-muted-foreground">
                  Checking…
                </Badge>
              )}
            </div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{greeting}</h2>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed md:text-base">
              {complete === true
                ? "You are ready to book, join sessions, and use the patient portal without missing critical steps."
                : complete === false
                  ? "Finish the intake inside booking when you are ready — legal name, date of birth, mobile, email, and all three consents must be saved. Then refresh here to confirm."
                  : "Loading your account status from the server…"}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
            {complete === true ? (
              <Button asChild className="gap-2 shadow-sm">
                <Link href="/patient/dashboard">
                  Open dashboard
                  <ArrowRight size={16} weight="bold" aria-hidden />
                </Link>
              </Button>
            ) : (
              <Button asChild className="gap-2 shadow-sm">
                <Link href="/patient/book-appointment">
                  {complete === false ? "Continue intake" : "Start booking"}
                  <ArrowRight size={16} weight="bold" aria-hidden />
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              onClick={() => void refreshStatus()}
              className="gap-2 border-border/80"
            >
              {isRefreshing ? (
                <>
                  <CircleNotch className="animate-spin" size={16} aria-hidden />
                  Checking…
                </>
              ) : (
                "Refresh status"
              )}
            </Button>
          </div>
        </div>

        {complete !== null ? (
          <div
            className={cn(
              "relative mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm md:mt-8 md:p-5",
              complete
                ? "border-success/25 bg-success/10"
                : "border-warning/30 bg-warning/10",
            )}
            role="status"
            aria-live="polite"
          >
            {complete ? (
              <SealCheck className="text-success mt-0.5 shrink-0" size={22} weight="fill" aria-hidden />
            ) : (
              <CheckCircle className="text-warning mt-0.5 shrink-0" size={22} weight="duotone" aria-hidden />
            )}
            <div className="min-w-0 space-y-1 leading-relaxed">
              <p className="font-medium text-foreground">
                {complete ? "Account setup looks complete from the server." : "Intake still in progress"}
              </p>
              <p className="text-muted-foreground">
                {complete
                  ? "You can move on to appointments, billing, and session chat when your window opens."
                  : "Use the checklist below, save your booking intake, then tap Refresh status so we can confirm."}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3 md:mt-8" aria-hidden>
            <div className="bg-muted/80 h-3 w-full max-w-md animate-pulse rounded-full" />
            <div className="bg-muted/60 h-3 w-2/3 max-w-sm animate-pulse rounded-full" />
          </div>
        )}
      </div>

      {error ? (
        <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-lg border px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold tracking-tight">Your checklist</h3>
              <p className="text-muted-foreground mt-1 text-sm">Three focused steps — tap a card to continue.</p>
            </div>
          </div>

          <ol className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const highlightIncomplete = complete === false && index === 1
              const doneAll = complete === true
              return (
                <li key={step.href}>
                  <Card
                    className={cn(
                      "overflow-hidden transition-shadow duration-200 hover:shadow-md",
                      highlightIncomplete && "ring-2 ring-warning/35 border-warning",
                      doneAll && "border-success/20",
                    )}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div
                          className={cn(
                            "relative flex min-h-[7rem] flex-1 flex-col justify-center gap-3 p-5 sm:flex-row sm:items-start sm:gap-4",
                            "bg-gradient-to-br to-transparent",
                            step.accent,
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/90 shadow-sm backdrop-blur-sm",
                              step.iconClass,
                            )}
                          >
                            <Icon size={26} weight="duotone" aria-hidden />
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                Step {index + 1}
                              </span>
                              {doneAll ? (
                                <span className="text-success inline-flex items-center gap-1 text-xs font-medium">
                                  <CheckCircle size={14} weight="fill" aria-hidden />
                                  Done
                                </span>
                              ) : null}
                              {highlightIncomplete ? (
                                <span className="text-warning text-xs font-medium">Recommended next</span>
                              ) : null}
                            </div>
                            <p className="font-heading text-lg font-semibold tracking-tight">{step.title}</p>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                        <div className="border-border/60 flex items-center justify-end border-t p-4 sm:w-44 sm:border-l sm:border-t-0 sm:justify-center sm:p-5">
                          <Button asChild variant={highlightIncomplete ? "default" : "outline"} size="sm" className="w-full gap-1.5 sm:w-auto">
                            <Link href={step.href}>
                              Go
                              <ArrowRight size={14} weight="bold" aria-hidden />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ol>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <Card className="border-primary/15 bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Why these steps?</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Clinics need verified identity and consents before telehealth. Notifications keep you on time for visits
                and paperwork.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed border-border/80">
            <CardContent className="pt-6">
              <EmptyState
                className="border-none bg-transparent px-0 py-0"
                icon={<ChatCircle className="text-primary" size={24} weight="duotone" aria-hidden />}
                title="Session chat"
                description="Chat unlocks when you have an upcoming appointment and the pre-session window is active. Until then, use notifications and your dashboard quick actions."
                action={<EmptyStateAction href="/patient/dashboard" label="View dashboard" />}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </PatientPortalPage>
  )
}
