import { PatientAccountSettings } from "@/components/patient/account/patient-account-settings"
import { patientAccountContent } from "@/content/patient-account"

export default function PatientAccountPage() {
  return (
    <PatientAccountSettings
      headerTitle={patientAccountContent.header.title}
      headerDescription={patientAccountContent.header.description}
      securityNotes={patientAccountContent.security}
    />
  )
}
