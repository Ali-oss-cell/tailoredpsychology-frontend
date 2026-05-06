/** @jest-environment jsdom */

import * as React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))
jest.mock("@/src/tutorials/flags", () => ({
  tutorialsEnabled: jest.fn(() => true),
}))
jest.mock("@/components/tutorials/tour-runner", () => ({
  TourRunner: () => null,
}))

import { usePathname } from "next/navigation"

import { PatientTelehealth101Cta } from "@/components/tutorials/patient-telehealth-101-cta"
import { TutorialProvider } from "@/components/tutorials/tutorial-context"
import { PATIENT_TELEHEALTH_101_STREAM_ID, PATIENT_WELCOME_STREAM_ID } from "@/content/tutorials/registry"
import { markStreamCompleted } from "@/src/tutorials/storage"

describe("PatientTelehealth101Cta", () => {
  const usePathnameMock = usePathname as jest.MockedFunction<typeof usePathname>

  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.sessionStorage.setItem("clink_tutorial_suppress_auto_welcome_session", "1")
    markStreamCompleted(PATIENT_WELCOME_STREAM_ID)
    usePathnameMock.mockReturnValue("/patient/dashboard")
  })

  it("renders on dashboard when telehealth stream is offered and hides after starting tour", async () => {
    render(
      <TutorialProvider>
        <PatientTelehealth101Cta />
      </TutorialProvider>,
    )
    await act(async () => {
      await Promise.resolve()
    })
    expect(screen.getByTestId("patient-telehealth-101-cta")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /telehealth tips tour/i }))
    await act(async () => {
      await Promise.resolve()
    })
    expect(screen.queryByTestId("patient-telehealth-101-cta")).not.toBeInTheDocument()
  })

  it("does not render when not on dashboard", async () => {
    usePathnameMock.mockReturnValue("/patient/appointments")
    render(
      <TutorialProvider>
        <PatientTelehealth101Cta />
      </TutorialProvider>,
    )
    await act(async () => {
      await Promise.resolve()
    })
    expect(screen.queryByTestId("patient-telehealth-101-cta")).not.toBeInTheDocument()
  })

  it("does not render when telehealth stream already completed", async () => {
    markStreamCompleted(PATIENT_TELEHEALTH_101_STREAM_ID)
    render(
      <TutorialProvider>
        <PatientTelehealth101Cta />
      </TutorialProvider>,
    )
    await act(async () => {
      await Promise.resolve()
    })
    expect(screen.queryByTestId("patient-telehealth-101-cta")).not.toBeInTheDocument()
  })
})
