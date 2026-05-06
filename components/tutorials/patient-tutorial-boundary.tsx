"use client"

import type * as React from "react"

import { TutorialProvider } from "@/components/tutorials/tutorial-context"
import { tutorialsEnabled } from "@/src/tutorials/flags"

export function PatientTutorialBoundary({ children }: { children: React.ReactNode }) {
  if (!tutorialsEnabled()) {
    return <>{children}</>
  }
  return <TutorialProvider>{children}</TutorialProvider>
}
