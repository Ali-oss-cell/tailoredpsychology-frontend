import { render, screen } from "@testing-library/react"

import AdminPrivacyRequestsPage from "@/app/admin/privacy-requests/page"

jest.mock("@/components/ops/ops-shell", () => ({
  OpsShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/ops/patient-data-requests-queue-card", () => ({
  PatientDataRequestsQueueCard: () => <div>Queue card</div>,
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string; description: string }) => <h1>{title}</h1>,
}))

describe("AdminPrivacyRequestsPage", () => {
  it("renders privacy requests triage surface", () => {
    render(<AdminPrivacyRequestsPage />)
    expect(screen.getByText("Patient Data Requests")).toBeInTheDocument()
    expect(screen.getByText("Queue card")).toBeInTheDocument()
  })
})
