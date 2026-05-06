import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { TelehealthInsightsCard } from "@/components/ops/telehealth-insights-card"

jest.mock("@/src/ops/insights/api", () => ({
  getTelehealthInsights: jest.fn(),
}))

import { getTelehealthInsights } from "@/src/ops/insights/api"

const mockedGetTelehealthInsights = getTelehealthInsights as jest.MockedFunction<typeof getTelehealthInsights>

describe("TelehealthInsightsCard", () => {
  it("renders telehealth metrics", async () => {
    mockedGetTelehealthInsights.mockResolvedValue({
      totalJoinAttempts: 10,
      warnedJoinCount: 4,
      warnedJoinRate: 40,
      failedJoinCount: 2,
      lateJoinCount: 3,
      recoveryRate: 50,
      last24h: {
        totalJoinAttempts: 3,
        warnedJoinCount: 1,
        warnedJoinRate: 33,
        failedJoinCount: 1,
        lateJoinCount: 1,
        recoveryRate: 50,
      },
      last7d: {
        totalJoinAttempts: 8,
        warnedJoinCount: 3,
        warnedJoinRate: 38,
        failedJoinCount: 2,
        lateJoinCount: 2,
        recoveryRate: 67,
      },
      clinicianBreakdown: [
        {
          clinicianId: "clinician_001",
          totalJoinAttempts: 5,
          warnedJoinCount: 2,
          warnedJoinRate: 40,
          failedJoinCount: 1,
          recoveryRate: 50,
        },
      ],
    })

    render(<TelehealthInsightsCard />)

    await waitFor(() => expect(screen.getByText("Join attempts: 10")).toBeInTheDocument())
    expect(screen.getByText("Warned joins: 4")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Last 24h" })).toBeInTheDocument()
    expect(screen.getByText("Clinician breakdown")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Last 24h" }))
    expect(screen.getByText("Join attempts: 3")).toBeInTheDocument()
    expect(screen.getByText("Warned joins: 1")).toBeInTheDocument()
  })
})
