import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import PsychologistRecordingsPage from "@/app/psychologist/recordings/page"

const requestAccessMock = jest.fn().mockResolvedValue({
  videoId: "video_appt_open_001",
  canDownload: false,
  denialReason: "Downloads blocked while legal hold is active.",
})

jest.mock("@/components/psychologist/psychologist-shell", () => ({
  PsychologistShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string; description: string }) => <h1>{title}</h1>,
}))
jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    id: "user_psychologist_001",
    email: "psychologist@clink.test",
    displayName: "Psychologist Demo",
    role: "psychologist",
    accountSetupComplete: true,
  }),
}))
jest.mock("@/src/psychologist/videos/api", () => ({
  getPsychologistSessionVideos: jest.fn().mockResolvedValue([
    {
      videoId: "video_appt_open_001",
      sessionId: "appt_open_001",
      patientId: "user_patient_001",
      clinicianId: "clinician_001",
      sessionDate: "2026-04-28T10:00:00.000Z",
      policyStatus: "hold",
      canDownload: true,
      watermarkRequired: true,
      watermarkText: "CLINK CONFIDENTIAL",
      transcriptReady: true,
    },
  ]),
  requestSessionVideoAccess: (...args: unknown[]) => requestAccessMock(...args),
}))

describe("PsychologistRecordingsPage", () => {
  it("shows policy denial returned by access gate", async () => {
    render(<PsychologistRecordingsPage />)
    const button = await screen.findByRole("button", { name: "Request access" })
    fireEvent.click(button)
    await waitFor(() => expect(requestAccessMock).toHaveBeenCalledWith("video_appt_open_001"))
    await screen.findByText("Downloads blocked while legal hold is active.")
  })
})
