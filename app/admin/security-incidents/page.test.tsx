import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import AdminSecurityIncidentsPage from "@/app/admin/security-incidents/page"

const createMock = jest.fn().mockResolvedValue({
  incidentId: "sec_0002",
  title: "Potential data exposure incident",
  summary: "Automatic alert detected anomalous access behavior requiring triage.",
  severity: "high",
  impact: "moderate",
  status: "reported",
  ndbAssessment: "assessment_in_progress",
  containsPersonalData: true,
  detectedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const updateMock = jest.fn().mockResolvedValue({
  incidentId: "sec_0001",
  title: "Potential unauthorized access",
  summary: "Spike in privileged export attempts observed.",
  severity: "high",
  impact: "moderate",
  status: "triage",
  ndbAssessment: "assessment_in_progress",
  containsPersonalData: true,
  detectedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

jest.mock("@/components/ops/ops-shell", () => ({
  OpsShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string; description: string }) => <h1>{title}</h1>,
}))
jest.mock("@/src/admin/security-incidents/api", () => ({
  getSecurityIncidents: jest.fn().mockResolvedValue([
    {
      incidentId: "sec_0001",
      title: "Potential unauthorized access",
      summary: "Spike in privileged export attempts observed.",
      severity: "high",
      impact: "moderate",
      status: "reported",
      ndbAssessment: "assessment_in_progress",
      containsPersonalData: true,
      detectedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]),
  createSecurityIncident: (...args: unknown[]) => createMock(...args),
  updateSecurityIncident: (...args: unknown[]) => updateMock(...args),
}))

describe("AdminSecurityIncidentsPage", () => {
  it("renders and supports create/advance actions", async () => {
    render(<AdminSecurityIncidentsPage />)
    expect(await screen.findByText("Security Incident Register")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Create incident" }))
    await waitFor(() => expect(createMock).toHaveBeenCalled())
    fireEvent.click(screen.getAllByRole("button", { name: "Advance state" })[0])
    await waitFor(() => expect(updateMock).toHaveBeenCalled())
  })
})
