import type * as React from "react"

import { PatientShellLayout } from "@/components/patient/patient-shell-layout"
import { PatientTutorialBoundary } from "@/components/tutorials/patient-tutorial-boundary"

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PatientTutorialBoundary>
      <PatientShellLayout>{children}</PatientShellLayout>
    </PatientTutorialBoundary>
  )
}
