"use client"

import * as React from "react"

import { PortalHeaderScrollFx } from "@/components/shared/portal-header-scroll-fx"

export function PatientHeaderScrollFx() {
  return <PortalHeaderScrollFx headerSelector="[data-patient-header]" />
}
