"use client"

import Link from "next/link"
import { ChalkboardTeacher } from "@phosphor-icons/react/dist/ssr"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { usePsychologistCurrentUser } from "@/src/psychologist/queries/use-current-user"
import { usePsychologistWorkspace } from "@/src/psychologist/queries/use-psychologist-workspace"
import { joinSessionHref } from "@/src/session/join-session"

export function PsychologistJoinNextSession() {
  const userQuery = usePsychologistCurrentUser()
  const psychologistId = userQuery.data?.role === "psychologist" ? userQuery.data.id : undefined
  const workspaceQuery = usePsychologistWorkspace(psychologistId, { sortBy: "startsAt", sortOrder: "asc" })
  const loading = userQuery.isLoading || workspaceQuery.isLoading

  const href = (() => {
    const items = workspaceQuery.data?.items ?? []
    const now = Date.now()
    const next = items.find((item) => new Date(item.startsAt).getTime() > now)
    return next ? joinSessionHref(next.appointmentId) : null
  })()

  if (!href) {
    return null
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href} title="Join next session">
          <ChalkboardTeacher size={18} />
          <span className="group-data-[state=collapsed]/sidebar:sr-only">
            {loading ? "Loading sessions…" : "Join next session"}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
