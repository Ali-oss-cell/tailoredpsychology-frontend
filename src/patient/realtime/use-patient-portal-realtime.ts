"use client"

import { useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import { patientQueryKeys } from "@/src/patient/queries/keys"
import {
  invalidatePatientBookingConfirmation,
  invalidatePatientDashboard,
  invalidatePatientInvoices,
} from "@/src/patient/queries/invalidate"
import { PortalSocketClient, type PortalInvalidateScope } from "@/src/patient/realtime/portal-socket"
import { usePatientId } from "@/src/patient/queries/use-current-user"

/**
 * Keeps dashboard + journey queries fresh via the /portal socket namespace.
 * Falls back to a 60s refetch interval when disconnected.
 */
export function usePatientPortalRealtime(): void {
  const queryClient = useQueryClient()
  const patientId = usePatientId()
  const clientRef = React.useRef<PortalSocketClient | null>(null)

  const invalidateForScope = React.useCallback(
    (scope: PortalInvalidateScope) => {
      if (scope === "billing") {
        void invalidatePatientInvoices(queryClient)
        return
      }
      if (scope === "journey") {
        void queryClient.invalidateQueries({ queryKey: patientQueryKeys.journey })
        return
      }
      void invalidatePatientBookingConfirmation(queryClient)
    },
    [queryClient],
  )

  React.useEffect(() => {
    if (!patientId) return

    const client = new PortalSocketClient()
    clientRef.current = client

    let pollTimer: number | null = null

    const startPolling = () => {
      if (pollTimer !== null) return
      pollTimer = window.setInterval(() => {
        void invalidatePatientDashboard(queryClient)
      }, 60_000)
    }

    const stopPolling = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer)
        pollTimer = null
      }
    }

    void client
      .connect({
        onDashboardInvalidate: invalidateForScope,
        onAppointmentUpdated: () => invalidateForScope("all"),
      })
      .then(() => stopPolling())
      .catch(() => startPolling())

    return () => {
      stopPolling()
      client.disconnect()
      clientRef.current = null
    }
  }, [patientId, queryClient, invalidateForScope])
}
