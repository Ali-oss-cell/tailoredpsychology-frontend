import { PatientVideoSetupCard } from "@/components/patient/patient-video-setup-card"
import { PatientShell } from "@/components/patient/patient-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"

export default function PatientVideoSetupPage() {
  return (
    <PatientShell activeRoute="dashboard">
      <section className="space-y-6" data-tutorial="patient.page.video-setup">
        <PatientPageHeader
          title="Test your video setup"
          description="Use this page before a telehealth visit to confirm your browser can reach your camera and microphone. This does not start a session with your clinician."
        />
        <PatientVideoSetupCard />
      </section>
    </PatientShell>
  )
}
