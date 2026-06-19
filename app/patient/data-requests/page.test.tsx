import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import PatientDataRequestsPage from "@/app/patient/data-requests/page"

const createRequestMock = jest.fn().mockResolvedValue({
  requestId: "pdr_0002",
  patientId: "user_patient_001",
  requestType: "access",
  status: "submitted",
  details: "Need records",
  slaDueAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

jest.mock("@/components/patient/patient-shell", () => ({
  PatientShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string; description: string }) => <h1>{title}</h1>,
}))
jest.mock("@/src/privacy-requests/api", () => ({
  getMyPatientDataRequests: jest.fn().mockResolvedValue([]),
  createPatientDataRequest: (...args: unknown[]) => createRequestMock(...args),
}))

describe("PatientDataRequestsPage", () => {
  it("submits new access request", async () => {
    render(<PatientDataRequestsPage />)
    fireEvent.click(await screen.findByRole("button", { name: "Get a copy of my records" }))
    fireEvent.change(
      screen.getByPlaceholderText("e.g. I'd like a copy of my session notes from the past 12 months."),
      {
        target: { value: "Please provide records." },
      },
    )
    fireEvent.click(screen.getByRole("button", { name: "Send request" }))
    await waitFor(() => expect(createRequestMock).toHaveBeenCalled())
  })
})
