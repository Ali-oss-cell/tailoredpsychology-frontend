import { PatientDataRequestsQueueCard } from "@/components/ops/patient-data-requests-queue-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"

export default function AdminPrivacyRequestsPage() {
  return (
    <OpsShell activeRoute="admin-privacy-requests">
      <section className="space-y-6">
        <PatientPageHeader
          title="Patient Data Requests"
          description="Triage patient access and correction requests with SLA-aware workflow."
        />
        <PatientDataRequestsQueueCard />
      </section>
    </OpsShell>
  )
}
