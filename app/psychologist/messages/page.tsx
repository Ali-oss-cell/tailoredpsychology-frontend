"use client"

import { PsychologistChatInbox } from "@/components/session/chat/psychologist-chat-inbox"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"

export default function PsychologistMessagesPage() {
  return (
    <PsychologistPortalPage
      title="Messages"
      description="Chat with patients in real time before and during telehealth sessions."
      eyebrow="Communication"
      tutorialId="psychologist.page.messages"
    >
      <PsychologistChatInbox />
    </PsychologistPortalPage>
  )
}
