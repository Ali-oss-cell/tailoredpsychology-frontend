import type { QueryClient } from "@tanstack/react-query"

import { patientQueryKeys } from "@/src/patient/queries/keys"

export function invalidatePatientAppointments(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: patientQueryKeys.appointmentsRoot })
}

export function invalidatePatientInvoices(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: patientQueryKeys.invoices })
}

export function invalidateCurrentUser(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: patientQueryKeys.currentUser })
}
