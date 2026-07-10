"use client"

import * as React from "react"

import type { BookingRequestDraft } from "@/src/patient/booking/types"
import type { BookingFieldErrors } from "@/src/patient/booking/booking-validation"
import type { ClinicianOption } from "@/src/patient/booking/booking-schedule-utils"
import type { BookingRequestStatusResponse } from "@/src/patient/booking/api"
import type { usePatientBookingEligibility } from "@/src/patient/booking/use-patient-booking-eligibility"

export type BookingWizardContextValue = {
  draft: BookingRequestDraft
  updateDraft: <Section extends keyof BookingRequestDraft>(
    section: Section,
    value: BookingRequestDraft[Section],
  ) => void
  fieldErrors: BookingFieldErrors
  bookingEligibility: ReturnType<typeof usePatientBookingEligibility>
  matchSource: boolean
  preselectedClinicianName?: string
  liveClinicians: ClinicianOption[]
  liveScheduleByDate: Record<string, { id: string; label: string; clinicianId: string }[]>
  isLoadingSchedule: boolean
  scheduleLoadError: string | null
  calendarMonth: Date
  setCalendarMonth: React.Dispatch<React.SetStateAction<Date>>
  setAvailabilityRetryNonce: React.Dispatch<React.SetStateAction<number>>
  selectedSlotLabel: string
  submittedStatus: BookingRequestStatusResponse | null
}

const BookingWizardContext = React.createContext<BookingWizardContextValue | null>(null)

export function BookingWizardProvider({
  value,
  children,
}: {
  value: BookingWizardContextValue
  children: React.ReactNode
}) {
  return <BookingWizardContext.Provider value={value}>{children}</BookingWizardContext.Provider>
}

export function useBookingWizardContext(): BookingWizardContextValue {
  const ctx = React.useContext(BookingWizardContext)
  if (!ctx) {
    throw new Error("useBookingWizardContext must be used within BookingWizardProvider")
  }
  return ctx
}
