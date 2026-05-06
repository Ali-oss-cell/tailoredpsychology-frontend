/** @jest-environment jsdom */

import {
  getTutorialStepsForStream,
  PATIENT_TELEHEALTH_101_LAST_STEP_ID,
  PATIENT_TELEHEALTH_101_STREAM_ID,
  PATIENT_WELCOME_LAST_STEP_ID,
  PATIENT_WELCOME_STREAM_ID,
} from "@/content/tutorials/registry"

describe("tutorial registry", () => {
  it("returns welcome steps for patient.welcome stream", () => {
    const steps = getTutorialStepsForStream(PATIENT_WELCOME_STREAM_ID)
    expect(steps?.length).toBeGreaterThan(0)
    expect(steps?.some((s) => s.id === PATIENT_WELCOME_LAST_STEP_ID)).toBe(true)
  })

  it("returns telehealth 101 steps for patient.telehealth_101 stream", () => {
    const steps = getTutorialStepsForStream(PATIENT_TELEHEALTH_101_STREAM_ID)
    expect(steps?.length).toBe(4)
    expect(steps?.map((s) => s.id)).toContain(PATIENT_TELEHEALTH_101_LAST_STEP_ID)
  })

  it("returns null for unknown stream id", () => {
    expect(getTutorialStepsForStream("unknown.stream")).toBeNull()
  })
})
