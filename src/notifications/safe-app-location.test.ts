import { getNotificationOpenHref, parseSafeAppLocation } from "./safe-app-location"

describe("parseSafeAppLocation", () => {
  it("accepts plain internal paths", () => {
    expect(parseSafeAppLocation("/patient/onboarding")).toEqual({ href: "/patient/onboarding" })
  })

  it("accepts openNotifications=1 only", () => {
    expect(parseSafeAppLocation("/patient/dashboard?openNotifications=1")).toEqual({
      href: "/patient/dashboard?openNotifications=1",
    })
  })

  it("rejects unknown query keys", () => {
    expect(parseSafeAppLocation("/patient/dashboard?openNotifications=1&x=1")).toBeNull()
  })

  it("rejects external URLs", () => {
    expect(parseSafeAppLocation("//evil.com")).toBeNull()
  })
})

describe("getNotificationOpenHref", () => {
  it("prefers ctaPath over deepLink", () => {
    expect(
      getNotificationOpenHref({
        ctaPath: "/patient/appointments",
        deepLink: "/video-session/appt_1",
      }),
    ).toBe("/patient/appointments")
  })

  it("falls back to deepLink when ctaPath missing", () => {
    expect(getNotificationOpenHref({ deepLink: "/video-session/appt_2" })).toBe("/video-session/appt_2")
  })

  it("returns null when neither link is safe", () => {
    expect(getNotificationOpenHref({ deepLink: "https://evil.test" })).toBeNull()
  })
})
