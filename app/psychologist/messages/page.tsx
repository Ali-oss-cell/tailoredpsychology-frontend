"use client"

import { PsychologistChatInbox } from "@/components/session/chat/psychologist-chat-inbox"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"

export default function PsychologistMessagesPage() {
  return (
    <PsychologistShell activeRoute="messages">
      <PsychologistPortalPage
        title="Messages"
        description="Chat with patients in real time before and during telehealth sessions."
        eyebrow="Communication"
        tutorialId="psychologist.page.messages"
      >
        <PsychologistChatInbox />
      </PsychologistPortalPage>
    </PsychologistShell>
  )
}
