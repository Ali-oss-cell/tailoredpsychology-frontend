export type MedicareGapExample = {
  label: string
  sessionFeeAud: number
  medicareRebateAud: number
  estimatedGapAud: number
  assumptions: string
}

export type PricingItem = {
  service: string
  durationMins: number
  feeAud: number
  notes: string
}

export const publicPricing = {
  updatedAt: "2026-05-02",
  assumptions:
    "Examples are indicative only and may vary by clinician type, referral eligibility, and Medicare policy updates.",
  medicareDisclaimer:
    "Medicare rebates generally require a valid Mental Health Treatment Plan and referral pathway when applicable.",
  items: [
    {
      service: "Initial psychologist consultation",
      durationMins: 50,
      feeAud: 220,
      notes: "Best for first-time intake and care planning.",
    },
    {
      service: "Standard follow-up consultation",
      durationMins: 50,
      feeAud: 200,
      notes: "Ongoing treatment and review.",
    },
    {
      service: "Extended review consultation",
      durationMins: 80,
      feeAud: 295,
      notes: "For complex review, safety planning, or coordinated care discussions.",
    },
  ] satisfies PricingItem[],
  gapExamples: [
    {
      label: "General psychologist with eligible Medicare rebate",
      sessionFeeAud: 200,
      medicareRebateAud: 96.65,
      estimatedGapAud: 103.35,
      assumptions: "Illustrative only; actual rebate depends on clinician and referral criteria.",
    },
    {
      label: "Clinical psychologist with eligible Medicare rebate",
      sessionFeeAud: 220,
      medicareRebateAud: 141.85,
      estimatedGapAud: 78.15,
      assumptions: "Illustrative only; eligibility and rebate values can change.",
    },
    {
      label: "No eligible rebate pathway",
      sessionFeeAud: 200,
      medicareRebateAud: 0,
      estimatedGapAud: 200,
      assumptions: "Private-pay scenario without rebate eligibility.",
    },
  ] satisfies MedicareGapExample[],
}
