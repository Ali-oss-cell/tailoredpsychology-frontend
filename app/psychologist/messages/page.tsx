"use client"

import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { PsychologistChatInbox } from "@/components/session/chat/psychologist-chat-inbox"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"

export default function PsychologistMessagesPage() {
  return (
    <PsychologistShell activeRoute="messages">
      <div className="space-y-4">
        <PatientPageHeader
          title="Messages"
          description="Chat with patients in real time before and during telehealth sessions."
        />
        <PsychologistChatInbox />
      </div>
    </PsychologistShell>
  )
}
