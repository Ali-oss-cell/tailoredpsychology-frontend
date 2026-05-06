import { fireEvent, render, screen } from "@testing-library/react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"

describe("DashboardStateBlock", () => {
  it("renders loading variant message", () => {
    render(<DashboardStateBlock variant="loading" message="Loading data..." />)
    expect(screen.getByText("Loading data...")).toBeInTheDocument()
  })

  it("renders empty variant message", () => {
    render(<DashboardStateBlock variant="empty" message="No data yet." />)
    expect(screen.getByText("No data yet.")).toBeInTheDocument()
  })

  it("renders error variant message", () => {
    render(<DashboardStateBlock variant="error" message="We couldn't load this section. Try again." />)
    expect(screen.getByText("We couldn't load this section. Try again.")).toBeInTheDocument()
  })

  it("calls retry handler when retry is clicked", () => {
    const onRetry = jest.fn()
    render(<DashboardStateBlock variant="error" message="Failed" onRetry={onRetry} />)
    fireEvent.click(screen.getByRole("button", { name: "Retry" }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
