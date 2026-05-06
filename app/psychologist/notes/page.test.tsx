import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import PsychologistNotesPage from "@/app/psychologist/notes/page"

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
const createMock = jest.fn().mockResolvedValue({
  noteId: "note_1",
  psychologistId: "user_psychologist_001",
  patientId: "user_patient_001",
  sessionId: "appt_open_001",
  status: "draft",
  body: "Initial therapist note.",
  updatedAt: new Date().toISOString(),
})
jest.mock("@/src/psychologist/notes/api", () => ({
  getPsychologistNotes: jest.fn().mockResolvedValue([]),
  createPsychologistNote: (...args: unknown[]) => createMock(...args),
  signPsychologistNote: jest.fn(),
}))
jest.mock("@/src/psychologist/note-session-choices", () => ({
  getNoteSessionChoices: jest.fn().mockResolvedValue([
    {
      patientId: "user_patient_001",
      sessionId: "appt_open_001",
      label: "user_patient_001 · mock session",
    },
  ]),
}))

describe("PsychologistNotesPage", () => {
  it("creates a note from page action using selected session", async () => {
    render(<PsychologistNotesPage />)
    const createBtn = screen.getByRole("button", { name: "Create note" })
    await waitFor(() => expect(createBtn).not.toBeDisabled())
    fireEvent.click(createBtn)
    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith(
        "user_psychologist_001",
        expect.objectContaining({
          patientId: "user_patient_001",
          sessionId: "appt_open_001",
          status: "draft",
        }),
      ),
    )
  })
})
