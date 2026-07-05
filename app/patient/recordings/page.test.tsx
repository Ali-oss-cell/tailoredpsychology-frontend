import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import PatientRecordingsPage from "@/app/patient/recordings/page"

const requestAccessMock = jest.fn().mockResolvedValue({
  videoId: "video_appt_open_001",
  canDownload: true,
  downloadUrl: "https://example.com/protected-download/token123",
  expiresAt: "2026-04-30T10:00:00.000Z",
})

jest.mock("@/components/patient/patient-portal-page", () => ({
  PatientPortalPage: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))
jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({ id: "user_patient_001", role: "patient" }),
}))
jest.mock("@/src/psychologist/videos/api", () => ({
  getPatientSessionVideos: jest.fn().mockResolvedValue([
    {
      videoId: "video_appt_open_001",
      sessionId: "appt_open_001",
      patientId: "user_patient_001",
      clinicianId: "clinician_001",
      sessionDate: "2026-04-28T10:00:00.000Z",
      policyStatus: "active",
      canDownload: true,
      watermarkRequired: true,
      watermarkText: "CLINK CONFIDENTIAL",
      transcriptReady: true,
    },
  ]),
  requestSessionVideoAccess: (...args: unknown[]) => requestAccessMock(...args),
}))

describe("PatientRecordingsPage", () => {
  it("requests tokenized access before opening download", async () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null)
    render(<PatientRecordingsPage />)
    const button = await screen.findByRole("button", { name: "Request access" })
    fireEvent.click(button)
    await waitFor(() => expect(requestAccessMock).toHaveBeenCalledWith("video_appt_open_001"))
    await waitFor(() => expect(openSpy).toHaveBeenCalled())
    openSpy.mockRestore()
  })
})
