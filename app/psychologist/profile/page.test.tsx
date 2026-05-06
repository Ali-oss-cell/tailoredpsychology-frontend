import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import PsychologistProfilePage from "@/app/psychologist/profile/page"

jest.mock("@/components/psychologist/psychologist-shell", () => ({
  PsychologistShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string; description: string }) => <h1>{title}</h1>,
}))
const updateMock = jest.fn().mockResolvedValue({
  psychologistId: "user_psychologist_001",
  email: "psychologist@clink.test",
  displayName: "Psychologist Demo",
  registrationNumber: "PSY-AHPRA-001",
  providerNumber: "PRV-100001",
  specialties: ["anxiety"],
  status: "active",
  bio: "Updated bio",
  profileImageUrl: "",
})
jest.mock("@/src/psychologist/profile/api", () => ({
  getPsychologistProfile: jest.fn().mockResolvedValue({
    psychologistId: "user_psychologist_001",
    email: "psychologist@clink.test",
    displayName: "Psychologist Demo",
    registrationNumber: "PSY-AHPRA-001",
    providerNumber: "PRV-100001",
    specialties: ["anxiety"],
    status: "active",
    bio: "Initial bio",
    profileImageUrl: "",
  }),
  updatePsychologistProfile: (...args: unknown[]) => updateMock(...args),
  uploadPsychologistProfileAvatar: jest.fn(),
}))
jest.mock("@/src/patient/account/api", () => ({
  postChangePassword: jest.fn(),
}))

describe("PsychologistProfilePage", () => {
  it("updates profile from edit action", async () => {
    render(<PsychologistProfilePage />)
    await waitFor(() => expect(screen.getByText("Psychologist Demo")).toBeInTheDocument())
    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }))
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }))
    await waitFor(() => expect(updateMock).toHaveBeenCalled())
  })
})
