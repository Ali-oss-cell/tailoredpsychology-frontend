import { APP_ROUTES } from "./route-config"

describe("route config referrals access", () => {
  it("includes manager referrals route with referrals.verify permission", () => {
    const route = APP_ROUTES.find((item) => item.path === "/manager/referrals")

    expect(route).toBeDefined()
    expect(route?.allowedRoles).toEqual(["practice_manager", "admin"])
    expect(route?.requiredPermissions).toEqual(["referrals.verify"])
    expect(route?.navGroup).toBe("management")
  })
})

describe("route config privacy requests access", () => {
  it("includes patient my-clinician (care team) route", () => {
    const route = APP_ROUTES.find((item) => item.path === "/patient/my-clinician")
    expect(route).toBeDefined()
    expect(route?.shell).toBe("patient")
    expect(route?.allowedRoles).toEqual(["patient"])
    expect(route?.requiredPermissions).toEqual(["patient.portal.read"])
  })

  it("includes patient data requests route", () => {
    const route = APP_ROUTES.find((item) => item.path === "/patient/data-requests")
    expect(route).toBeDefined()
    expect(route?.allowedRoles).toEqual(["patient"])
    expect(route?.requiredPermissions).toEqual(["patient.portal.read"])
  })

  it("includes admin privacy requests route", () => {
    const route = APP_ROUTES.find((item) => item.path === "/admin/privacy-requests")
    expect(route).toBeDefined()
    expect(route?.allowedRoles).toEqual(["practice_manager", "admin"])
    expect(route?.requiredPermissions).toEqual(["privacy.requests.manage"])
  })

  it("includes admin security incidents route with admin-only access", () => {
    const route = APP_ROUTES.find((item) => item.path === "/admin/security-incidents")
    expect(route).toBeDefined()
    expect(route?.allowedRoles).toEqual(["admin"])
    expect(route?.requiredPermissions).toEqual(["admin.portal.read"])
  })
})

describe("route config public growth routes", () => {
  it("includes why-clink, pricing, trust, and condition routes for guests", () => {
    for (const path of ["/why-clink", "/pricing", "/trust", "/conditions", "/conditions/:slug"]) {
      const route = APP_ROUTES.find((item) => item.path === path)
      expect(route).toBeDefined()
      expect(route?.shell).toBe("public")
      expect(route?.allowGuests).toBe(true)
      expect(route?.requiredPermissions).toEqual(["marketing.read"])
    }
  })

  it("includes privacy-policy route for guests", () => {
    const route = APP_ROUTES.find((item) => item.path === "/privacy-policy")
    expect(route).toBeDefined()
    expect(route?.component).toBe("PrivacyPolicyPage")
    expect(route?.shell).toBe("public")
    expect(route?.allowGuests).toBe(true)
    expect(route?.requiredPermissions).toEqual(["marketing.read"])
  })

  it("includes terms-of-service route for guests", () => {
    const route = APP_ROUTES.find((item) => item.path === "/terms-of-service")
    expect(route).toBeDefined()
    expect(route?.component).toBe("TermsOfServicePage")
    expect(route?.shell).toBe("public")
    expect(route?.allowGuests).toBe(true)
    expect(route?.requiredPermissions).toEqual(["marketing.read"])
  })
})

describe("route config psychologist routes", () => {
  it("includes all psychologist tab routes as protected psychologist pages", () => {
    for (const path of [
      "/psychologist/dashboard",
      "/psychologist/schedule",
      "/psychologist/patients",
      "/psychologist/patients/:patientId",
      "/psychologist/notes",
      "/psychologist/profile",
      "/psychologist/recordings",
    ]) {
      const route = APP_ROUTES.find((item) => item.path === path)
      expect(route).toBeDefined()
      expect(route?.shell).toBe("psychologist")
      expect(route?.allowGuests).toBe(false)
      expect(route?.allowedRoles).toEqual(["psychologist"])
      if (path === "/psychologist/recordings") {
        expect(route?.requiredPermissions).toEqual(["recordings.read"])
      } else {
        expect(route?.requiredPermissions).toEqual(["psychologist.portal.read"])
      }
    }
  })
})
