/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react"

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/patient/onboarding",
}))

import { PatientTutorialBoundary } from "@/components/tutorials/patient-tutorial-boundary"

describe("PatientTutorialBoundary", () => {
  const prev = process.env.NEXT_PUBLIC_TUTORIALS

  afterEach(() => {
    process.env.NEXT_PUBLIC_TUTORIALS = prev
  })

  it("renders children only when tutorials flag is off", () => {
    process.env.NEXT_PUBLIC_TUTORIALS = "0"
    render(
      <PatientTutorialBoundary>
        <span>Child</span>
      </PatientTutorialBoundary>,
    )
    expect(screen.getByText("Child")).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("wraps with tutorial provider when flag is on (welcome may appear on dashboard only)", () => {
    process.env.NEXT_PUBLIC_TUTORIALS = "1"
    render(
      <PatientTutorialBoundary>
        <span>Child</span>
      </PatientTutorialBoundary>,
    )
    expect(screen.getByText("Child")).toBeInTheDocument()
  })
})
