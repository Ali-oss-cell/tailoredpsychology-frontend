export type TrustMetric = {
  label: string
  value: string
  /** One-line context under the headline value. */
  caption?: string
  source: string
  updatedAt: string
}

export const publicTrustMetrics: TrustMetric[] = [
  {
    label: "Telehealth sessions delivered",
    value: "30,000+",
    caption: "Cumulative secure sessions across the platform footprint.",
    source: "Internal service operations reporting",
    updatedAt: "2026-05-02",
  },
  {
    label: "Clinicians AHPRA registered",
    value: "100%",
    caption: "Registration checked at onboarding; ongoing credentialing discipline.",
    source: "Credentialing and onboarding controls",
    updatedAt: "2026-05-02",
  },
  {
    label: "Median first-response SLA",
    value: "< 1 business day",
    caption: "Non-clinical triage and intake enquiries; excludes public holidays.",
    source: "Ops triage and intake queue telemetry",
    updatedAt: "2026-05-02",
  },
  {
    label: "Governance controls coverage",
    value: "Consent, legal hold, access audit, incident workflow",
    caption: "Controls span privacy-critical workflows, not only policy text.",
    source: "Compliance and security governance implementation",
    updatedAt: "2026-05-02",
  },
]

export const privacyControls = [
  "Versioned consent lifecycle with withdrawal records.",
  "Legal hold and retention-state enforcement in export/deletion/video access flows.",
  "Owner/assignment guards for patient, clinician, manager, and admin boundaries.",
  "Auditable access and workflow events across privacy-critical actions.",
  "Security incident register and notification-readiness workflow foundation.",
]
