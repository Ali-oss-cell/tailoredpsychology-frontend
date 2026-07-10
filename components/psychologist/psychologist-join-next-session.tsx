"use client"

import Link from "next/link"
import { ChalkboardTeacher } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
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

  if (href) {
    return (
      <Button asChild variant="outline" className="w-full justify-start gap-2">
        <Link href={href}>
          <ChalkboardTeacher size={16} />
          <span className="group-data-[state=collapsed]/sidebar:hidden">Join Next Session</span>
        </Link>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2"
      disabled={loading || !href}
      title={loading ? "Loading sessions…" : "No upcoming session in your workspace"}
      type="button"
    >
      <ChalkboardTeacher size={16} />
      <span className="group-data-[state=collapsed]/sidebar:hidden">Join Next Session</span>
    </Button>
  )
}
