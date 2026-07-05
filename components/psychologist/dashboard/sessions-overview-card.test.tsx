import { render, screen } from "@testing-library/react"

import { SessionsOverviewCard } from "@/components/psychologist/dashboard/sessions-overview-card"

describe("SessionsOverviewCard", () => {
  it("renders psychologist session metrics from dashboard snapshot", () => {
    render(
      <SessionsOverviewCard
        stats={{
          totalCount: 2,
          todayCount: 1,
          upcomingCount: 1,
          completedCount: 1,
        }}
      />,
    )

    expect(screen.getByText("Total sessions")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("Today")).toBeInTheDocument()
    expect(screen.getByText("Upcoming")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
  })
})
