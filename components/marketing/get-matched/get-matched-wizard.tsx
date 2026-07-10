"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { CaretLeft, CaretRight, Lock } from "@phosphor-icons/react"

import { QuizChoiceGrid } from "@/components/marketing/get-matched/quiz-choice-grid"
import { PageContainer } from "@/components/layout/page-container"
import { ClinicianPublicProfileHeader } from "@/components/shared/clinician-public-profile-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { AuthField } from "@/components/auth/auth-field"
import { WhatHappensNext } from "@/components/shared/what-happens-next"
import { PASSWORD_HINT, isPasswordLongEnough } from "@/src/auth/password-policy"
import { PortalFormField, PortalSelect } from "@/components/shared/portal-form-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  audienceOptions,
  concernOptions,
  genderPreferenceOptions,
  getMatchedQuizContent,
  initialMatchQuizDraft,
  insuranceOptions,
  languageOptions,
  modalityOptions,
  australianStates,
} from "@/content/get-matched-quiz"
import { registerWithBackend } from "@/src/auth/api"
import { getCurrentUser } from "@/src/auth/current-user"
import { rankMatchedClinicians } from "@/src/get-matched/match-clinicians"
import { pushMatchQuizToIntakeDraft } from "@/src/get-matched/push-match-quiz-intake"
import {
  MATCH_QUIZ_STORAGE_KEY,
  deserializeMatchQuizSession,
  migrateLegacyMatchQuizSession,
  type MatchQuizSession,
} from "@/src/get-matched/storage"
import type { MatchConcern, MatchQuizDraft, MatchQuizStep, MatchedClinician } from "@/src/get-matched/types"
import { useWizardDraft } from "@/src/patient/booking/use-wizard-draft"

const STEP_ORDER: MatchQuizStep[] = ["location", "concerns", "audience", "preferences", "account", "results"]

const INITIAL_SESSION: MatchQuizSession = {
  draft: initialMatchQuizDraft,
  step: "location",
}

function stepIndex(step: MatchQuizStep): number {
  return STEP_ORDER.indexOf(step)
}

function validateStep(step: MatchQuizStep, draft: MatchQuizDraft, acceptedTerms: boolean): string[] {
  const errors: string[] = []
  if (step === "location") {
    if (!draft.state) errors.push("Please select your state or territory.")
    if (!draft.insurance) errors.push("Please select how you plan to fund sessions.")
  }
  if (step === "concerns" && draft.concerns.length === 0) {
    errors.push("Please select at least one option.")
  }
  if (step === "audience" && !draft.audience) {
    errors.push("Please select who this care is for.")
  }
  if (step === "account") {
    if (!draft.firstName.trim() || !draft.lastName.trim()) errors.push("Please enter your name.")
    if (!draft.email.trim()) errors.push("Please enter your email.")
    if (!isPasswordLongEnough(draft.password)) errors.push("Password must be at least 8 characters.")
    if (!acceptedTerms) errors.push("Please accept the terms and privacy policy.")
  }
  return errors
}

