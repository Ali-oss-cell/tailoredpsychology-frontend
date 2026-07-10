import { clinicians, initialBookingDraft, scheduleByDate } from "@/content/patient-booking"
import { formatDateAu, formatDateTimeAu } from "@/src/lib/format-au"
import type { BookingRequestStatusResponse } from "@/src/patient/booking/api"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

const STORAGE_KEY = "clink_booking_draft_v1"

function loadPersistedDraft(): BookingRequestDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BookingRequestDraft
    return {
      ...parsed,
      patientIdentity: {
        ...initialBookingDraft.patientIdentity,
        ...parsed.patientIdentity,
      },
    }
  } catch {
    return null
  }
}

function clinicianNameForId(clinicianId: string): string {
  return clinicians.find((item) => item.id === clinicianId)?.name ?? "Your clinician"
}

/** Build a patient-friendly appointment line from booking status + local draft. */
export function buildPaymentSuccessAppointmentSummary(
  status: BookingRequestStatusResponse,
): { clinicianName: string; whenLabel: string } | null {
  const draft = loadPersistedDraft()
  const clinicianId = status.clinicianId || draft?.scheduleSelection.selectedClinicianId || ""
  const clinicianName = clinicianId && clinicianId !== "no-preference" ? clinicianNameForId(clinicianId) : "Your clinician"

  const appointmentDate = status.appointmentDate || draft?.scheduleSelection.selectedDate
  if (!appointmentDate) {
    return { clinicianName, whenLabel: "We will confirm the exact time in your appointments list." }
  }

  const slotId = status.slotId || draft?.scheduleSelection.selectedSlotId
  const slotsForDate = scheduleByDate[appointmentDate] ?? []
  const matchedSlot = slotId ? slotsForDate.find((slot) => slot.id === slotId) : undefined

  if (matchedSlot?.label) {
    const timeMatch = matchedSlot.label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (timeMatch) {
      let hour = Number(timeMatch[1]) % 12
      if (timeMatch[3].toUpperCase() === "PM") hour += 12
      const iso = `${appointmentDate}T${String(hour).padStart(2, "0")}:${timeMatch[2]}:00`
      return { clinicianName, whenLabel: formatDateTimeAu(iso) }
    }
    return {
      clinicianName,
      whenLabel: `${formatDateAu(`${appointmentDate}T12:00:00`)} · ${matchedSlot.label}`,
    }
  }

  return {
    clinicianName,
    whenLabel: `${formatDateAu(`${appointmentDate}T12:00:00`)} · see appointments for exact time`,
  }
}
