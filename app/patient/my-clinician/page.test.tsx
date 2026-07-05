import { render, screen, waitFor } from "@testing-library/react"

import PatientMyClinicianPage from "@/app/patient/my-clinician/page"

jest.mock("@/components/patient/patient-shell", () => ({
  PatientShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-portal-page", () => ({
  PatientPortalPage: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))
jest.mock("@/src/patient/care-team/api", () => ({
  getMyCareTeam: jest.fn(),
}))
jest.mock("@/src/patient/booking/api", () => ({
  getPatientAppointments: jest.fn(),
}))

import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments } from "@/src/patient/booking/api"
import { getMyCareTeam } from "@/src/patient/care-team/api"

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetPatientAppointments = getPatientAppointments as jest.MockedFunction<typeof getPatientAppointments>
const mockedGetMyCareTeam = getMyCareTeam as jest.MockedFunction<typeof getMyCareTeam>

describe("PatientMyClinicianPage", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_patient_001",
      email: "patient@clink.test",
      displayName: "Patient",
      role: "patient",
      accountSetupComplete: true,
    })
    mockedGetPatientAppointments.mockResolvedValue({
      upcoming: [
        {
          appointmentId: "appt_up_1",
          clinicianId: "clinician_001",
          clinicianName: "Dr Demo",
          sessionTypeLabel: "Clinical psychology consultation",
          scheduledStartAt: "2026-05-10T10:00:00.000Z",
          scheduledEndAt: "2026-05-10T11:00:00.000Z",
          status: "scheduled",
          statusLabel: "Scheduled",
        },
      ],
      past: [
        {
          appointmentId: "appt_past_1",
          clinicianId: "clinician_001",
          clinicianName: "Dr Demo",
          sessionTypeLabel: "Clinical psychology consultation",
          scheduledStartAt: "2026-04-01T10:00:00.000Z",
          scheduledEndAt: "2026-04-01T11:00:00.000Z",
          status: "completed",
          statusLabel: "Completed",
        },
      ],
    })
    mockedGetMyCareTeam.mockResolvedValue([
      {
        clinicianId: "clinician_001",
        psychologistUserId: "user_psychologist_001",
        displayName: "Dr Demo",
        registrationNumber: "PSY-001",
        providerNumber: "PRV-1",
        specialties: ["anxiety"],
        accountStatus: "active",
        nextSessionAt: "2026-05-10T10:00:00.000Z",
        lastSessionAt: "2026-04-01T10:00:00.000Z",
      },
    ])
  })

  it("renders care team and appointment rows from APIs", async () => {
    render(<PatientMyClinicianPage />)
    await waitFor(() => expect(screen.getByText("Dr Demo")).toBeInTheDocument())
    expect(screen.getByText(/PSY-001/)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole("link", { name: /Book with this clinician/i })).toBeInTheDocument())
    expect(screen.getByRole("link", { name: /Book with this clinician/i })).toHaveAttribute(
      "href",
      "/patient/book-appointment?clinician=clinician_001",
    )
    expect(screen.getByText(/Upcoming/i)).toBeInTheDocument()
    expect(screen.getByText(/Recent sessions/i)).toBeInTheDocument()
  })
})
