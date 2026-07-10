import { fireEvent, screen, waitFor } from "@testing-library/react"

import PsychologistRecordingsPage from "@/app/psychologist/recordings/page"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

const requestAccessMock = jest.fn().mockResolvedValue({
  videoId: "video_appt_open_001",
  canDownload: false,
  denialReason: "Downloads blocked while legal hold is active.",
})

jest.mock("@/src/psychologist/queries/use-current-user", () => ({
  usePsychologistId: () => "user_psychologist_001",
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
    renderWithQueryClient(<PsychologistRecordingsPage />)
    const button = await screen.findByRole("button", { name: "Request access" })
    fireEvent.click(button)
    await waitFor(() => expect(requestAccessMock).toHaveBeenCalledWith("video_appt_open_001"))
    await screen.findByText("Downloads blocked while legal hold is active.")
  })
})
