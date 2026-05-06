import { PatientDataRequestsQueueCard } from "@/components/ops/patient-data-requests-queue-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"

export default function ManagerPrivacyRequestsPage() {
  return (
    <OpsShell activeRoute="manager-privacy-requests">
      <section className="space-y-6">
        <PatientPageHeader
          title="Patient Data Requests"
          description="Review and process patient access/correction requests in queue."
        />
        <PatientDataRequestsQueueCard />
      </section>
    </OpsShell>
  )
}
