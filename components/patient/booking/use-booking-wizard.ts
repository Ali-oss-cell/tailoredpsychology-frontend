"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import {
  bookingSteps,
  clinicians,
  CLINICIAN_PORTRAIT_URLS,
  initialBookingDraft,
  mapStaticCliniciansToLiveOptions,
  scheduleByDate,
} from "@/content/patient-booking"
import {
  commitIntakeDraft,
  createBookingCheckout,
  createBookingRequest,
  getClinicianAvailability,
  getLatestIntakeDraft,
  saveIntakeDraftDelta,
  ApiRequestError,
  type BookingRequestStatusResponse,
} from "@/src/patient/booking/api"
import {
  dateKey,
  findNextAvailableLabel,
  monthEnd,
  monthStart,
  toScheduleByDate,
  type ClinicianOption,
} from "@/src/patient/booking/booking-schedule-utils"
import {
  firstInvalidFieldId,
  validateBookingStep,
  type BookingFieldErrors,
} from "@/src/patient/booking/booking-validation"
import { mergeBookingDraftFromSources } from "@/src/patient/booking/merge-booking-draft"
import type { BookingRequestDraft, BookingStepId } from "@/src/patient/booking/types"
import { usePatientBookingEligibility } from "@/src/patient/booking/use-patient-booking-eligibility"
import { useWizardDraft } from "@/src/patient/booking/use-wizard-draft"
import { trackFrontendAnalyticsEvent } from "@/src/analytics/events"
import { getCurrentUser } from "@/src/auth/current-user"
import { loadMatchQuizDraft } from "@/src/get-matched/storage"
import { toast } from "@/src/lib/toast"

const STORAGE_KEY = "clink_booking_draft_v1"
const DEMO_PATIENT_ID = "user_patient_001"

const STATIC_CLINICIAN_BY_ID = Object.fromEntries(clinicians.map((c) => [c.id, c])) as Record<
  string,
  (typeof clinicians)[number]
>

function parsePersistedDraft(raw: string | null): BookingRequestDraft | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as BookingRequestDraft
    return {
      ...parsed,
      patientIdentity: {
        ...initialBookingDraft.patientIdentity,
        ...parsed.patientIdentity,
        indigenousStatus: parsed.patientIdentity?.indigenousStatus ?? "",
      },
      referralFile: { ...parsed.referralFile, file: null },
    }
  } catch {
    return null
  }
}

