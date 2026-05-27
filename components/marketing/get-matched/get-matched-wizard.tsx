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
import { loadMatchQuizSession, saveMatchQuizDraft } from "@/src/get-matched/storage"
import type { MatchQuizDraft, MatchQuizStep, MatchedClinician } from "@/src/get-matched/types"

const STEP_ORDER: MatchQuizStep[] = ["location", "concerns", "audience", "preferences", "account", "results"]

function stepIndex(step: MatchQuizStep): number {
  return STEP_ORDER.indexOf(step)
}

function validateStep(step: MatchQuizStep, draft: MatchQuizDraft): string[] {
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
    if (draft.password.length < 8) errors.push("Password must be at least 8 characters.")
  }
  return errors
}

export function GetMatchedWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = React.useState<MatchQuizStep>("location")
  const [draft, setDraft] = React.useState<MatchQuizDraft>(initialMatchQuizDraft)
  const [errors, setErrors] = React.useState<string[]>([])
  const [matches, setMatches] = React.useState<MatchedClinician[]>([])
  const [isPatientLoggedIn, setIsPatientLoggedIn] = React.useState(false)
  const [authChecked, setAuthChecked] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    const restored = loadMatchQuizSession()
    if (restored) {
      setDraft(restored.draft)
      if (restored.step === "results") {
        setMatches(rankMatchedClinicians(restored.draft))
      }
      setStep(restored.step)
    }
    const seeded = searchParams.get("condition")
    if (seeded && !restored) {
      setDraft((d) => ({
        ...d,
        concerns: d.concerns.length ? d.concerns : ["exploring"],
      }))
    }
    void (async () => {
      try {
        const user = await getCurrentUser()
        setIsPatientLoggedIn(user.role === "patient")
        if (user.role === "patient" && user.email) {
          const parts = user.displayName.trim().split(/\s+/)
          setDraft((d) => ({
            ...d,
            email: d.email || user.email,
            firstName: d.firstName || parts[0] || "",
            lastName: d.lastName || parts.slice(1).join(" ") || "",
          }))
        }
      } catch {
        setIsPatientLoggedIn(false)
      } finally {
        setAuthChecked(true)
      }
    })()
  }, [searchParams])

  React.useEffect(() => {
    if (step !== "results") {
      saveMatchQuizDraft(draft, step)
    }
  }, [draft, step])

  const visibleSteps = React.useMemo(
    () => (isPatientLoggedIn ? STEP_ORDER.filter((s) => s !== "account") : STEP_ORDER),
    [isPatientLoggedIn],
  )

  const progressSteps = visibleSteps.filter((s): s is Exclude<MatchQuizStep, "results"> => s !== "results")
  const progressCurrent = step === "results" ? progressSteps.length : progressSteps.indexOf(step as Exclude<MatchQuizStep, "results">) + 1
  const progressTotal = progressSteps.length

  function patchDraft(patch: Partial<MatchQuizDraft>) {
    setDraft((d) => ({ ...d, ...patch }))
  }

  function goNext() {
    const errs = validateStep(step, draft)
    if (errs.length) {
      setErrors(errs)
      return
    }
    setErrors([])
    if (step === "preferences") {
      if (isPatientLoggedIn) {
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
    const errs = validateStep("account", draft)
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

  if (!authChecked && step !== "results") {
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
              <label className="block space-y-1 text-sm">
                <span className="font-medium">{content.steps.location.stateLabel}</span>
                <select
                  className="border-border bg-background h-10 w-full rounded-lg border px-3"
                  value={draft.state}
                  onChange={(e) => patchDraft({ state: e.target.value })}
                >
                  <option value="">{content.steps.location.statePlaceholder}</option>
                  {australianStates.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium">{content.steps.location.insuranceLabel}</span>
                <select
                  className="border-border bg-background h-10 w-full rounded-lg border px-3"
                  value={draft.insurance}
                  onChange={(e) => patchDraft({ insurance: e.target.value as MatchQuizDraft["insurance"] })}
                >
                  <option value="">{content.steps.location.insurancePlaceholder}</option>
                  {insuranceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
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
                hint="At least 8 characters."
                autoComplete="new-password"
              />
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
