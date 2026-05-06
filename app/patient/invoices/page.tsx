import { PatientInvoicesSection } from "@/components/patient/billing/patient-invoices-section"
import { PatientShell } from "@/components/patient/patient-shell"
import { patientInvoicesContent } from "@/content/patient-invoices"

export default function PatientInvoicesPage() {
  return (
    <PatientShell activeRoute="invoices">
      <PatientInvoicesSection
        title={patientInvoicesContent.header.title}
        description={patientInvoicesContent.header.description}
      />
    </PatientShell>
  )
}