export function useBookingWizard() {
  const searchParams = useSearchParams()
  const paymentCancelled = searchParams.get("payment") === "cancelled"
  const seededConcern = searchParams.get("condition")

  const {
    draft,
    setDraft,
    clearDraft,
  } = useWizardDraft<BookingRequestDraft>({
    storageKey: STORAGE_KEY,
    initialValue: initialBookingDraft,
    paused: false,
    deserialize: parsePersistedDraft,
    serialize: (value) =>
      JSON.stringify({
        ...value,
        referralFile: { ...value.referralFile, file: null },
      }),
  })

  const [activeStep, setActiveStep] = React.useState<BookingStepId>("mode")
  const [errors, setErrors] = React.useState<string[]>([])
  const [fieldErrors, setFieldErrors] = React.useState<BookingFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submittedStatus, setSubmittedStatus] = React.useState<BookingRequestStatusResponse | null>(null)
  const [liveScheduleByDate, setLiveScheduleByDate] = React.useState(scheduleByDate)
  const [liveClinicians, setLiveClinicians] = React.useState<ClinicianOption[]>(() => mapStaticCliniciansToLiveOptions())
  const [isLoadingSchedule, setIsLoadingSchedule] = React.useState(false)
  const [scheduleLoadError, setScheduleLoadError] = React.useState<string | null>(null)
  const [availabilityRetryNonce, setAvailabilityRetryNonce] = React.useState(0)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => {
    const firstDate = Object.keys(scheduleByDate)[0]
    return firstDate ? monthStart(new Date(firstDate)) : monthStart(new Date())
  })
  const [draftVersion, setDraftVersion] = React.useState(0)
  const [remoteSyncState, setRemoteSyncState] = React.useState<"idle" | "syncing" | "saved" | "conflict" | "error">("idle")
  const [hasRemoteHydrated, setHasRemoteHydrated] = React.useState(false)
  const [intakePatientId, setIntakePatientId] = React.useState<string | null>(null)
  const saveTimeoutRef = React.useRef<number | null>(null)
  const draftVersionRef = React.useRef(0)
  const lastSyncedSnapshotRef = React.useRef("")

  const hydrateRemoteDraft = React.useCallback(async () => {
    if (intakePatientId === null) return
    try {
      const [latest, user] = await Promise.all([
        getLatestIntakeDraft(intakePatientId),
        getCurrentUser().catch(() => null),
      ])
      const matchQuiz = loadMatchQuizDraft()
      const intakePartial =
        latest.data && Object.keys(latest.data).length > 0
          ? (latest.data as Partial<BookingRequestDraft>)
          : undefined
      setDraft((current) => mergeBookingDraftFromSources(current, { intake: intakePartial, user, matchQuiz }))
      setDraftVersion(latest.draftVersion)
      const hydrated = mergeBookingDraftFromSources(initialBookingDraft, { intake: intakePartial, user, matchQuiz })
      lastSyncedSnapshotRef.current = JSON.stringify({
        ...hydrated,
        referralFile: { ...hydrated.referralFile, file: null },
      })
      setRemoteSyncState("saved")
    } catch {
      setRemoteSyncState("error")
    } finally {
      setHasRemoteHydrated(true)
    }
  }, [intakePatientId, setDraft])

  const refreshRemoteDraft = React.useCallback(() => {
    void hydrateRemoteDraft()
  }, [hydrateRemoteDraft])

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
    if (bookingEligibility.loading) return
    setDraft((current) => {
      const parts = bookingEligibility.displayName.trim().split(/\s+/).filter(Boolean)
      const next = { ...current }
      if (bookingEligibility.isNewPatient) {
        next.bookingMeta = { bookingType: "initial", changesSinceLastVisit: "no" }
      } else if (current.bookingMeta.bookingType !== "follow_up" && current.bookingMeta.bookingType !== "initial") {
        next.bookingMeta = { ...current.bookingMeta, bookingType: "initial" }
      }
      if (!current.patientIdentity.fullName.trim() && parts.length > 0) {
        next.patientIdentity = { ...current.patientIdentity, fullName: bookingEligibility.displayName.trim() }
      }
      if (!current.patientIdentity.email.trim() && bookingEligibility.email) {
        next.patientIdentity = { ...next.patientIdentity, email: bookingEligibility.email }
      }
      return next
    })
    if (skipModeStep && activeStep === "mode") {
      const firstVisible = bookingSteps.find((step) => {
        if (step.id === "mode") return false
        if (step.id === "referral" && !shouldShowReferralStep) return false
        return true
      })
      if (firstVisible) setActiveStep(firstVisible.id)
    }
  }, [
    bookingEligibility.loading,
    bookingEligibility.isNewPatient,
    bookingEligibility.displayName,
    bookingEligibility.email,
    skipModeStep,
    activeStep,
    shouldShowReferralStep,
    setDraft,
  ])

  React.useEffect(() => {
    draftVersionRef.current = draftVersion
  }, [draftVersion])

  React.useEffect(() => {
    const source = searchParams.get("source") ?? "direct"
    const condition = searchParams.get("condition")
    void trackFrontendAnalyticsEvent({
      name: "intake_started",
      targetId: "booking-wizard",
      idempotencyKey: `intake_started:${source}:${condition ?? "none"}`,
      metadata: {
        source,
        condition: condition ?? null,
        utm_source: searchParams.get("utm_source"),
        utm_medium: searchParams.get("utm_medium"),
        utm_campaign: searchParams.get("utm_campaign"),
      },
    }).catch(() => undefined)
  }, [searchParams])

  React.useEffect(() => {
    if (seededConcern && !draft.careContext.presentingConcerns.trim()) {
      setDraft((current) => ({
        ...current,
        careContext: {
          ...current.careContext,
          presentingConcerns: `Seeking support for ${seededConcern.replaceAll("-", " ")}.`,
        },
      }))
    }
  }, [seededConcern, draft.careContext.presentingConcerns, setDraft])

  React.useEffect(() => {
    void getCurrentUser()
      .then((u) => setIntakePatientId(u.role === "patient" ? u.id : DEMO_PATIENT_ID))
      .catch(() => setIntakePatientId(DEMO_PATIENT_ID))
  }, [])

  React.useEffect(() => {
    if (intakePatientId === null) return
    let isCancelled = false
    const run = async () => {
      await hydrateRemoteDraft()
      if (isCancelled) return
    }
    void run()
    return () => {
      isCancelled = true
    }
  }, [intakePatientId, hydrateRemoteDraft])

  React.useEffect(() => {
    const id = searchParams.get("clinician")
    if (!id || !hasRemoteHydrated) return
    setDraft((current) => {
      if (current.scheduleSelection.selectedClinicianId === id) return current
      return {
        ...current,
        scheduleSelection: { ...current.scheduleSelection, selectedClinicianId: id },
      }
    })
  }, [searchParams, hasRemoteHydrated, setDraft])

  React.useEffect(() => {
    if (intakePatientId === null || !hasRemoteHydrated || activeStep === "submitted") return
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = window.setTimeout(() => {
      const sync = async () => {
        try {
          const serializableDraft = { ...draft, referralFile: { ...draft.referralFile, file: null } }
          const snapshot = JSON.stringify(serializableDraft)
          if (snapshot === lastSyncedSnapshotRef.current) return
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
          setRemoteSyncState(error instanceof ApiRequestError && error.status === 409 ? "conflict" : "error")
        }
      }
      void sync()
    }, 800)
    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
    }
  }, [draft, hasRemoteHydrated, activeStep, intakePatientId])

  const lastSyncToastRef = React.useRef<"idle" | "conflict" | "error">("idle")
  React.useEffect(() => {
    if (remoteSyncState === "conflict" && lastSyncToastRef.current !== "conflict") {
      lastSyncToastRef.current = "conflict"
      toast.error("Your booking draft could not sync — another version was saved elsewhere. Refresh to continue.")
    } else if (remoteSyncState === "error" && lastSyncToastRef.current !== "error") {
      lastSyncToastRef.current = "error"
      toast.error("Could not save your booking draft to the server. Your progress is still saved on this device.")
    } else if (remoteSyncState === "saved" || remoteSyncState === "syncing" || remoteSyncState === "idle") {
      lastSyncToastRef.current = "idle"
    }
  }, [remoteSyncState])

  React.useEffect(() => {
    if (activeStep !== "schedule") return
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
        if (isCancelled) return
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
        if (isCancelled) return
        setScheduleLoadError("Live availability is unavailable right now. Showing local fallback schedule.")
        setLiveClinicians(mapStaticCliniciansToLiveOptions())
        setLiveScheduleByDate(scheduleByDate)
      } finally {
        if (!isCancelled) setIsLoadingSchedule(false)
      }
    }
    void loadAvailability()
    return () => {
      isCancelled = true
    }
  }, [activeStep, calendarMonth, draft.scheduleSelection.selectedClinicianId, availabilityRetryNonce])

  const stepIndex = visibleSteps.findIndex((item) => item.id === activeStep)
  const isFinalStep = activeStep === "review"
  const isFirstStep = stepIndex === 0

  const updateDraft = React.useCallback(
    <Section extends keyof BookingRequestDraft>(section: Section, value: BookingRequestDraft[Section]) => {
      setDraft((current) => ({ ...current, [section]: value }))
    },
    [setDraft],
  )

  const selectedSlot = React.useMemo(() => {
    if (!draft.scheduleSelection.selectedDate || !draft.scheduleSelection.selectedSlotId) return null
    return (liveScheduleByDate[draft.scheduleSelection.selectedDate] ?? []).find(
      (item) => item.id === draft.scheduleSelection.selectedSlotId,
    )
  }, [draft.scheduleSelection, liveScheduleByDate])

  const selectedSlotLabel = selectedSlot?.label ?? ""

  const focusFirstInvalidField = (nextFieldErrors: BookingFieldErrors) => {
    const fieldId = firstInvalidFieldId(nextFieldErrors)
    if (!fieldId) return
    window.requestAnimationFrame(() => {
      document.getElementById(fieldId)?.focus()
      document.getElementById(fieldId)?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }

  const goNext = () => {
    const validation = validateBookingStep(activeStep, draft)
    if (validation.summaryErrors.length > 0) {
      setFieldErrors(validation.fieldErrors)
      setErrors(validation.summaryErrors)
      focusFirstInvalidField(validation.fieldErrors)
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
          clearDraft()
          window.location.assign(checkout.checkoutUrl)
        } catch (error) {
          setErrors([
            error instanceof Error
              ? error.message
              : "Unable to start payment. Your slot may still be held — try again from review.",
          ])
        } finally {
          setIsSubmitting(false)
        }
      }
      void submit()
      return
    }

    setErrors([])
    setFieldErrors({})
    setActiveStep(visibleSteps[stepIndex + 1].id)
  }

  const goBack = () => {
    if (isFirstStep || activeStep === "submitted") return
    setErrors([])
    setFieldErrors({})
    setActiveStep(visibleSteps[stepIndex - 1].id)
  }

  const scheduleStepIndex = visibleSteps.findIndex((step) => step.id === "schedule")
  const showAppointmentChip =
    scheduleStepIndex >= 0 &&
    (activeStep === "schedule" || stepIndex > scheduleStepIndex) &&
    Boolean(draft.scheduleSelection.selectedDate && draft.scheduleSelection.selectedSlotId)
  const chipClinicianName =
    liveClinicians.find((item) => item.id === draft.scheduleSelection.selectedClinicianId)?.name ?? "Your clinician"

  const wizardLoading =
    activeStep !== "submitted" && (bookingEligibility.loading || intakePatientId === null || !hasRemoteHydrated)

  const contextValue = React.useMemo(
    () => ({
      draft,
      updateDraft,
      fieldErrors,
      bookingEligibility,
      matchSource,
      preselectedClinicianName,
      liveClinicians,
      liveScheduleByDate,
      isLoadingSchedule,
      scheduleLoadError,
      calendarMonth,
      setCalendarMonth,
      setAvailabilityRetryNonce,
      selectedSlotLabel,
      submittedStatus,
    }),
    [
      draft,
      updateDraft,
      fieldErrors,
      bookingEligibility,
      matchSource,
      preselectedClinicianName,
      liveClinicians,
      liveScheduleByDate,
      isLoadingSchedule,
      scheduleLoadError,
      calendarMonth,
      selectedSlotLabel,
      submittedStatus,
    ],
  )

  return {
    paymentCancelled,
    activeStep,
    errors,
    isSubmitting,
    visibleSteps,
    stepIndex,
    isFirstStep,
    isFinalStep,
    remoteSyncState,
    refreshRemoteDraft,
    bookingEligibility,
    wizardLoading,
    showAppointmentChip,
    chipClinicianName,
    draft,
    selectedSlotLabel,
    goNext,
    goBack,
    contextValue,
  }
}

// Re-export for tests
export { findNextAvailableLabel } from "@/src/patient/booking/booking-schedule-utils"
