import { render, screen, waitFor } from "@testing-library/react"

import AdminAuditLogsPage from "@/app/admin/audit-logs/page"

jest.mock("@/components/ops/ops-shell", () => ({
  OpsShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/components/ops/admin-live-page-section", () => ({
  AdminLivePageSection: ({ title, load }: { title: string; load: () => Promise<Array<Record<string, unknown>>> }) => {
    void load()
    return <div>{title}</div>
  },
}))
jest.mock("@/src/admin/ops/api", () => ({
  getAuditEvents: jest.fn().mockResolvedValue([{ occurredAt: "now", action: "test", actorUserId: "u1", targetId: "t1" }]),
}))

describe("AdminAuditLogsPage", () => {
  it("renders audit logs page with live section", async () => {
    render(<AdminAuditLogsPage />)
    await waitFor(() => expect(screen.getByText("Admin Audit Logs")).toBeInTheDocument())
  })
})
