"use client"

import Link from "next/link"
import { ChalkboardTeacher } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/src/auth/current-user"
import { joinSessionHref } from "@/src/session/join-session"
import { getPsychologistWorkspace } from "@/src/psychologist/workspace/api"

export function PsychologistJoinNextSession() {
  const [href, setHref] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function run() {
      try {
        const user = await getCurrentUser()
        if (user.role !== "psychologist") {
          setHref(null)
          return
        }
        const workspace = await getPsychologistWorkspace(user.id, { sortBy: "startsAt", sortOrder: "asc" })
        const now = Date.now()
        const next = workspace.items.find((item) => new Date(item.startsAt).getTime() > now)
        setHref(next ? joinSessionHref(next.appointmentId) : null)
      } catch {
        setHref(null)
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [])

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
