import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { ReferralQueueCard } from "@/components/ops/referral-queue-card"

jest.mock("@/src/ops/referrals/api", () => ({
  getReferralQueue: jest.fn(),
  submitReferralAction: jest.fn(),
}))

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))

import { getCurrentUser } from "@/src/auth/current-user"
import { getReferralQueue, submitReferralAction } from "@/src/ops/referrals/api"

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetReferralQueue = getReferralQueue as jest.MockedFunction<typeof getReferralQueue>
const mockedSubmitReferralAction = submitReferralAction as jest.MockedFunction<typeof submitReferralAction>

describe("ReferralQueueCard", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockResolvedValue({
      id: "admin_001",
      email: "admin@clink.test",
      displayName: "Admin",
      role: "admin",
      accountSetupComplete: true,
    })
    mockedGetReferralQueue.mockResolvedValue([
      {
        documentId: "ref_000001",
        patientId: "user_patient_001",
        status: "received",
        fileName: "ref.pdf",
        fileSize: 1200,
        mimeType: "application/pdf",
        uploadedAt: new Date().toISOString(),
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        overdue: false,
      },
    ])
    mockedSubmitReferralAction.mockResolvedValue({
      documentId: "ref_000001",
      patientId: "user_patient_001",
      status: "approved",
      fileName: "ref.pdf",
      fileSize: 1200,
      mimeType: "application/pdf",
      uploadedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      overdue: false,
      assignedOwnerUserId: "admin_001",
      reviewedBy: "admin_001",
      reviewReason: "Looks good",
    })
  })

  it("renders queue and submits approve action", async () => {
    render(<ReferralQueueCard />)

    await waitFor(() => expect(screen.getByText("ref_000001")).toBeInTheDocument())
    fireEvent.click(screen.getByRole("button", { name: "Approve" }))
    fireEvent.click(screen.getByRole("button", { name: "Confirm action" }))

    await waitFor(() =>
      expect(mockedSubmitReferralAction).toHaveBeenCalledWith("ref_000001", "approve", {
        reason: "",
        notes: "",
      }),
    )
    await waitFor(() => expect(screen.getByText("approved")).toBeInTheDocument())
  })
})
