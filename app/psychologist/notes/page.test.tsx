import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import PsychologistNotesPage from "@/app/psychologist/notes/page"

jest.mock("@/src/psychologist/queries/use-current-user", () => ({
  usePsychologistId: () => "user_psychologist_001",
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
