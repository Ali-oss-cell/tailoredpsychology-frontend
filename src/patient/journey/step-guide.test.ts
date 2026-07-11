import type { PatientNextSession } from "@/src/patient/dashboard/api"
import type { PatientJourneyStep } from "@/src/patient/journey/api"
import {
  ctaForStep,
  contiguousDoneBoundary,
  currentPendingStep,
  displayStepStatus,
  resolveJourneyCta,
} from "@/src/patient/journey/step-guide"

function pendingStep(key: string): PatientJourneyStep {
  return { key, label: key, status: "pending" }
}

function doneStep(key: string): PatientJourneyStep {
  return { key, label: key, status: "done", occurredAt: "2026-07-01T10:00:00Z" }
}

const session: PatientNextSession = {
  appointmentId: "appt_1",
  clinicianId: "clin_1",
  clinicianName: "Dr. Example",
  sessionTypeLabel: "Consultation",
  scheduledStartAt: "2026-07-15T09:00:00Z",
  scheduledEndAt: "2026-07-15T10:00:00Z",
  status: "scheduled",
  statusLabel: "Scheduled",
  window: {
    status: "locked",
    opensAt: "2026-07-15T08:45:00Z",
    closesAt: "2026-07-15T10:00:00Z",
  },
}

describe("step-guide journey CTAs", () => {
  it("maps intake steps to continue intake", () => {
    expect(ctaForStep(pendingStep("intake_started"))).toEqual({
      label: "Continue intake",
      href: "/patient/book-appointment",
    })
    expect(ctaForStep(pendingStep("intake_submitted"))).toEqual({
      label: "Continue intake",
      href: "/patient/book-appointment",
    })
  })

  it("maps booking and session steps to appointment actions", () => {
    expect(ctaForStep(pendingStep("booking_requested"))).toEqual({
      label: "Book appointment",
      href: "/patient/book-appointment",
    })
    expect(ctaForStep(pendingStep("booking_confirmed"), { nextSession: session })).toEqual({
      label: "View appointment",
      href: "/patient/appointments",
    })
    expect(ctaForStep(pendingStep("session_completed"))).toEqual({
      label: "View billing",
      href: "/patient/invoices",
    })
  })

  it("never returns go-to-dashboard on the dashboard route", () => {
    const step = pendingStep("session_started")
    const cta = resolveJourneyCta(step, { pathname: "/patient/dashboard", nextSession: session })
    expect(cta?.href).not.toBe("/patient/dashboard")
    expect(cta?.label).toBe("View appointment")
  })

  it("offers join session when the window is open", () => {
    const openSession: PatientNextSession = {
      ...session,
      window: { ...session.window, status: "open" },
    }
    expect(ctaForStep(pendingStep("session_started"), { nextSession: openSession })).toEqual({
      label: "Join session",
      href: "/video-session/appt_1",
    })
  })
})

describe("step-guide ordering", () => {
  it("treats out-of-order done steps as not yet reached", () => {
    const steps = [
      doneStep("intake_started"),
      doneStep("intake_submitted"),
      pendingStep("booking_requested"),
      pendingStep("booking_confirmed"),
      pendingStep("session_started"),
      pendingStep("session_completed"),
      doneStep("invoice_downloaded"),
    ]

    expect(displayStepStatus(steps[6], steps)).toBe("pending")
    expect(contiguousDoneBoundary(steps)).toBe(2)
    expect(currentPendingStep(steps)?.key).toBe("booking_requested")
  })
})
