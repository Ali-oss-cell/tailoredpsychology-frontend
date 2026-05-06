import { cookies } from "next/headers"

import { PatientShell } from "@/components/patient/patient-shell"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
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

  const content = <VideoSessionWorkspace appointmentId={appointmentId} role={workspaceRole} />

  if (role === "patient") {
    return <PatientShell activeRoute="appointments">{content}</PatientShell>
  }

  if (role === "psychologist") {
    return <PsychologistShell activeRoute="schedule">{content}</PsychologistShell>
  }

  return <main className="mx-auto max-w-4xl p-6">{content}</main>
}
