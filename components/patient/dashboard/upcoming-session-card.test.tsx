import { fireEvent, screen, waitFor } from "@testing-library/react"

import { UpcomingSessionCard } from "@/components/patient/dashboard/upcoming-session-card"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/src/patient/booking/api", () => ({
  getAppointmentDetails: jest.fn(),
  postManageAppointment: jest.fn(),
}))

import { getAppointmentDetails, postManageAppointment } from "@/src/patient/booking/api"

const mockedGetAppointmentDetails = getAppointmentDetails as jest.MockedFunction<typeof getAppointmentDetails>
const mockedPostManageAppointment = postManageAppointment as jest.MockedFunction<typeof postManageAppointment>

describe("UpcomingSessionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetAppointmentDetails.mockResolvedValue({
      appointmentId: "appt_open_001",
      patientId: "user_patient_001",
      clinicianId: "clinician_001",
      scheduledStartAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
      status: "scheduled",
      chatWindowStatus: "locked",
      canJoinNow: false,
      canManage: true,
    })
    mockedPostManageAppointment.mockImplementation(async (_id, payload) => ({
      appointmentId: "appt_open_001",
      patientId: "user_patient_001",
      clinicianId: "clinician_001",
      scheduledStartAt:
        payload.action === "reschedule"
          ? payload.scheduledStartAt ?? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
      status: payload.action === "cancel" ? "cancelled" : "scheduled",
      chatWindowStatus: "locked",
      canJoinNow: false,
      canManage: true,
    }))
  })

  it("hides join link when suppressJoinButton is true", () => {
    renderWithQueryClient(
      <UpcomingSessionCard
        appointmentId="appt_open_001"
        sessionType="Consultation"
        clinicianName="Dr. Example"
        dateLabel="Oct 24"
        timeLabel="10:00 AM - 10:50 AM"
        suppressJoinButton
      />,
    )

    expect(screen.queryByRole("link", { name: "Join Telehealth Session" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Manage" })).toBeInTheDocument()
  })

  it("links join action to video-session route", () => {
    renderWithQueryClient(
      <UpcomingSessionCard
        appointmentId="appt_open_001"
        sessionType="Consultation"
        clinicianName="Dr. Example"
        dateLabel="Oct 24"
        timeLabel="10:00 AM - 10:50 AM"
      />,
    )

    expect(screen.getByRole("link", { name: "Join Telehealth Session" })).toHaveAttribute(
      "href",
      "/video-session/appt_open_001",
    )
  })

  it("loads details when manage is opened and allows cancel", async () => {
    renderWithQueryClient(
      <UpcomingSessionCard
        appointmentId="appt_open_001"
        sessionType="Consultation"
        clinicianName="Dr. Example"
        dateLabel="Oct 24"
        timeLabel="10:00 AM - 10:50 AM"
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Manage" }))
    await waitFor(() => expect(mockedGetAppointmentDetails).toHaveBeenCalledWith("appt_open_001"))

    fireEvent.click(screen.getByRole("button", { name: "Cancel appointment" }))
    await waitFor(() =>
      expect(mockedPostManageAppointment).toHaveBeenCalledWith("appt_open_001", { action: "cancel" }),
    )
  })
})
