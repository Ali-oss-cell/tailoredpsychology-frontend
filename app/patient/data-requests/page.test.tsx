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
    fireEvent.click(await screen.findByRole("button", { name: "Request access" }))
    fireEvent.change(screen.getByPlaceholderText("Describe what records you need or what should be corrected."), {
      target: { value: "Please provide records." },
    })
    fireEvent.click(screen.getByRole("button", { name: "Submit request" }))
    await waitFor(() => expect(createRequestMock).toHaveBeenCalled())
  })
})
