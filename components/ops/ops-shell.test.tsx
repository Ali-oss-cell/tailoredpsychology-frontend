import { render, screen } from "@testing-library/react"

import { OpsShell } from "@/components/ops/ops-shell"

jest.mock("@/components/notifications/notification-bell", () => ({
  NotificationBell: () => <div data-testid="notification-bell-stub" />,
}))

describe("OpsShell navigation visibility", () => {
  it("shows admin-only navigation for admin routes", () => {
    render(
      <OpsShell activeRoute="admin-dashboard">
        <div>Admin page</div>
      </OpsShell>,
    )

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Admin Users")).toBeInTheDocument()
    expect(screen.getByText("Referrals")).toBeInTheDocument()
    expect(screen.queryByText("Manager Referrals")).not.toBeInTheDocument()
    expect(screen.queryByText("Manager Dashboard")).not.toBeInTheDocument()
    expect(screen.queryByText("Manager Staff")).not.toBeInTheDocument()
  })

  it("shows manager-only navigation for manager routes", () => {
    render(
      <OpsShell activeRoute="manager-dashboard">
        <div>Manager page</div>
      </OpsShell>,
    )

    expect(screen.getByText("Manager Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Manager Staff")).toBeInTheDocument()
    expect(screen.getByText("Manager Referrals")).toBeInTheDocument()
    expect(screen.queryByText("Referrals")).not.toBeInTheDocument()
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument()
    expect(screen.queryByText("Admin Users")).not.toBeInTheDocument()
  })
})
