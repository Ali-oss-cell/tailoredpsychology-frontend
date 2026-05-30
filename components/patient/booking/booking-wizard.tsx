"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CaretLeft, CaretRight, CheckCircle, WarningCircle } from "@phosphor-icons/react"

import { ClinicianBookingOptionCard } from "@/components/patient/booking/clinician-booking-option-card"
import { CompactDatePicker } from "@/components/patient/booking/compact-date-picker"
import { BookingActions } from "@/components/patient/booking/booking-actions"
import { BookingProgressSave } from "@/components/patient/booking/booking-progress-save"
import { BookingScheduleSkeleton } from "@/components/patient/booking/booking-schedule-skeleton"
import { BookingStepper } from "@/components/patient/booking/booking-stepper"
import { ReferralUpload } from "@/components/patient/booking/referral-upload"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { InlinePurposeHint } from "@/components/shared/inline-purpose-hint"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  bookingContent,
  bookingStepWhatsNext,
  bookingSteps,
  bookingTypeOptions,
  CLINICIAN_PORTRAIT_URLS,
  clinicianGenderOptions,
  clinicians,
  indigenousStatusOptions,
  initialBookingDraft,
  mapStaticCliniciansToLiveOptions,
  referralSourceOptions,
  scheduleByDate,
} from "@/content/patient-booking"
import {
  commitIntakeDraft,
  createBookingRequest,
  createBookingCheckout,
  getBookingRequestStatus,
  getClinicianAvailability,
  getLatestIntakeDraft,
  saveIntakeDraftDelta,
  type BookingRequestStatusResponse,
  type ClinicianAvailabilityResponse,
} from "@/src/patient/booking/api"
import { publicPricing } from "@/content/public-pricing"
import { trackFrontendAnalyticsEvent } from "@/src/analytics/events"
import type { BookingRequestDraft, BookingStepId } from "@/src/patient/booking/types"
import { getCurrentUser } from "@/src/auth/current-user"
import { loadMatchQuizDraft } from "@/src/get-matched/storage"
import { mergeBookingDraftFromSources } from "@/src/patient/booking/merge-booking-draft"
import { usePatientBookingEligibility } from "@/src/patient/booking/use-patient-booking-eligibility"

const STORAGE_KEY = "clink_booking_draft_v1"
const DEMO_PATIENT_ID = "user_patient_001"

/** Resolved patient id for intake draft sync; prefers authenticated patient from `auth/me`. */
type ClinicianOption = {
  id: string
  name: string
  specialty: string
  nextAvailable: string
  profileImageUrl?: string
  bio?: string
}

const STATIC_CLINICIAN_BY_ID = Object.fromEntries(clinicians.map((c) => [c.id, c])) as Record<
  string,
  (typeof clinicians)[number]
>

function inputClassName() {
  return "bg-background text-foreground border-border focus-visible:ring-ring w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2"
}

function parsePersistedDraft(raw: string | null): BookingRequestDraft | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as BookingRequestDraft
    return {
      ...parsed,
      patientIdentity: {
        ...initialBookingDraft.patientIdentity,
        ...parsed.patientIdentity,
        indigenousStatus: parsed.patientIdentity?.indigenousStatus ?? "",
      },
      referralFile: {
        ...parsed.referralFile,
        file: null,
      },
    }
  } catch {
    return null
  }
}

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function shiftMonth(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, "0")
  const d = `${date.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${d}`
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-AU", { month: "long", year: "numeric" })
}

function monthGridDays(currentMonth: Date): Date[] {
  const first = monthStart(currentMonth)
  const startWeekday = first.getDay()
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - startWeekday)

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)
    return day
  })
}

function monthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function formatTimeLabel(time24h: string): string {
  const [hourPart, minutePart] = time24h.split(":")
  const hour = Number(hourPart)
  const minute = Number(minutePart)
  const suffix = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${`${minute}`.padStart(2, "0")} ${suffix}`
}

function formatDateTimeLabel(dateIso: string, time24h: string): string {
  const date = new Date(`${dateIso}T${time24h}:00`)
  if (Number.isNaN(date.getTime())) {
    return "No current slots"
  }
  return date.toLocaleString("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function findNextAvailableLabel(
  payload: ClinicianAvailabilityResponse[],
  clinicianId?: string,
): string {
  let next: { date: string; time: string } | null = null
  for (const clinician of payload) {
    if (clinicianId && clinician.clinicianId !== clinicianId) {
      continue
    }
    for (const slot of clinician.slots) {
      if (!slot.available) continue
      if (!next) {
        next = { date: slot.date, time: slot.startTime }
        continue
      }
      const candidate = new Date(`${slot.date}T${slot.startTime}:00`).getTime()
      const current = new Date(`${next.date}T${next.time}:00`).getTime()
      if (!Number.isNaN(candidate) && candidate < current) {
        next = { date: slot.date, time: slot.startTime }
      }
    }
  }
  return next ? formatDateTimeLabel(next.date, next.time) : "No current slots"
}

function toScheduleByDate(payload: ClinicianAvailabilityResponse[]) {
  const mapped: Record<string, { id: string; label: string; clinicianId: string }[]> = {}
  for (const clinician of payload) {
    for (const slot of clinician.slots) {
      if (!slot.available) {
        continue
      }
      mapped[slot.date] ??= []
      mapped[slot.date].push({
        id: slot.slotId,
        label: formatTimeLabel(slot.startTime),
        clinicianId: clinician.clinicianId,
      })
    }
  }
  return mapped
}

export function BookingWizard() {
  const searchParams = useSearchParams()
  const paymentCancelled = searchParams.get("payment") === "cancelled"
  const seededConcern = searchParams.get("condition")
  const [draft, setDraft] = React.useState<BookingRequestDraft>(() => {
    if (typeof window === "undefined") {
      return initialBookingDraft
    }

    const restored = parsePersistedDraft(window.localStorage.getItem(STORAGE_KEY))
    const baseDraft = restored ?? initialBookingDraft
    if (!seededConcern || baseDraft.careContext.presentingConcerns.trim()) {
      return baseDraft
    }
    return {
      ...baseDraft,
      careContext: {
        ...baseDraft.careContext,
        presentingConcerns: `Seeking support for ${seededConcern.replaceAll("-", " ")}.`,
      },
    }
  })
  const [activeStep, setActiveStep] = React.useState<BookingStepId>("mode")
  const [errors, setErrors] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submittedStatus, setSubmittedStatus] = React.useState<BookingRequestStatusResponse | null>(null)
  const [liveScheduleByDate, setLiveScheduleByDate] = React.useState(scheduleByDate)
  const [liveClinicians, setLiveClinicians] = React.useState<ClinicianOption[]>(() => mapStaticCliniciansToLiveOptions())
  const [isLoadingSchedule, setIsLoadingSchedule] = React.useState(false)
  const [scheduleLoadError, setScheduleLoadError] = React.useState<string | null>(null)
  /** Increment to retry availability fetch without changing wizard step or draft. */
  const [availabilityRetryNonce, setAvailabilityRetryNonce] = React.useState(0)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => {
    const firstDate = Object.keys(scheduleByDate)[0]
    if (!firstDate) {
      return monthStart(new Date())
    }
    return monthStart(new Date(firstDate))
  })
  const [draftVersion, setDraftVersion] = React.useState(0)
  const [remoteSyncState, setRemoteSyncState] = React.useState<"idle" | "syncing" | "saved" | "conflict" | "error">(
    "idle",
  )
  const [hasRemoteHydrated, setHasRemoteHydrated] = React.useState(false)
  /** Null until `auth/me` resolves (then real patient id or demo fallback). */
  const [intakePatientId, setIntakePatientId] = React.useState<string | null>(null)
  const saveTimeoutRef = React.useRef<number | null>(null)
  const draftVersionRef = React.useRef(0)
  const lastSyncedSnapshotRef = React.useRef("")

  const bookingEligibility = usePatientBookingEligibility(intakePatientId)

  const shouldShowReferralStep =
    draft.bookingMeta.bookingType === "initial" ||
    draft.bookingMeta.changesSinceLastVisit === "yes" ||
    draft.medicarePath.hasReferral === "yes" ||
    Boolean(draft.referralFile.fileName)

  const skipModeStep = !bookingEligibility.loading && bookingEligibility.isNewPatient

  const visibleSteps = bookingSteps.filter((step) => {
    if (step.id === "referral" && !shouldShowReferralStep) return false
    if (step.id === "mode" && skipModeStep) return false
    return true
  })

  const matchSource = searchParams.get("source") === "match"
  const preselectedClinicianId = searchParams.get("clinician")
  const preselectedClinicianName =
    liveClinicians.find((c) => c.id === preselectedClinicianId)?.name ??
    clinicians.find((c) => c.id === preselectedClinicianId)?.name

  React.useEffect(() => {
    if (bookingEligibility.loading) {
      return
    }
    setDraft((current) => {
      const parts = bookingEligibility.displayName.trim().split(/\s+/).filter(Boolean)
      const next = { ...current }
      if (bookingEligibility.isNewPatient) {
        next.bookingMeta = {
          bookingType: "initial",
          changesSinceLastVisit: "no",
        }
      } else if (current.bookingMeta.bookingType !== "follow_up" && current.bookingMeta.bookingType !== "initial") {
        next.bookingMeta = { ...current.bookingMeta, bookingType: "initial" }
      }
      if (!current.patientIdentity.fullName.trim() && parts.length > 0) {
        next.patientIdentity = {
          ...current.patientIdentity,
          fullName: bookingEligibility.displayName.trim(),
        }
      }
      if (!current.patientIdentity.email.trim() && bookingEligibility.email) {
        next.patientIdentity = {
          ...next.patientIdentity,
          email: bookingEligibility.email,
        }
      }
      return next
    })
    if (skipModeStep && activeStep === "mode") {
      setActiveStep("schedule")
    }
  }, [
    bookingEligibility.loading,
    bookingEligibility.isNewPatient,
    bookingEligibility.displayName,
    bookingEligibility.email,
    skipModeStep,
    activeStep,
  ])

  React.useEffect(() => {
    if (typeof window === "undefined" || activeStep === "submitted") {
      return
    }

    const serializableDraft = {
      ...draft,
      referralFile: {
        ...draft.referralFile,
        file: null,
      },
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableDraft))
  }, [draft, activeStep])

  React.useEffect(() => {
    draftVersionRef.current = draftVersion
  }, [draftVersion])

  React.useEffect(() => {
    const source = searchParams.get("source") ?? "direct"
    const condition = searchParams.get("condition")
    const utmSource = searchParams.get("utm_source")
    const utmMedium = searchParams.get("utm_medium")
    const utmCampaign = searchParams.get("utm_campaign")
    void trackFrontendAnalyticsEvent({
      name: "intake_started",
      targetId: "booking-wizard",
      idempotencyKey: `intake_started:${source}:${condition ?? "none"}`,
      metadata: {
        source,
        condition: condition ?? null,
        utm_source: utmSource ?? null,
        utm_medium: utmMedium ?? null,
        utm_campaign: utmCampaign ?? null,
      },
    }).catch(() => undefined)
  }, [searchParams])

  React.useEffect(() => {
    void getCurrentUser()
      .then((u) => {
        setIntakePatientId(u.role === "patient" ? u.id : DEMO_PATIENT_ID)
      })
      .catch(() => {
        setIntakePatientId(DEMO_PATIENT_ID)
      })
  }, [])

  React.useEffect(() => {
    if (intakePatientId === null) {
      return
    }
    let isCancelled = false
    const hydrateRemoteDraft = async () => {
      try {
        const [latest, user] = await Promise.all([
          getLatestIntakeDraft(intakePatientId),
          getCurrentUser().catch(() => null),
        ])
        if (isCancelled) {
          return
        }
        const matchQuiz = loadMatchQuizDraft()
        const intakePartial =
          latest.data && Object.keys(latest.data).length > 0
            ? (latest.data as Partial<BookingRequestDraft>)
            : undefined
        setDraft((current) =>
          mergeBookingDraftFromSources(current, {
            intake: intakePartial,
            user,
            matchQuiz,
          }),
        )
        setDraftVersion(latest.draftVersion)
        const hydrated = mergeBookingDraftFromSources(initialBookingDraft, {
          intake: intakePartial,
          user,
          matchQuiz,
        })
        lastSyncedSnapshotRef.current = JSON.stringify({
          ...hydrated,
          referralFile: { ...hydrated.referralFile, file: null },
        })
        setRemoteSyncState("saved")
      } catch {
        if (!isCancelled) {
          setRemoteSyncState("error")
        }
      } finally {
        if (!isCancelled) {
          setHasRemoteHydrated(true)
        }
      }
    }
    void hydrateRemoteDraft()
    return () => {
      isCancelled = true
    }
  }, [intakePatientId])

  /** Deep-link from patient care team (`?clinician=<clinicianId>`) after intake draft hydration. */
  React.useEffect(() => {
    const id = searchParams.get("clinician")
    if (!id || !hasRemoteHydrated) {
      return
    }
    setDraft((current) => {
      if (current.scheduleSelection.selectedClinicianId === id) {
        return current
      }
      return {
        ...current,
        scheduleSelection: {
          ...current.scheduleSelection,
          selectedClinicianId: id,
        },
      }
    })
  }, [searchParams, hasRemoteHydrated])

  React.useEffect(() => {
    if (intakePatientId === null || !hasRemoteHydrated || activeStep === "submitted") {
      return
    }
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      const sync = async () => {
        try {
          const serializableDraft = {
            ...draft,
            referralFile: {
              ...draft.referralFile,
              file: null,
            },
          }
          const snapshot = JSON.stringify(serializableDraft)
          if (snapshot === lastSyncedSnapshotRef.current) {
            return
          }
          setRemoteSyncState("syncing")
          const saved = await saveIntakeDraftDelta({
            patientId: intakePatientId,
            baseVersion: draftVersionRef.current,
            delta: serializableDraft as unknown as Record<string, unknown>,
          })
          setDraftVersion(saved.draftVersion)
          lastSyncedSnapshotRef.current = snapshot
          setRemoteSyncState("saved")
        } catch (error) {
          const message = error instanceof Error ? error.message : ""
          setRemoteSyncState(message.includes("409") ? "conflict" : "error")
        }
      }
      void sync()
    }, 800)

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [draft, hasRemoteHydrated, activeStep, intakePatientId])

  React.useEffect(() => {
    let isCancelled = false

    const loadAvailability = async () => {
      setIsLoadingSchedule(true)
      setScheduleLoadError(null)

      const selectedClinician =
        draft.scheduleSelection.selectedClinicianId &&
        draft.scheduleSelection.selectedClinicianId !== "no-preference"
          ? draft.scheduleSelection.selectedClinicianId
          : undefined

      try {
        const payload = await getClinicianAvailability({
          startDate: dateKey(monthStart(calendarMonth)),
          endDate: dateKey(monthEnd(calendarMonth)),
          clinicianId: selectedClinician,
          timezone: "Australia/Sydney",
        })

        if (isCancelled) {
          return
        }

        const apiClinicians = payload.map((item) => {
          const fallback = STATIC_CLINICIAN_BY_ID[item.clinicianId]
          const fromDb =
            item.specialties && item.specialties.filter(Boolean).length > 0
              ? item.specialties.join(", ")
              : null
          return {
            id: item.clinicianId,
            name: item.clinicianName,
            specialty: fromDb ?? fallback?.specialty ?? "Telehealth clinician",
            nextAvailable: findNextAvailableLabel(payload, item.clinicianId),
            profileImageUrl: item.profileImageUrl ?? CLINICIAN_PORTRAIT_URLS[item.clinicianId],
            bio: item.bio,
          }
        })

        setLiveClinicians([
          ...apiClinicians,
          {
            id: "no-preference",
            name: "No preference",
            specialty: "Auto-match earliest suitable clinician",
            nextAvailable: findNextAvailableLabel(payload),
          },
        ])
        setLiveScheduleByDate(toScheduleByDate(payload))
      } catch {
        if (isCancelled) {
          return
        }
        setScheduleLoadError("Live availability unavailable. Showing local fallback schedule.")
        setLiveClinicians(mapStaticCliniciansToLiveOptions())
        setLiveScheduleByDate(scheduleByDate)
      } finally {
        if (!isCancelled) {
          setIsLoadingSchedule(false)
        }
      }
    }

    void loadAvailability()
    return () => {
      isCancelled = true
    }
  }, [calendarMonth, draft.scheduleSelection.selectedClinicianId, availabilityRetryNonce])

  const stepIndex = visibleSteps.findIndex((item) => item.id === activeStep)
  const isFinalStep = activeStep === "review"
  const isFirstStep = stepIndex === 0

  const updateDraft = <Section extends keyof BookingRequestDraft>(
    section: Section,
    value: BookingRequestDraft[Section],
  ) => {
    setDraft((current) => ({ ...current, [section]: value }))
  }

  const validateCurrentStep = (): string[] => {
    const nextErrors: string[] = []
    const isInitial = draft.bookingMeta.bookingType === "initial"
    const hasChanges = draft.bookingMeta.changesSinceLastVisit === "yes"

    if (activeStep === "mode") {
      if (!draft.bookingMeta.bookingType) {
        nextErrors.push("Please select booking type.")
      }
    }

    if (activeStep === "schedule") {
      if (!draft.scheduleSelection.selectedClinicianId) {
        nextErrors.push("Please select a clinician or choose no preference.")
      }
      if (!draft.scheduleSelection.selectedDate) {
        nextErrors.push("Please select a date from schedule.")
      }
      if (!draft.scheduleSelection.selectedSlotId) {
        nextErrors.push("Please select an available time slot.")
      }
    }

    if (activeStep === "reason") {
      if (isInitial && !draft.patientIdentity.fullName.trim()) {
        nextErrors.push("Full name is required.")
      }
      if (isInitial && !draft.patientIdentity.dateOfBirth) {
        nextErrors.push("Date of birth is required.")
      }
      if (!draft.patientIdentity.mobile.trim()) {
        nextErrors.push("Mobile number is required.")
      }
      if ((isInitial || hasChanges) && !draft.careContext.presentingConcerns.trim()) {
        nextErrors.push("Please describe your main concern.")
      }
    }

    if (activeStep === "medicare") {
      if (draft.bookingMeta.bookingType === "follow_up" && draft.bookingMeta.changesSinceLastVisit === "no") {
        setErrors([])
        return []
      }
      if (!draft.medicarePath.hasMhtp) {
        nextErrors.push("Please select whether you have a mental health treatment plan.")
      }
      if (!draft.medicarePath.hasReferral) {
        nextErrors.push("Please select whether you have a referral.")
      }
      if (draft.medicarePath.hasReferral === "yes" && !draft.medicarePath.referralType) {
        nextErrors.push("Please select a referral type.")
      }
    }

    if (activeStep === "clinical") {
      if ((isInitial || hasChanges) && !draft.careContext.symptomDuration.trim()) {
        nextErrors.push("Please provide symptom duration.")
      }
      if (!draft.telehealthSafety.currentSessionLocation.trim()) {
        nextErrors.push("Please provide your typical telehealth session location.")
      }
      if (!draft.telehealthSafety.emergencyContactName.trim()) {
        nextErrors.push("Emergency contact name is required.")
      }
      if (!draft.telehealthSafety.emergencyContactPhone.trim()) {
        nextErrors.push("Emergency contact phone is required.")
      }
    }

    if (activeStep === "consent") {
      if (!draft.consents.privacyAccepted) {
        nextErrors.push("Privacy acknowledgement is required.")
      }
      if (!draft.consents.telehealthAccepted) {
        nextErrors.push("Telehealth consent is required.")
      }
      if (!draft.consents.treatmentAccepted) {
        nextErrors.push("Treatment terms acknowledgement is required.")
      }
    }

    setErrors(nextErrors)
    return nextErrors
  }

  const goNext = () => {
    if (validateCurrentStep().length > 0) {
      return
    }

    if (isFinalStep) {
      setIsSubmitting(true)
      const submit = async () => {
        try {
          if (!selectedSlot || !draft.scheduleSelection.selectedDate) {
            throw new Error("Please choose a valid schedule slot before submitting.")
          }

          const created = await createBookingRequest({
            clinicianId: selectedSlot.clinicianId,
            slotId: selectedSlot.id,
            appointmentDate: draft.scheduleSelection.selectedDate,
            notes: draft.careContext.presentingConcerns || undefined,
            idempotencyKey: `${selectedSlot.id}:${draft.scheduleSelection.selectedDate}`,
            timezone: "Australia/Sydney",
            referralDocumentId: draft.referralFile.documentId || undefined,
          })

          await trackFrontendAnalyticsEvent({
            name: "intake_submitted",
            targetId: created.bookingRequestId,
            idempotencyKey: `frontend_intake_submitted:${created.bookingRequestId}`,
          })
          await commitIntakeDraft(intakePatientId ?? DEMO_PATIENT_ID)

          const checkout = await createBookingCheckout(created.bookingRequestId)
          window.localStorage.removeItem(STORAGE_KEY)
          window.location.assign(checkout.checkoutUrl)
        } catch (error) {
          setErrors([error instanceof Error ? error.message : "Unable to start payment. Your slot may still be held — try again from review."])
        } finally {
          setIsSubmitting(false)
        }
      }

      void submit()
      return
    }

    setErrors([])
    setActiveStep(visibleSteps[stepIndex + 1].id)
  }

  const goBack = () => {
    if (isFirstStep || activeStep === "submitted") {
      return
    }
    setErrors([])
    setActiveStep(visibleSteps[stepIndex - 1].id)
  }

  const availableDates = Object.keys(liveScheduleByDate)

  const availableSlotsForDate = (date: string) => {
    const slots = liveScheduleByDate[date] ?? []
    if (!draft.scheduleSelection.selectedClinicianId || draft.scheduleSelection.selectedClinicianId === "no-preference") {
      return slots
    }
    return slots.filter((slot) => slot.clinicianId === draft.scheduleSelection.selectedClinicianId)
  }

  const selectedSlotLabel = (() => {
    if (!draft.scheduleSelection.selectedDate || !draft.scheduleSelection.selectedSlotId) {
      return ""
    }
    const slot = (liveScheduleByDate[draft.scheduleSelection.selectedDate] ?? []).find(
      (item) => item.id === draft.scheduleSelection.selectedSlotId,
    )
    return slot?.label ?? ""
  })()

  const selectedSlot = (() => {
    if (!draft.scheduleSelection.selectedDate || !draft.scheduleSelection.selectedSlotId) {
      return null
    }
    return (liveScheduleByDate[draft.scheduleSelection.selectedDate] ?? []).find(
      (item) => item.id === draft.scheduleSelection.selectedSlotId,
    )
  })()

  const content = (() => {
    if (activeStep === "mode") {
      if (bookingEligibility.isNewPatient) {
        return (
          <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <Badge className="rounded-full">New patient</Badge>
            <p className="text-sm font-semibold">{bookingContent.newPatient.modeTitle}</p>
            <p className="text-muted-foreground text-sm">{bookingContent.newPatient.modeDescription}</p>
          </div>
        )
      }

      const typeOptions = bookingEligibility.canBookFollowUp
        ? bookingTypeOptions
        : bookingTypeOptions.filter((o) => o.value === "initial")

      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">{bookingContent.returningPatient.modeDescription}</p>
          {bookingEligibility.canBookFollowUp ? (
            <p className="text-muted-foreground text-xs">
              Welcome back — you have {bookingEligibility.pastAppointmentCount} prior visit
              {bookingEligibility.pastAppointmentCount === 1 ? "" : "s"} on file.
            </p>
          ) : null}
          <div className={`grid gap-3 ${typeOptions.length > 1 ? "md:grid-cols-2" : ""}`}>
            {typeOptions.map((option) => {
              const selected = draft.bookingMeta.bookingType === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateDraft("bookingMeta", {
                      bookingType: option.value,
                      changesSinceLastVisit: draft.bookingMeta.changesSinceLastVisit,
                    })
                  }
                  className={`rounded-xl border p-4 text-left ${
                    selected ? "border-primary bg-primary/5" : "border-border/70 bg-background"
                  }`}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{option.description}</p>
                </button>
              )
            })}
          </div>
          {draft.bookingMeta.bookingType === "follow_up" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Has anything changed since your last visit?</label>
              <select
                className={inputClassName()}
                value={draft.bookingMeta.changesSinceLastVisit}
                onChange={(event) =>
                  updateDraft("bookingMeta", {
                    ...draft.bookingMeta,
                    changesSinceLastVisit: event.target.value as "yes" | "no",
                  })
                }
              >
                <option value="no">No major change</option>
                <option value="yes">Yes, there are changes to share</option>
              </select>
            </div>
          ) : null}
        </div>
      )
    }

    if (activeStep === "schedule") {
      const monthDays = monthGridDays(calendarMonth)
      if (isLoadingSchedule) {
        return (
          <div className="space-y-5" aria-busy="true" aria-live="polite" aria-label="Loading schedule options">
            <p className="text-muted-foreground text-sm">{bookingContent.helper.schedule}</p>
            <BookingScheduleSkeleton />
          </div>
        )
      }
      return (
        <div className="space-y-5">
          {bookingEligibility.isNewPatient ? (
            <div className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
              <Badge variant="secondary" className="rounded-full">
                First appointment
              </Badge>
              <p className="text-sm font-medium">
                {matchSource && preselectedClinicianName
                  ? bookingContent.newPatient.scheduleBanner(preselectedClinicianName)
                  : bookingContent.newPatient.scheduleBanner("")}
              </p>
            </div>
          ) : null}
          <p className="text-muted-foreground text-sm">{bookingContent.helper.schedule}</p>
          {scheduleLoadError ? (
            <div className="space-y-2">
              <DashboardStateBlock variant="error" message={scheduleLoadError} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAvailabilityRetryNonce((n) => n + 1)}
              >
                Retry loading live availability
              </Button>
            </div>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            {liveClinicians.map((clinician) => {
              const selected = draft.scheduleSelection.selectedClinicianId === clinician.id
              return (
                <ClinicianBookingOptionCard
                  key={clinician.id}
                  name={clinician.name}
                  specialtyLine={clinician.specialty}
                  bio={clinician.bio}
                  profileImageUrl={clinician.profileImageUrl}
                  nextAvailableLabel={clinician.nextAvailable}
                  selected={selected}
                  onSelect={() =>
                    updateDraft("scheduleSelection", {
                      ...draft.scheduleSelection,
                      selectedClinicianId: clinician.id,
                      selectedSlotId: "",
                    })
                  }
                />
              )
            })}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Choose date (monthly schedule)</label>
            <div className="rounded-xl border border-border/60 bg-muted/25 p-4">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCalendarMonth((prev) => shiftMonth(prev, -1))}
                  className="rounded-md border border-border/70 p-2 hover:bg-muted"
                  aria-label="Previous month"
                >
                  <CaretLeft size={16} />
                </button>
                <p className="font-heading text-lg font-semibold">{monthLabel(calendarMonth)}</p>
                <button
                  type="button"
                  onClick={() => setCalendarMonth((prev) => shiftMonth(prev, 1))}
                  className="rounded-md border border-border/70 p-2 hover:bg-muted"
                  aria-label="Next month"
                >
                  <CaretRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs text-muted-foreground">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((weekday) => (
                  <div key={weekday} className="py-1">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day) => {
                  const key = dateKey(day)
                  const isCurrentMonth = day.getMonth() === calendarMonth.getMonth()
                  const isAvailable = availableDates.includes(key)
                  const isSelected = draft.scheduleSelection.selectedDate === key

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() =>
                        updateDraft("scheduleSelection", {
                          ...draft.scheduleSelection,
                          selectedDate: key,
                          selectedSlotId: "",
                        })
                      }
                      className={`h-10 rounded-md text-sm transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : isAvailable
                            ? "bg-background border border-border/70 hover:bg-muted"
                            : "text-muted-foreground/50"
                      } ${!isCurrentMonth ? "opacity-45" : ""}`}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {draft.scheduleSelection.selectedDate ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose available slot</label>
              <div className="flex flex-wrap gap-2">
                {availableSlotsForDate(draft.scheduleSelection.selectedDate).map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() =>
                      updateDraft("scheduleSelection", {
                        ...draft.scheduleSelection,
                        selectedSlotId: slot.id,
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      draft.scheduleSelection.selectedSlotId === slot.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )
    }

    if (activeStep === "reason") {
      const isInitial = draft.bookingMeta.bookingType === "initial"
      const requireCareSummary = isInitial || draft.bookingMeta.changesSinceLastVisit === "yes"
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full legal name</label>
            <input
              className={inputClassName()}
              value={draft.patientIdentity.fullName}
              onChange={(event) =>
                updateDraft("patientIdentity", { ...draft.patientIdentity, fullName: event.target.value })
              }
              placeholder="Full name"
              disabled={!isInitial}
            />
          </div>
          <CompactDatePicker
            id="patient-date-of-birth"
            label="Date of birth"
            value={draft.patientIdentity.dateOfBirth}
            onChange={(next) => updateDraft("patientIdentity", { ...draft.patientIdentity, dateOfBirth: next })}
            disabled={!isInitial}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile</label>
            <input
              className={inputClassName()}
              value={draft.patientIdentity.mobile}
              onChange={(event) =>
                updateDraft("patientIdentity", { ...draft.patientIdentity, mobile: event.target.value })
              }
              placeholder="04XX XXX XXX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className={inputClassName()}
              value={draft.patientIdentity.email}
              onChange={(event) =>
                updateDraft("patientIdentity", { ...draft.patientIdentity, email: event.target.value })
              }
              placeholder="name@example.com"
              readOnly={Boolean(bookingEligibility.email)}
              aria-readonly={Boolean(bookingEligibility.email)}
              disabled={Boolean(bookingEligibility.email)}
            />
            {bookingEligibility.email ? (
              <p className="text-muted-foreground text-xs">Email is managed on your account and cannot be changed here.</p>
            ) : null}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Aboriginal and Torres Strait Islander status (optional)</label>
            <select
              className={inputClassName()}
              value={draft.patientIdentity.indigenousStatus}
              onChange={(event) =>
                updateDraft("patientIdentity", {
                  ...draft.patientIdentity,
                  indigenousStatus: event.target.value as BookingRequestDraft["patientIdentity"]["indigenousStatus"],
                })
              }
            >
              {indigenousStatusOptions.map((opt) => (
                <option key={opt.value || "unset"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">What brings you in today?</label>
            <textarea
              className={inputClassName()}
              rows={4}
              value={draft.careContext.presentingConcerns}
              onChange={(event) =>
                updateDraft("careContext", { ...draft.careContext, presentingConcerns: event.target.value })
              }
              placeholder={
                requireCareSummary
                  ? "Briefly describe your goals or concerns."
                  : "No update required if nothing has changed."
              }
              disabled={!requireCareSummary}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Urgency</label>
            <select
              className={inputClassName()}
              value={draft.careContext.riskFlag}
              onChange={(event) =>
                updateDraft("careContext", {
                  ...draft.careContext,
                  riskFlag: event.target.value as BookingRequestDraft["careContext"]["riskFlag"],
                })
              }
            >
              <option value="none">Standard booking (no immediate safety concerns)</option>
              <option value="urgent_support_needed">I need urgent support from the care team</option>
            </select>
          </div>
        </div>
      )
    }

    if (activeStep === "medicare") {
      if (draft.bookingMeta.bookingType === "follow_up" && draft.bookingMeta.changesSinceLastVisit === "no") {
        return (
          <p className="text-muted-foreground text-sm">
            Medicare and referral details are unchanged for this follow-up booking.
          </p>
        )
      }
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">{bookingContent.helper.medicare}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mental Health Treatment Plan (MHTP)</label>
              <select
                className={inputClassName()}
                value={draft.medicarePath.hasMhtp}
                onChange={(event) =>
                  updateDraft("medicarePath", {
                    ...draft.medicarePath,
                    hasMhtp: event.target.value as BookingRequestDraft["medicarePath"]["hasMhtp"],
                  })
                }
              >
                <option value="unsure">Not sure yet</option>
                <option value="yes">Yes, I have one</option>
                <option value="no">No, I do not have one</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Referral available now?</label>
              <select
                className={inputClassName()}
                value={draft.medicarePath.hasReferral}
                onChange={(event) =>
                  updateDraft("medicarePath", {
                    ...draft.medicarePath,
                    hasReferral: event.target.value as "yes" | "no",
                  })
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {draft.medicarePath.hasReferral === "yes" ? (
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Referral type</label>
                <select
                  className={inputClassName()}
                  value={draft.medicarePath.referralType}
                  onChange={(event) =>
                    updateDraft("medicarePath", {
                      ...draft.medicarePath,
                      referralType: event.target.value as BookingRequestDraft["medicarePath"]["referralType"],
                    })
                  }
                >
                  <option value="">Select referral type</option>
                  {referralSourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated sessions used this year</label>
              <input
                className={inputClassName()}
                value={draft.medicarePath.sessionsUsedEstimate}
                onChange={(event) =>
                  updateDraft("medicarePath", {
                    ...draft.medicarePath,
                    sessionsUsedEstimate: event.target.value,
                  })
                }
                placeholder="e.g. 2 individual sessions"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GP name (optional)</label>
              <input
                className={inputClassName()}
                value={draft.medicarePath.gpName}
                onChange={(event) =>
                  updateDraft("medicarePath", {
                    ...draft.medicarePath,
                    gpName: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="rounded-md border border-border/60 p-3">
            <p className="text-sm font-medium">Indicative out-of-pocket examples</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {publicPricing.gapExamples.map((example) => (
                <div key={example.label} className="rounded-md border border-border/50 p-2 text-xs">
                  <p className="font-medium">{example.label}</p>
                  <p className="text-muted-foreground">Fee: ${example.sessionFeeAud.toFixed(2)}</p>
                  <p className="text-muted-foreground">Rebate: ${example.medicareRebateAud.toFixed(2)}</p>
                  <p>Estimated gap: ${example.estimatedGapAud.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{publicPricing.assumptions}</p>
          </div>
        </div>
      )
    }

    if (activeStep === "clinical") {
      const requireClinicalUpdate =
        draft.bookingMeta.bookingType === "initial" || draft.bookingMeta.changesSinceLastVisit === "yes"
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">How long have symptoms affected you?</label>
            <input
              className={inputClassName()}
              value={draft.careContext.symptomDuration}
              onChange={(event) =>
                updateDraft("careContext", { ...draft.careContext, symptomDuration: event.target.value })
              }
              placeholder="e.g. 6 months"
              disabled={!requireClinicalUpdate}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Previous therapy or care</label>
            <textarea
              rows={3}
              className={inputClassName()}
              value={draft.careContext.priorCare}
              onChange={(event) =>
                updateDraft("careContext", { ...draft.careContext, priorCare: event.target.value })
              }
              disabled={!requireClinicalUpdate}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Current medications</label>
            <textarea
              rows={3}
              className={inputClassName()}
              value={draft.careContext.currentMedications}
              onChange={(event) =>
                updateDraft("careContext", { ...draft.careContext, currentMedications: event.target.value })
              }
              disabled={!requireClinicalUpdate}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Typical telehealth session location</label>
            <input
              className={inputClassName()}
              value={draft.telehealthSafety.currentSessionLocation}
              onChange={(event) =>
                updateDraft("telehealthSafety", {
                  ...draft.telehealthSafety,
                  currentSessionLocation: event.target.value,
                })
              }
              placeholder="Suburb and state where you usually join sessions"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency contact name</label>
            <input
              className={inputClassName()}
              value={draft.telehealthSafety.emergencyContactName}
              onChange={(event) =>
                updateDraft("telehealthSafety", {
                  ...draft.telehealthSafety,
                  emergencyContactName: event.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency contact phone</label>
            <input
              className={inputClassName()}
              value={draft.telehealthSafety.emergencyContactPhone}
              onChange={(event) =>
                updateDraft("telehealthSafety", {
                  ...draft.telehealthSafety,
                  emergencyContactPhone: event.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Relationship</label>
            <input
              className={inputClassName()}
              value={draft.telehealthSafety.emergencyContactRelationship}
              onChange={(event) =>
                updateDraft("telehealthSafety", {
                  ...draft.telehealthSafety,
                  emergencyContactRelationship: event.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred clinician gender</label>
            <select
              className={inputClassName()}
              value={draft.preferences.preferredClinicianGender}
              onChange={(event) =>
                updateDraft("preferences", {
                  ...draft.preferences,
                  preferredClinicianGender:
                    event.target.value as BookingRequestDraft["preferences"]["preferredClinicianGender"],
                })
              }
            >
              {clinicianGenderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred language (optional)</label>
            <input
              className={inputClassName()}
              value={draft.preferences.preferredLanguage}
              onChange={(event) =>
                updateDraft("preferences", {
                  ...draft.preferences,
                  preferredLanguage: event.target.value,
                })
              }
              placeholder="e.g. English, Arabic"
            />
          </div>
        </div>
      )
    }

    if (activeStep === "referral") {
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">{bookingContent.helper.referralUpload}</p>
          <ReferralUpload
            value={draft.referralFile}
            onChange={(next) => updateDraft("referralFile", next)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Referral source</label>
              <select
                className={inputClassName()}
                value={draft.referralFile.sourceType}
                onChange={(event) =>
                  updateDraft("referralFile", {
                    ...draft.referralFile,
                    sourceType: event.target.value as BookingRequestDraft["referralFile"]["sourceType"],
                  })
                }
              >
                <option value="">Select source</option>
                {referralSourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <CompactDatePicker
              id="referral-date"
              label="Referral date"
              value={draft.referralFile.referralDate}
              onChange={(next) =>
                updateDraft("referralFile", {
                  ...draft.referralFile,
                  referralDate: next,
                })
              }
              capAtToday={false}
            />
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Referral notes (optional)</label>
              <textarea
                rows={3}
                className={inputClassName()}
                value={draft.referralFile.notes}
                onChange={(event) =>
                  updateDraft("referralFile", {
                    ...draft.referralFile,
                    notes: event.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      )
    }

    if (activeStep === "consent") {
      return (
        <div className="space-y-3">
          <InlinePurposeHint>
            These confirmations are required before we can securely hold your health information and deliver telehealth care.
          </InlinePurposeHint>
          <label className="bg-muted/35 flex items-start gap-3 rounded-lg border border-border/60 p-3">
            <input
              type="checkbox"
              checked={draft.consents.privacyAccepted}
              onChange={(event) =>
                updateDraft("consents", { ...draft.consents, privacyAccepted: event.target.checked })
              }
            />
            <span className="text-sm">{bookingContent.consentText.privacy}</span>
          </label>
          <label className="bg-muted/35 flex items-start gap-3 rounded-lg border border-border/60 p-3">
            <input
              type="checkbox"
              checked={draft.consents.telehealthAccepted}
              onChange={(event) =>
                updateDraft("consents", { ...draft.consents, telehealthAccepted: event.target.checked })
              }
            />
            <span className="text-sm">{bookingContent.consentText.telehealth}</span>
          </label>
          <label className="bg-muted/35 flex items-start gap-3 rounded-lg border border-border/60 p-3">
            <input
              type="checkbox"
              checked={draft.consents.treatmentAccepted}
              onChange={(event) =>
                updateDraft("consents", { ...draft.consents, treatmentAccepted: event.target.checked })
              }
            />
            <span className="text-sm">{bookingContent.consentText.treatment}</span>
          </label>
        </div>
      )
    }

    if (activeStep === "review") {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-sm font-medium">Appointment selection</p>
            <p className="text-muted-foreground text-xs">
              Booking type: {draft.bookingMeta.bookingType.replace("_", " ")} • Clinician:{" "}
              {liveClinicians.find((item) => item.id === draft.scheduleSelection.selectedClinicianId)?.name ??
                "Not selected"}{" "}
              • Date: {draft.scheduleSelection.selectedDate || "Not selected"} • Time:{" "}
              {selectedSlotLabel || "Not selected"}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-sm font-medium">Patient and contact</p>
            <p className="text-muted-foreground text-xs">
              {draft.patientIdentity.fullName} • {draft.patientIdentity.mobile} •{" "}
              {draft.patientIdentity.email || "No email entered"}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-sm font-medium">Care summary</p>
            <p className="text-muted-foreground text-xs">{draft.careContext.presentingConcerns}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-sm font-medium">Medicare and referral</p>
            <p className="text-muted-foreground text-xs">
              MHTP: {draft.medicarePath.hasMhtp} • Referral: {draft.medicarePath.hasReferral}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-sm font-medium">Referral PDF</p>
            <p className="text-muted-foreground text-xs">
              {draft.referralFile.fileName
                ? `${draft.referralFile.fileName} (${Math.round(draft.referralFile.fileSize / 1024)} KB)`
                : "No file uploaded"}
            </p>
            {draft.referralFile.documentId ? (
              <p className="text-muted-foreground text-xs">
                Linked document ID: <span className="font-medium">{draft.referralFile.documentId}</span>
              </p>
            ) : null}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle
            size={16}
            className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
            aria-hidden
          />
          Booking request submitted
        </p>
        <p className="text-sm">
          Thanks. Your intake has been submitted. We will review referral details and contact you with matched
          telehealth options.
        </p>
        <p>
          <Link
            href="/patient/appointments"
            className="text-primary text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            View your appointments
          </Link>
        </p>
        {submittedStatus ? (
          <div className="bg-background/70 rounded-md border border-primary/30 p-3 text-xs">
            <p>
              Request ID: <span className="font-medium">{submittedStatus.bookingRequestId}</span>
            </p>
            <p>
              Status: <span className="font-medium">{submittedStatus.state.replaceAll("_", " ")}</span>
            </p>
            <p>
              Next action: <span className="font-medium">{submittedStatus.nextAction}</span>
            </p>
            {submittedStatus.referralDocumentId ? (
              <p>
                Referral document: <span className="font-medium">{submittedStatus.referralDocumentId}</span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  })()

  const wizardLoading =
    activeStep !== "submitted" && (bookingEligibility.loading || intakePatientId === null || !hasRemoteHydrated)

  if (wizardLoading) {
    return (
      <section className="space-y-6" data-tutorial="patient.page.book-appointment">
        <PatientPageHeader title={bookingContent.header.title} description={bookingContent.header.description} />
        <DashboardStateBlock variant="loading" message="Preparing your booking…" />
      </section>
    )
  }

  return (
    <section className="space-y-6" data-tutorial="patient.page.book-appointment">
      <PatientPageHeader
        title={bookingEligibility.isNewPatient ? "Book your first appointment" : bookingContent.header.title}
        description={
          bookingEligibility.isNewPatient
            ? "Complete intake and choose a session time. Follow-up booking is available after your first visit."
            : bookingContent.header.description
        }
      />
      {paymentCancelled ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Payment was cancelled. Your slot may still be held briefly — return to review and choose{" "}
          <span className="font-medium">Pay & confirm booking</span> to try again.
        </div>
      ) : null}
      {activeStep !== "submitted" ? (
        <p className="text-muted-foreground text-xs">
          Draft sync:{" "}
          {remoteSyncState === "syncing"
            ? "Saving to cloud..."
            : remoteSyncState === "saved"
              ? "Saved across devices"
              : remoteSyncState === "conflict"
                ? "Version conflict detected. Refresh to merge latest draft."
                : remoteSyncState === "error"
                  ? "Cloud draft unavailable. Local save still active."
                  : "Idle"}
        </p>
      ) : null}
      {activeStep !== "submitted" ? (
        <>
          <BookingStepper steps={visibleSteps} currentIndex={stepIndex} />
          <BookingProgressSave message={bookingContent.helper.save} />
        </>
      ) : null}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg" id="booking-step-title">
            {activeStep === "submitted"
              ? "Request received"
              : visibleSteps[stepIndex]?.label ?? "Booking request"}
          </CardTitle>
          {activeStep !== "submitted" ? (
            <p className="text-muted-foreground pt-1 text-sm leading-relaxed" aria-live="polite">
              {bookingStepWhatsNext[activeStep]}
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-5">
          {errors.length > 0 ? (
            <div className="border-destructive/40 bg-destructive/10 text-destructive rounded-lg border p-3 text-xs">
              <p className="mb-2 flex items-center gap-1 font-medium">
                <WarningCircle size={14} />
                Please fix the following before continuing:
              </p>
              <ul className="list-inside list-disc space-y-1">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div
            key={activeStep}
            className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200 motion-reduce:animate-none"
            aria-labelledby="booking-step-title"
          >
            {content}
          </div>

          {activeStep !== "submitted" ? (
            <BookingActions
              isFirstStep={isFirstStep}
              isFinalStep={isFinalStep}
              isSubmitting={isSubmitting}
              onBack={goBack}
              onNext={goNext}
            />
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}

