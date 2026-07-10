"use client"

import { useQuery } from "@tanstack/react-query"

import { listNotifications } from "@/src/notifications/api"
import { patientQueryStaleTime } from "@/src/patient/queries/keys"

export function useNotificationUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const items = await listNotifications()
      return items.filter((item) => !item.readAt).length
    },
    staleTime: patientQueryStaleTime.dashboard,
  })
}
