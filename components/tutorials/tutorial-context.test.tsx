/** @jest-environment jsdom */

import * as React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))
jest.mock("@/src/tutorials/flags", () => ({
  tutorialsEnabled: jest.fn(),
}))
jest.mock("@/components/tutorials/tour-runner", () => ({
  TourRunner: () => null,
}))

import { usePathname } from "next/navigation"

import { TutorialProvider, useTutorial } from "@/components/tutorials/tutorial-context"
import { PATIENT_WELCOME_STREAM_ID } from "@/content/tutorials/registry"
import { tutorialsEnabled } from "@/src/tutorials/flags"

describe("TutorialProvider welcome gate", () => {
  const usePathnameMock = usePathname as jest.MockedFunction<typeof usePathname>
  const tutorialsEnabledMock = tutorialsEnabled as jest.MockedFunction<typeof tutorialsEnabled>

  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    usePathnameMock.mockReturnValue("/patient/dashboard")
    jest.useFakeTimers({ advanceTimers: true })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("does not open welcome when tutorials flag is off", () => {
    tutorialsEnabledMock.mockReturnValue(false)
    render(
      <TutorialProvider>
        <span>Page</span>
      </TutorialProvider>,
    )
    act(() => {
      jest.advanceTimersByTime(600)
    })
    expect(screen.queryByTestId("tutorial-welcome-overlay")).not.toBeInTheDocument()
  })

  it("opens welcome on patient dashboard when flag on and stream is offered", async () => {
    tutorialsEnabledMock.mockReturnValue(true)
    render(
      <TutorialProvider>
        <span>Page</span>
      </TutorialProvider>,
    )
    act(() => {
      jest.advanceTimersByTime(600)
    })
    await waitFor(() => {
      expect(screen.getByTestId("tutorial-welcome-overlay")).toBeInTheDocument()
    })
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("opens welcome on patient onboarding (post-registration landing)", async () => {
    tutorialsEnabledMock.mockReturnValue(true)
    usePathnameMock.mockReturnValue("/patient/onboarding")
    render(
      <TutorialProvider>
        <span>Onboarding</span>
      </TutorialProvider>,
    )
    act(() => {
      jest.advanceTimersByTime(600)
    })
    await waitFor(() => {
      expect(screen.getByTestId("tutorial-welcome-overlay")).toBeInTheDocument()
    })
  })

  it("does not open welcome when a tour is already active (single overlay)", () => {
    tutorialsEnabledMock.mockReturnValue(true)
    function StartTourOnMount() {
      const t = useTutorial()
      React.useEffect(() => {
        t?.startTour(PATIENT_WELCOME_STREAM_ID)
      }, [t])
      return null
    }
    render(
      <TutorialProvider>
        <StartTourOnMount />
      </TutorialProvider>,
    )
    act(() => {
      jest.advanceTimersByTime(600)
    })
    expect(screen.queryByTestId("tutorial-welcome-overlay")).not.toBeInTheDocument()
  })

  it("does not open welcome on other patient routes (e.g. appointments)", () => {
    tutorialsEnabledMock.mockReturnValue(true)
    usePathnameMock.mockReturnValue("/patient/appointments")
    render(
      <TutorialProvider>
        <span>Page</span>
      </TutorialProvider>,
    )
    act(() => {
      jest.advanceTimersByTime(600)
    })
    expect(screen.queryByTestId("tutorial-welcome-overlay")).not.toBeInTheDocument()
  })
})
