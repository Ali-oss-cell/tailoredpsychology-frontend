import {
  TUTORIAL_CONTENT_VERSION,
  ensureTutorialVersionMigrated,
  isStreamCompleted,
  markStreamCompleted,
  replayStream,
  shouldOfferStream,
  snoozeStream,
} from "@/src/tutorials/storage"

const VERSION_KEY = "clink_tutorial_version"
const COMPLETED_KEY = "clink_tutorial_completed"
const SNOOZED_KEY = "clink_tutorial_snoozed_v1"

describe("tutorial storage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("marks stream completed and shouldOfferStream returns false", () => {
    expect(shouldOfferStream("patient.welcome")).toBe(true)
    markStreamCompleted("patient.welcome")
    expect(isStreamCompleted("patient.welcome")).toBe(true)
    expect(shouldOfferStream("patient.welcome")).toBe(false)
  })

  it("snooze blocks offer until window passes", () => {
    snoozeStream("patient.welcome", 1)
    expect(shouldOfferStream("patient.welcome")).toBe(false)
    const raw = window.localStorage.getItem(SNOOZED_KEY)
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!) as Record<string, string>
    const until = new Date(parsed["patient.welcome"])
    until.setTime(until.getTime() - 2 * 86_400_000)
    parsed["patient.welcome"] = until.toISOString()
    window.localStorage.setItem(SNOOZED_KEY, JSON.stringify(parsed))
    expect(shouldOfferStream("patient.welcome")).toBe(true)
  })

  it("replay removes completion", () => {
    markStreamCompleted("patient.welcome")
    replayStream("patient.welcome")
    expect(isStreamCompleted("patient.welcome")).toBe(false)
  })

  it("ensureTutorialVersionMigrated resets when version mismatches", () => {
    window.localStorage.setItem(VERSION_KEY, "0")
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(["patient.welcome"]))
    ensureTutorialVersionMigrated()
    expect(window.localStorage.getItem(VERSION_KEY)).toBe(TUTORIAL_CONTENT_VERSION)
    expect(JSON.parse(window.localStorage.getItem(COMPLETED_KEY) || "[]")).toEqual([])
  })
})
