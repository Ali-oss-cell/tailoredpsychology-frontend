import { PatientInvoicesSection } from "@/components/patient/billing/patient-invoices-section"
import { patientInvoicesContent } from "@/content/patient-invoices"

export default function PatientInvoicesPage() {
  return (
    <PatientInvoicesSection
      title={patientInvoicesContent.header.title}
      description={patientInvoicesContent.header.description}
    />
  )
}