export function GetMatchedWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [persistPaused, setPersistPaused] = React.useState(() => {
    if (typeof window === "undefined") return false
    migrateLegacyMatchQuizSession()
    const raw = window.localStorage.getItem(MATCH_QUIZ_STORAGE_KEY)
    const restored = raw ? deserializeMatchQuizSession(raw) : null
    return restored?.step === "results"
  })
  const {
    draft: session,
    setDraft: setSession,
  } = useWizardDraft<MatchQuizSession>({
    storageKey: MATCH_QUIZ_STORAGE_KEY,
    initialValue: INITIAL_SESSION,
    paused: persistPaused,
    deserialize: (raw) => deserializeMatchQuizSession(raw) ?? migrateLegacyMatchQuizSession(),
  })
  const step = session.step
  const draft = session.draft
  const [errors, setErrors] = React.useState<string[]>([])
  const [matches, setMatches] = React.useState<MatchedClinician[]>([])
  const [isPatientLoggedIn, setIsPatientLoggedIn] = React.useState(false)
  const [authChecked, setAuthChecked] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)

  React.useEffect(() => {
    migrateLegacyMatchQuizSession()
    if (session.step === "results") {
      setPersistPaused(true)
      setMatches(rankMatchedClinicians(session.draft))
    }
    const seeded = searchParams.get("condition")
    if (seeded) {
      const validConcerns = new Set(concernOptions.map((option) => option.value))
      const slug = seeded as MatchConcern
      if (validConcerns.has(slug)) {
        setSession((current) => {
          if (current.step !== "location" || current.draft.concerns.length > 0) {
            return current
          }
          return {
            ...current,
            draft: {
              ...current.draft,
              concerns: [slug],
            },
          }
        })
      }
    }
    void (async () => {
      try {
        const user = await getCurrentUser()
        setIsPatientLoggedIn(user.role === "patient")
        if (user.role === "patient" && user.email) {
          const parts = user.displayName.trim().split(/\s+/)
          setSession((current) => ({
            ...current,
            draft: {
              ...current.draft,
              email: current.draft.email || user.email,
              firstName: current.draft.firstName || parts[0] || "",
              lastName: current.draft.lastName || parts.slice(1).join(" ") || "",
            },
          }))
        }
      } catch {
        setIsPatientLoggedIn(false)
      } finally {
        setAuthChecked(true)
        setHydrated(true)
      }
    })()
    // Run once on mount for legacy migration, URL seeding, and auth hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleSteps = React.useMemo(
    () => (isPatientLoggedIn ? STEP_ORDER.filter((s) => s !== "account") : STEP_ORDER),
    [isPatientLoggedIn],
  )

  const progressSteps = visibleSteps.filter((s): s is Exclude<MatchQuizStep, "results"> => s !== "results")
  const progressCurrent = step === "results" ? progressSteps.length : progressSteps.indexOf(step as Exclude<MatchQuizStep, "results">) + 1
  const progressTotal = progressSteps.length

  function patchDraft(patch: Partial<MatchQuizDraft>) {
    setSession((current) => ({ ...current, draft: { ...current.draft, ...patch } }))
  }

  function setStep(next: MatchQuizStep) {
    setPersistPaused(next === "results")
    setSession((current) => ({ ...current, step: next }))
  }

  function goNext() {
    const errs = validateStep(step, draft, acceptedTerms)
    if (errs.length) {
      setErrors(errs)
      return
    }
    setErrors([])
    if (step === "preferences") {
      if (isPatientLoggedIn) {
        void pushMatchQuizToIntakeDraft(draft).catch(() => undefined)
        const ranked = rankMatchedClinicians(draft)
        setMatches(ranked)
        setStep("results")
        return
      }
      setStep("account")
      return
    }

    if (step === "account") {
      void submitAccountAndReveal()
      return
    }

    const idx = visibleSteps.indexOf(step)
    const next = visibleSteps[idx + 1]
    if (next) setStep(next)
  }

  function goBack() {
    setErrors([])
    const idx = visibleSteps.indexOf(step)
    const prev = visibleSteps[idx - 1]
    if (prev) setStep(prev)
  }

  async function submitAccountAndReveal() {
    const errs = validateStep("account", draft, acceptedTerms)
    if (errs.length) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    setErrors([])
    try {
      const displayName = `${draft.firstName.trim()} ${draft.lastName.trim()}`
      await registerWithBackend({
        email: draft.email.trim().toLowerCase(),
        password: draft.password,
        displayName,
      })
      await pushMatchQuizToIntakeDraft(draft).catch(() => undefined)
      const ranked = rankMatchedClinicians(draft)
      setMatches(ranked)
      setStep("results")
      setIsPatientLoggedIn(true)
      router.refresh()
    } catch {
      setErrors(["We could not create your account. The email may already be in use — try logging in instead."])
    } finally {
      setSubmitting(false)
    }
  }

  const content = getMatchedQuizContent

  if ((!authChecked || !hydrated) && step !== "results") {
    return (
      <PageContainer className="py-12">
        <DashboardStateBlock variant="loading" message="Loading matching flow…" />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="py-10 md:py-14">
      <div className="mx-auto max-w-2xl space-y-6">
        {step !== "results" ? (
          <header className="space-y-3">
            {progressCurrent > 0 ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium">
                  {content.meta.stepOf(progressCurrent, progressTotal)}
                </p>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${(progressCurrent / progressTotal) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}
          </header>
        ) : null}

        {errors.length > 0 ? (
          <div className="border-destructive/40 bg-destructive/5 rounded-lg border p-3 text-sm text-destructive">
            <ul className="list-inside list-disc space-y-1">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {step === "location" ? (
          <Card>
            <CardHeader>
              <CardTitle>{content.steps.location.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{content.steps.location.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PortalFormField id="match-state" label={content.steps.location.stateLabel}>
                <PortalSelect
                  value={draft.state}
                  onChange={(e) => patchDraft({ state: e.target.value })}
                >
                  <option value="">{content.steps.location.statePlaceholder}</option>
                  {australianStates.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </PortalSelect>
              </PortalFormField>
              <PortalFormField id="match-insurance" label={content.steps.location.insuranceLabel}>
                <PortalSelect
                  value={draft.insurance}
                  onChange={(e) => patchDraft({ insurance: e.target.value as MatchQuizDraft["insurance"] })}
                >
                  <option value="">{content.steps.location.insurancePlaceholder}</option>
                  {insuranceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </PortalSelect>
              </PortalFormField>
            </CardContent>
          </Card>
        ) : null}

        {step === "concerns" ? (
          <Card>
            <CardHeader>
              <CardTitle>{content.steps.concerns.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{content.steps.concerns.description}</p>
            </CardHeader>
            <CardContent>
              <QuizChoiceGrid
                multiple
                options={concernOptions}
                value={draft.concerns}
                onChange={(v) => patchDraft({ concerns: v as MatchQuizDraft["concerns"] })}
              />
            </CardContent>
          </Card>
        ) : null}

        {step === "audience" ? (
          <Card>
            <CardHeader>
              <CardTitle>{content.steps.audience.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{content.steps.audience.description}</p>
            </CardHeader>
            <CardContent>
              <QuizChoiceGrid
                options={audienceOptions}
                value={draft.audience}
                onChange={(v) => patchDraft({ audience: v as MatchQuizDraft["audience"] })}
              />
            </CardContent>
          </Card>
        ) : null}

        {step === "preferences" ? (
          <Card>
            <CardHeader>
              <CardTitle>{content.steps.preferences.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{content.steps.preferences.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">{content.steps.preferences.genderLabel}</p>
                <QuizChoiceGrid
                  options={genderPreferenceOptions}
                  value={draft.genderPreference}
                  onChange={(v) => patchDraft({ genderPreference: v as MatchQuizDraft["genderPreference"] })}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{content.steps.preferences.languageLabel}</p>
                <QuizChoiceGrid
                  options={languageOptions}
                  value={draft.language}
                  onChange={(v) => patchDraft({ language: v as string })}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{content.steps.preferences.modalityLabel}</p>
                <QuizChoiceGrid
                  options={modalityOptions}
                  value={draft.modality}
                  onChange={(v) => patchDraft({ modality: v as MatchQuizDraft["modality"] })}
                />
              </div>
            </CardContent>
          </Card>
        ) : null}

        {step === "account" ? (
          <Card>
            <CardHeader>
              <CardTitle>{content.steps.account.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{content.steps.account.description}</p>
              <WhatHappensNext className="mt-3 border-0 bg-transparent p-0">
                We will show 2–3 psychologists who fit what you shared. You can book immediately or take time to decide —
                no payment until you continue to booking.
              </WhatHappensNext>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthField
                  id="match-first-name"
                  label="First name"
                  value={draft.firstName}
                  onChange={(e) => patchDraft({ firstName: e.target.value })}
                  autoComplete="given-name"
                />
                <AuthField
                  id="match-last-name"
                  label="Last name"
                  value={draft.lastName}
                  onChange={(e) => patchDraft({ lastName: e.target.value })}
                  autoComplete="family-name"
                />
              </div>
              <AuthField
                id="match-email"
                label="Email"
                type="email"
                value={draft.email}
                onChange={(e) => patchDraft({ email: e.target.value })}
                autoComplete="email"
              />
              <AuthField
                id="match-password"
                label="Password"
                type="password"
                value={draft.password}
                onChange={(e) => patchDraft({ password: e.target.value })}
                hint={PASSWORD_HINT}
                autoComplete="new-password"
              />
              <label className="text-muted-foreground flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-5">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms-of-service" className="text-primary font-medium hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/privacy-policy" className="text-primary font-medium hover:underline">
                    Privacy Policy
                  </Link>
                  , and electronic communications.
                </span>
              </label>
              <p className="text-muted-foreground flex gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
                <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{content.steps.account.privacyReassurance}</span>
              </p>
              <p className="text-muted-foreground text-xs">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>{" "}
                and we will skip this step next time.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {step === "results" ? (
          <section className="space-y-6">
            <header className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold tracking-tight">{content.steps.results.title}</h1>
              <p className="text-muted-foreground">{content.steps.results.description}</p>
            </header>
            <div className="space-y-4">
              {matches.map((match, index) => (
                <Card key={match.id} className="overflow-hidden">
                  <CardContent className="space-y-4 p-5">
                    {index === 0 ? (
                      <Badge className="rounded-full">Best match</Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full">
                        Also a strong fit
                      </Badge>
                    )}
                    <ClinicianPublicProfileHeader
                      density="care"
                      name={match.name}
                      specialtyLine={match.specialty}
                      bio={match.bio}
                      profileImageUrl={match.profileImageUrl}
                      footer={
                        <p className="text-primary mt-2 text-sm font-medium">Next available: {match.nextAvailable}</p>
                      }
                    />
                    {match.matchReasons.length > 0 ? (
                      <ul className="text-muted-foreground list-inside list-disc text-sm">
                        {match.matchReasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <Button asChild>
                        <Link
                          href={`/patient/book-appointment?clinician=${encodeURIComponent(match.id)}&source=match`}
                        >
                          Book with {match.name.split(" ")[0]}
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href={`/contact?topic=matching&clinician=${encodeURIComponent(match.id)}`}>
                          Ask a question
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-muted-foreground text-center text-sm">
              <Link href="/patient/book-appointment" className="text-primary font-medium hover:underline">
                Continue to full booking intake
              </Link>{" "}
              — Medicare details, referral upload, and consent.
            </p>
            {matches[0] ? (
              <div className="border-primary/30 bg-background/95 fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-lg items-center justify-between gap-3 rounded-full border px-4 py-2.5 shadow-e2 backdrop-blur-sm md:hidden">
                <p className="min-w-0 truncate text-xs">
                  Best match: <span className="font-medium">{matches[0].name.split(" ")[0]}</span>
                </p>
                <Button asChild size="sm" className="shrink-0 rounded-full">
                  <Link href={`/patient/book-appointment?clinician=${encodeURIComponent(matches[0].id)}&source=match`}>
                    Book now
                  </Link>
                </Button>
              </div>
            ) : null}
          </section>
        ) : null}

        {step !== "results" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex(step) === 0}>
              <CaretLeft className="mr-1 size-4" />
              Back
            </Button>
            <Button type="button" onClick={() => void goNext()} disabled={submitting}>
              {step === "account" ? (submitting ? "Creating account…" : "See my matches") : "Continue"}
              {step !== "account" ? <CaretRight className="ml-1 size-4" /> : null}
            </Button>
          </div>
        ) : null}

        {step !== "results" ? (
          <p className="text-muted-foreground text-center text-xs">
            <Lock className="mr-1 inline size-3.5 align-text-bottom" aria-hidden />
            {content.meta.privacyNote}
          </p>
        ) : null}
      </div>
    </PageContainer>
  )
}
