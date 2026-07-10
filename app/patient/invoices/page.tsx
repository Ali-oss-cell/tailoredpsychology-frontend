import { PatientInvoicesSection } from "@/components/patient/billing/patient-invoices-section"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { patientInvoicesContent } from "@/content/patient-invoices"

export default function PatientInvoicesPage() {
  return (
    <PatientPortalPage
      title={patientInvoicesContent.header.title}
      description={patientInvoicesContent.header.description}
      eyebrow="Billing"
      tutorialId="patient.page.invoices"
    >
      <PatientInvoicesSection />
    </PatientPortalPage>
  )
}
