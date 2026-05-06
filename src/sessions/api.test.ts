import { getPatientSessions, getPsychologistSessions, getSessionDetail } from "@/src/sessions/api"

jest.mock("@/src/patient/booking/api", () => ({
  ensureBackendAccessToken: jest.fn(),
}))

import { ensureBackendAccessToken } from "@/src/patient/booking/api"

const mockedEnsureBackendAccessToken = ensureBackendAccessToken as jest.MockedFunction<typeof ensureBackendAccessToken>

describe("sessions api", () => {
  beforeEach(() => {
    mockedEnsureBackendAccessToken.mockResolvedValue("token_123")
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([]),
    } as Response)
  })

  it("calls patient sessions endpoint", async () => {
    await getPatientSessions("user_patient_001")
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/patients/user_patient_001/sessions",
      expect.objectContaining({ method: "GET" }),
    )
  })

  it("calls psychologist sessions endpoint", async () => {
    await getPsychologistSessions("user_psychologist_001")
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/psychologists/user_psychologist_001/sessions",
      expect.objectContaining({ method: "GET" }),
    )
  })

  it("calls session detail endpoint", async () => {
    await getSessionDetail("appt_open_001")
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/sessions/appt_open_001",
      expect.objectContaining({ method: "GET" }),
    )
  })
})
