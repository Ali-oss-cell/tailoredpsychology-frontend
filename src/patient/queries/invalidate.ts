import type { QueryClient } from "@tanstack/react-query"

import { patientQueryKeys } from "@/src/patient/queries/keys"

export function invalidatePatientAppointments(queryClient: QueryClient): Promise<void> {
  // Appointment mutations must also refresh the consolidated dashboard snapshot.
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: patientQueryKeys.appointmentsRoot }),
    queryClient.invalidateQueries({ queryKey: patientQueryKeys.dashboard }),
  ]).then(() => undefined)
}

export function invalidatePatientInvoices(queryClient: QueryClient): Promise<void> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: patientQueryKeys.invoices }),
    queryClient.invalidateQueries({ queryKey: patientQueryKeys.dashboard }),
  ]).then(() => undefined)
}

export function invalidatePatientDashboard(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: patientQueryKeys.dashboard })
}

export function invalidatePatientBookingConfirmation(queryClient: QueryClient): Promise<void> {
  return Promise.all([
    invalidatePatientDashboard(queryClient),
    queryClient.invalidateQueries({ queryKey: patientQueryKeys.journey }),
    invalidatePatientAppointments(queryClient),
    invalidatePatientInvoices(queryClient),
  ]).then(() => undefined)
}

export function invalidateCurrentUser(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: patientQueryKeys.currentUser })
}
