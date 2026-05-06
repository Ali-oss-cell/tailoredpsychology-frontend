import { PatientOnboardingChecklist } from "@/components/patient/onboarding/patient-onboarding-checklist"
import { PatientShell } from "@/components/patient/patient-shell"

export default function PatientOnboardingPage() {
  return (
    <PatientShell activeRoute="onboarding">
      <div data-tutorial="patient.page.onboarding">
        <PatientOnboardingChecklist />
      </div>
    </PatientShell>
  )
}
