import type { PublicDetailPageContent } from "@/content/pages/types"

export const resourcesPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "Resources",
    title: "Practical tools for life between sessions",
    description:
      "Explore curated articles, support pathways, and digital resources designed to complement clinical care.",
    kicker: "Use these alongside your clinician's advice — they are educational, not a substitute for personalised care.",
    actions: [
      { label: "Get matched", href: "/get-matched", variant: "default" },
      { label: "Patient sign in", href: "/login", variant: "outline" },
    ],
  },
  split: {
    eyebrow: "Resource library",
    title: "Curated content with real clinical utility",
    description:
      "Resources are selected for clarity and evidence-alignment, covering emotional regulation, stress management, and crisis access.",
    imageSrc: "/assets/marketing-mental-health-sign-dan-meyers.jpg",
    imageAlt: "Hand-painted signs on a fence reading encouragement messages about mental health and support.",
    imageOnLeft: true,
  },
  highlights: {
    title: "Library categories",
    items: [
      {
        title: "Guided exercises",
        description:
          "Structured tools for grounding, reflection, and day-to-day regulation practices.",
      },
      {
        title: "Educational reads",
        description:
          "Short explainers that help patients understand symptoms, treatment models, and recovery strategies.",
      },
      {
        title: "Crisis support links",
        description:
          "Important emergency and after-hours numbers for immediate help when needed.",
      },
      {
        title: "Digital tools",
        description:
          "App and platform recommendations to support routine wellbeing habits between appointments.",
      },
    ],
  },
  brandBand: {
    title: "Between sessions",
    body: "Short exercises and reads support your plan—always use them alongside your clinician's guidance.",
    imageSrc: "/assets/telehealth-session.svg",
    imageAlt: "Illustration suggesting continuity between appointments.",
  },
  faq: {
    title: "Resource FAQs",
    items: [
      {
        question: "Are resources free to access?",
        answer:
          "Public resources are freely available, with additional curated materials available through patient-facing pages.",
      },
      {
        question: "How often is content updated?",
        answer: "Content is reviewed regularly to maintain relevance, quality, and safety in recommendations.",
      },
      {
        question: "Can clinicians recommend specific resources?",
        answer: "Yes, clinicians can guide patients to targeted resources aligned to treatment goals.",
      },
    ],
  },
  cta: {
    title: "Bring resources into your care rhythm",
    description: "Create an account to save progress on intake, booking, and clinician-matched materials in one place.",
    primaryHref: "/register",
    primaryLabel: "Create account",
    secondaryHref: "/get-matched",
    secondaryLabel: "Get matched",
  },
}
