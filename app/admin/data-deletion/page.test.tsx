import { render, screen, waitFor } from "@testing-library/react"

import AdminDataDeletionPage from "@/app/admin/data-deletion/page"
import { getAdminDeletionQueue } from "@/src/admin/ops/api"

jest.mock("@/components/ops/ops-shell", () => ({
  OpsShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock("@/src/admin/ops/api", () => ({
  getAdminDeletionQueue: jest.fn().mockResolvedValue([
    {
      patientId: "user_patient_001",
      deletedAt: null,
      legalHoldActive: false,
      retentionUntil: null,
      purgeEligible: false,
    },
  ]),
}))

const mockedGetAdminDeletionQueue = getAdminDeletionQueue as jest.MockedFunction<typeof getAdminDeletionQueue>

describe("AdminDataDeletionPage", () => {
  it("renders data deletion live section", async () => {
    render(<AdminDataDeletionPage />)
    await waitFor(() => expect(screen.getByText("Data Deletion Requests")).toBeInTheDocument())
    expect(mockedGetAdminDeletionQueue).toHaveBeenCalled()
  })
})
