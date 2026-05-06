export const pricingHero = {
  eyebrow: "Pricing and Medicare",
  title: "Transparent pricing in one place",
  description:
    "Session fees, Medicare rebate examples, and indicative out-of-pocket estimates are summarised here so you can make informed decisions before booking.",
  kicker:
    "Figures are illustrative; your clinician, referral type, and current Medicare rules determine what you actually pay and claim.",
  actions: [
    { label: "Get matched", href: "/get-matched?source=pricing", variant: "default" as const },
    { label: "Start booking", href: "/appointments/book-appointment?source=pricing", variant: "outline" as const },
  ],
}

export const pricingFaq = {
  title: "Pricing FAQs",
  items: [
    {
      question: "Why is my gap different from the examples?",
      answer:
        "Session fees vary by clinician and session length. Medicare rebate amounts depend on registration type (e.g. general vs clinical psychologist) and your plan. We show rounded examples only.",
    },
    {
      question: "Do I need a Mental Health Treatment Plan for a rebate?",
      answer:
        "Usually yes for Medicare-subsidised psychology sessions. Your GP assesses eligibility and issues the plan where appropriate. See our Medicare rebates page for pathway detail.",
    },
    {
      question: "Is this financial or tax advice?",
      answer:
        "No. For personal tax or rebate questions, confirm with Services Australia, your GP, or a qualified adviser.",
    },
  ],
}

export const pricingCta = {
  title: "Ready to check fees in context?",
  description: "Continue to Medicare pathway detail or speak with our team if you need a human before you book.",
  primaryHref: "/medicare-rebates?source=pricing",
  primaryLabel: "Medicare rebates guide",
  secondaryHref: "/contact?source=pricing",
  secondaryLabel: "Billing question",
}
