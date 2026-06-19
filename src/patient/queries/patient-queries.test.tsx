import { renderHook, waitFor } from "@testing-library/react"

import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments } from "@/src/patient/booking/api"
import { listPatientInvoices } from "@/src/patient/billing/api"
import { createTestQueryClient } from "@/src/patient/queries/test-utils"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"
import { usePatientAppointments } from "@/src/patient/queries/use-patient-appointments"
import { usePatientInvoices } from "@/src/patient/queries/use-patient-invoices"
import { QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock("@/src/patient/booking/api", () => ({
  getPatientAppointments: jest.fn(),
}))

jest.mock("@/src/patient/billing/api", () => ({
  listPatientInvoices: jest.fn(),
}))

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetPatientAppointments = getPatientAppointments as jest.MockedFunction<typeof getPatientAppointments>
const mockedListPatientInvoices = listPatientInvoices as jest.MockedFunction<typeof listPatientInvoices>

function wrapper({ children }: { children: React.ReactNode }) {
  const client = createTestQueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe("patient query hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_patient_001",
      email: "patient@clink.test",
      displayName: "Patient",
      role: "patient",
      accountSetupComplete: true,
    })
    mockedGetPatientAppointments.mockResolvedValue({ upcoming: [], past: [] })
    mockedListPatientInvoices.mockResolvedValue([])
  })

  it("deduplicates current user across dependent hooks", async () => {
    const { result } = renderHook(
      () => ({
        user: useCurrentUser(),
        appointments: usePatientAppointments(),
        invoices: usePatientInvoices(),
      }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.user.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.appointments.isSuccess).toBe(true))
    await waitFor(() => expect(result.current.invoices.isSuccess).toBe(true))

    expect(mockedGetCurrentUser).toHaveBeenCalledTimes(1)
  })
})
