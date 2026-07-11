import { fireEvent, render, screen } from "@testing-library/react"

import { QuickActionsCard } from "@/components/patient/dashboard/quick-actions-card"

describe("QuickActionsCard", () => {
  const actions = [
    { title: "Message clinic", icon: "message" as const },
    { title: "Test camera & mic", icon: "video" as const },
  ]

  it("wires quick navigation link for video setup", () => {
    render(<QuickActionsCard actions={actions} />)

    expect(screen.getByRole("link", { name: /test camera & mic/i })).toHaveAttribute(
      "href",
      "/patient/video-setup",
    )
  })

  it("dispatches open-chat event for message action", () => {
    const eventSpy = jest.fn()
    window.addEventListener("clink:open-chat", eventSpy)

    render(<QuickActionsCard actions={actions} />)
    fireEvent.click(screen.getByRole("button", { name: /message clinic/i }))

    expect(eventSpy).toHaveBeenCalledTimes(1)
    window.removeEventListener("clink:open-chat", eventSpy)
  })

  it("renders nothing when actions are empty", () => {
    const { container } = render(<QuickActionsCard actions={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
