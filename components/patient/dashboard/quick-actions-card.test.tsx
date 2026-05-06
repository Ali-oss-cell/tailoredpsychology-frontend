import { fireEvent, render, screen } from "@testing-library/react"

import { QuickActionsCard } from "@/components/patient/dashboard/quick-actions-card"

describe("QuickActionsCard", () => {
  const actions = [
    { title: "Book New Session", subtitle: "Schedule an appointment", icon: "book" as const },
    { title: "Message Clinic", subtitle: "Secure communication", icon: "message" as const },
    { title: "View Invoices", subtitle: "Latest billing info", icon: "invoice" as const },
  ]

  it("wires quick navigation links for booking and invoices", () => {
    render(<QuickActionsCard actions={actions} />)

    expect(screen.getByRole("link", { name: /book new session/i })).toHaveAttribute(
      "href",
      "/patient/book-appointment",
    )
    expect(screen.getByRole("link", { name: /view invoices/i })).toHaveAttribute("href", "/patient/invoices")
  })

  it("dispatches open-chat event for message action", () => {
    const eventSpy = jest.fn()
    window.addEventListener("clink:open-chat", eventSpy)

    render(<QuickActionsCard actions={actions} />)
    fireEvent.click(screen.getByRole("button", { name: /message clinic/i }))

    expect(eventSpy).toHaveBeenCalledTimes(1)
    window.removeEventListener("clink:open-chat", eventSpy)
  })
})
