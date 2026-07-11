import { AppointmentsCareTeamCard } from "@/components/patient/appointments/appointments-care-team-card"
import { CancellationPolicyCard } from "@/components/patient/appointments/cancellation-policy-card"
import { PatientAppointmentsSection } from "@/components/patient/appointments/patient-appointments-section"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { patientAppointmentsContent } from "@/content/patient-appointments"

export default function PatientAppointmentsPage() {
  return (
    <PatientPortalPage
      title={patientAppointmentsContent.header.title}
      description={patientAppointmentsContent.header.description}
      eyebrow="Your care"
      tutorialId="patient.page.appointments"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <PatientAppointmentsSection />
        </div>
        <div className="space-y-6 lg:sticky lg:top-24">
          <AppointmentsCareTeamCard />
          <CancellationPolicyCard />
        </div>
      </div>
    </PatientPortalPage>
  )
}
