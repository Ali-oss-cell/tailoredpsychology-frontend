import { PatientVideoSetupCard } from "@/components/patient/patient-video-setup-card"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"

export default function PatientVideoSetupPage() {
  return (
    <PatientPortalPage
      title="Test your video setup"
      description="Use this page before a telehealth visit to confirm your browser can reach your camera and microphone. This does not start a session with your clinician."
      eyebrow="Before your session"
      showJourney
      tutorialId="patient.page.video-setup"
    >
      <PatientVideoSetupCard />
    </PatientPortalPage>
  )
}
