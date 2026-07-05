import { render, screen } from "@testing-library/react"

import AdminPrivacyRequestsPage from "@/app/admin/privacy-requests/page"

jest.mock("@/components/ops/ops-shell", () => ({
  OpsShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/ops/patient-data-requests-queue-card", () => ({
  PatientDataRequestsQueueCard: () => <div>Queue card</div>,
}))
jest.mock("@/components/ops/ops-portal-page", () => ({
  OpsPortalPage: ({ title, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

describe("AdminPrivacyRequestsPage", () => {
  it("renders privacy requests triage surface", () => {
    render(<AdminPrivacyRequestsPage />)
    expect(screen.getByText("Patient Data Requests")).toBeInTheDocument()
    expect(screen.getByText("Queue card")).toBeInTheDocument()
  })
})
