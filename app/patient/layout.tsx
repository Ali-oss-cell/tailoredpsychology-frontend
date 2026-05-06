import type * as React from "react"

import { PatientTutorialBoundary } from "@/components/tutorials/patient-tutorial-boundary"

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PatientTutorialBoundary>{children}</PatientTutorialBoundary>
}
