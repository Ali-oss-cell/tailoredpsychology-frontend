"use client"

import { useQuery } from "@tanstack/react-query"

import { listPatientInvoices } from "@/src/patient/billing/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"

export function usePatientInvoices() {
  const patientId = usePatientId()

  return useQuery({
    queryKey: patientQueryKeys.invoices,
    queryFn: listPatientInvoices,
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.invoices,
  })
}
