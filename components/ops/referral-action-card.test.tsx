import { render, screen, waitFor } from "@testing-library/react"

import { ReferralActionCard } from "@/components/ops/referral-action-card"

jest.mock("@/src/ops/referrals/api", () => ({
  getReferralQueue: jest.fn(),
}))

import { getReferralQueue } from "@/src/ops/referrals/api"

const mockedGetReferralQueue = getReferralQueue as jest.MockedFunction<typeof getReferralQueue>

describe("ReferralActionCard", () => {
  it("renders live referral counts for manager mode", async () => {
    mockedGetReferralQueue.mockResolvedValue([
      {
        documentId: "r1",
        patientId: "p1",
        status: "received",
        fileName: "a.pdf",
        fileSize: 1,
        mimeType: "application/pdf",
        uploadedAt: new Date().toISOString(),
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        overdue: false,
      },
      {
        documentId: "r2",
        patientId: "p2",
        status: "review_needed",
        fileName: "b.pdf",
        fileSize: 1,
        mimeType: "application/pdf",
        uploadedAt: new Date().toISOString(),
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        overdue: false,
      },
      {
        documentId: "r3",
        patientId: "p3",
        status: "approved",
        fileName: "c.pdf",
        fileSize: 1,
        mimeType: "application/pdf",
        uploadedAt: new Date().toISOString(),
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        overdue: false,
      },
    ])

    render(<ReferralActionCard mode="manager" />)

    await waitFor(() => expect(screen.getByText("Pending review: 2")).toBeInTheDocument())
    expect(screen.getByText("Approved: 1")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Open referral queue" })).toHaveAttribute("href", "/manager/referrals")
  })
})
