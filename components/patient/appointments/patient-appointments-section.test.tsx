import { render, screen, waitFor } from "@testing-library/react"

import { PatientAppointmentsSection } from "@/components/patient/appointments/patient-appointments-section"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/components/patient/appointments/appointment-manage-panel", () => ({
  AppointmentManagePanel: () => <div>Manage panel</div>,
}))
jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))
jest.mock("@/src/patient/booking/api", () => ({
  getPatientAppointments: jest.fn(),
}))
jest.mock("@/src/sessions/api", () => ({
  getPatientSessions: jest.fn(),
  getSessionDetail: jest.fn(),
}))

import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments } from "@/src/patient/booking/api"
import { getPatientSessions, getSessionDetail } from "@/src/sessions/api"

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetPatientAppointments = getPatientAppointments as jest.MockedFunction<typeof getPatientAppointments>
const mockedGetPatientSessions = getPatientSessions as jest.MockedFunction<typeof getPatientSessions>
const mockedGetSessionDetail = getSessionDetail as jest.MockedFunction<typeof getSessionDetail>

describe("PatientAppointmentsSection", () => {
  it("shows enriched viewer access mode for recent sessions", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_patient_001",
      email: "patient@clink.test",
      displayName: "Patient",
      role: "patient",
      accountSetupComplete: true,
    })
    mockedGetPatientAppointments.mockResolvedValue({
      upcoming: [],
      past: [
        {
          appointmentId: "appt_closed_001",
          clinicianId: "clinician_001",
          clinicianName: "Dr. A",
          sessionTypeLabel: "Clinical psychology consultation",
          scheduledStartAt: new Date(Date.now() - 120_000).toISOString(),
          scheduledEndAt: new Date(Date.now() - 60_000).toISOString(),
          status: "completed",
          statusLabel: "Completed",
        },
      ],
    })
    mockedGetPatientSessions.mockResolvedValue([
      {
        sessionId: "appt_closed_001",
        scheduledStartAt: new Date().toISOString(),
        scheduledEndAt: new Date().toISOString(),
        status: "completed",
        clinicianId: "clinician_001",
        patientId: "user_patient_001",
      },
    ])
    mockedGetSessionDetail.mockResolvedValue({
      sessionId: "appt_closed_001",
      patientId: "user_patient_001",
      clinicianId: "clinician_001",
      scheduledStartAt: new Date().toISOString(),
      scheduledEndAt: new Date().toISOString(),
      status: "completed",
      sessionTypeLabel: "Clinical psychology consultation",
      viewerAccessMode: "owner_patient",
    })

    renderWithQueryClient(<PatientAppointmentsSection />)

    await waitFor(() => expect(screen.getByText("Recent sessions")).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText(/owner patient/i)).toBeInTheDocument())
  })
})
