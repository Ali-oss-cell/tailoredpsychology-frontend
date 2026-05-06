import { PatientAccountSettings } from "@/components/patient/account/patient-account-settings"
import { PatientShell } from "@/components/patient/patient-shell"
import { patientAccountContent } from "@/content/patient-account"

export default function PatientAccountPage() {
  return (
    <PatientShell activeRoute="account">
      <PatientAccountSettings
        headerTitle={patientAccountContent.header.title}
        headerDescription={patientAccountContent.header.description}
        securityNotes={patientAccountContent.security}
      />
    </PatientShell>
  )
}
