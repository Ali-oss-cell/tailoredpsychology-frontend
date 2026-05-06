import { render, screen } from "@testing-library/react"

import ManagerDashboardPage from "@/app/manager/dashboard/page"

jest.mock("@/components/ops/ops-shell", () => ({
  OpsShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/patient/patient-page-header", () => ({
  PatientPageHeader: ({ title }: { title: string; description: string }) => <h1>{title}</h1>,
}))
jest.mock("@/components/ops/ops-insights-card", () => ({ OpsInsightsCard: () => <div>Ops insights</div> }))
jest.mock("@/components/ops/telehealth-insights-card", () => ({ TelehealthInsightsCard: () => <div>Telehealth insights</div> }))
jest.mock("@/components/ops/intake-queue-card", () => ({ IntakeQueueCard: () => <div>Intake queue</div> }))
jest.mock("@/components/ops/referral-action-card", () => ({
  ReferralActionCard: ({ mode }: { mode: "manager" | "admin" }) => <div>Referral action mode: {mode}</div>,
}))

describe("ManagerDashboardPage", () => {
  it("renders manager referral action card", () => {
    render(<ManagerDashboardPage />)
    expect(screen.getByText("Practice Manager Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Referral action mode: manager")).toBeInTheDocument()
  })
})
