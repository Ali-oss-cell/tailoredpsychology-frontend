import type { PublicCtaBlock } from "@/content/pages/types"

export type WhyClinkComparison = {
  heading: string
  clink: string
  standard: string
}

export const whyClinkHero = {
  eyebrow: "Why Clink",
  title: "Why Clink vs standard telehealth clinics",
  description:
    "Clink is designed for clinical governance, privacy controls, and continuity of care from intake to ongoing treatment—not only appointment booking.",
  kicker:
    "Use this page as a category-level guide. Individual clinics vary; confirm specifics with any provider you consider.",
  actions: [
    { label: "Get matched", href: "/get-matched?source=why-clink", variant: "default" as const },
    { label: "Start booking", href: "/appointments/book-appointment?source=why-clink", variant: "outline" as const },
  ],
}

export const whyClinkComparisons: WhyClinkComparison[] = [
  {
    heading: "Compliance governance",
    clink: "Versioned consent records, legal hold controls, and auditable privacy-rights workflows.",
    standard: "Often limited to generic policy pages without operational lifecycle controls.",
  },
  {
    heading: "Clinical safety controls",
    clink: "Minimum dataset enforcement for note sign-off and role-bound access pathways.",
    standard: "Documentation quality and access controls vary by clinic tooling.",
  },
  {
    heading: "Continuity of care",
    clink: "Integrated referral, intake, notes, and follow-up context across patient and clinician views.",
    standard: "Continuity may rely on manual handoffs across disconnected systems.",
  },
  {
    heading: "Operational reliability",
    clink: "Queue workflows, SLA-aware triage patterns, and governance event auditability.",
    standard: "Operational visibility and traceability may be less explicit.",
  },
]

export const whyClinkDisclaimer =
  "Comparisons are category-level and informational only. Individual clinic capabilities can vary and should be confirmed directly with each provider."

export const whyClinkFaq = {
  title: "Questions about choosing a provider",
  items: [
    {
      question: "Is this page comparing Clink to a specific competitor?",
      answer:
        "No. “Standard telehealth clinics” describes common patterns in the category, not any named organisation. Always verify capabilities with the clinic you choose.",
    },
    {
      question: "How should I use this alongside my GP or referrer?",
      answer:
        "Bring questions about session format, rebates, and clinical fit to your referrer and to any intake call. Clink surfaces pathways and transparency early in booking.",
    },
    {
      question: "What if I need crisis support?",
      answer:
        "For emergencies or immediate danger, use local emergency services. This site is not a crisis line—see Resources for crisis contact numbers.",
    },
  ],
}

export const whyClinkCta: PublicCtaBlock = {
  title: "See how the model fits your situation",
  description: "Walk through matching or booking—we keep fees, rebates, and session format context visible at the right moments.",
  primaryHref: "/get-matched?source=why-clink",
  primaryLabel: "Get matched",
  secondaryHref: "/pricing?source=why-clink",
  secondaryLabel: "View pricing",
}
