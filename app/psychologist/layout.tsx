import type * as React from "react"

import { PsychologistShellLayout } from "@/components/psychologist/psychologist-shell-layout"

export default function PsychologistLayout({ children }: { children: React.ReactNode }) {
  return <PsychologistShellLayout>{children}</PsychologistShellLayout>
}
