import { cookies } from "next/headers"

import { VideoSessionWorkspace } from "@/components/session/video-session-workspace"
import { parseRole } from "@/src/auth/session"

type VideoSessionPageProps = {
  params: Promise<{ appointmentId: string }>
}

export default async function VideoSessionPage({ params }: VideoSessionPageProps) {
  const { appointmentId } = await params
  const cookieStore = await cookies()
  const role = parseRole(cookieStore.get("clink_role")?.value)
  const workspaceRole =
    role === "patient" || role === "psychologist" || role === "practice_manager" || role === "admin" ? role : null

  return (
    <div className="bg-dashboard text-foreground flex min-h-screen flex-col">
      <VideoSessionWorkspace appointmentId={appointmentId} role={workspaceRole} />
    </div>
  )
}
