import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { PatientInvoicesSection } from "@/components/patient/billing/patient-invoices-section"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    id: "user_patient_001",
    email: "patient@clink.test",
    displayName: "Patient",
    role: "patient",
    accountSetupComplete: true,
  }),
}))

jest.mock("@/src/patient/billing/api", () => ({
  listPatientInvoices: jest.fn(),
  downloadPatientInvoice: jest.fn(),
}))

import { downloadPatientInvoice, listPatientInvoices } from "@/src/patient/billing/api"

const mockedList = listPatientInvoices as jest.MockedFunction<typeof listPatientInvoices>
const mockedDownload = downloadPatientInvoice as jest.MockedFunction<typeof downloadPatientInvoice>

describe("PatientInvoicesSection", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    jest.clearAllMocks()
    mockedList.mockResolvedValue([
      { invoiceId: "INV-1042", issuedDate: "Oct 24, 2026", amountLabel: "$220.00", status: "Paid" },
    ])
    mockedDownload.mockResolvedValue({
      blob: new Blob(["stub"], { type: "text/plain" }),
      filename: "INV-1042.txt",
      contentType: "text/plain",
    })
  })

  it("renders invoice rows and triggers download", async () => {
    const originalCreate = global.URL.createObjectURL
    const originalRevoke = global.URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:mock")
    global.URL.revokeObjectURL = jest.fn()

    renderWithQueryClient(<PatientInvoicesSection title="Invoices" description="Billing history" />)

    await waitFor(() => expect(mockedList).toHaveBeenCalled())
    expect(await screen.findByText("INV-1042")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Download invoice INV-1042/i }))
    await waitFor(() => expect(mockedDownload).toHaveBeenCalledWith("INV-1042"))

    global.URL.createObjectURL = originalCreate
    global.URL.revokeObjectURL = originalRevoke
  })
})
