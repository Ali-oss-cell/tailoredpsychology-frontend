import type { PublicDetailPageContent } from "@/content/pages/types"

export const medicareRebatesPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "Medicare rebates",
    title: "Understand rebates before you book",
    description:
      "We make Medicare pathways clearer by outlining eligibility, referral requirements, and billing expectations up front.",
    kicker: "Rebates depend on a valid Mental Health Care Plan and current Medicare rules — we help you see fees and likely out-of-pocket before you commit.",
    actions: [
      { label: "Start booking", href: "/appointments/book-appointment", variant: "default" },
      { label: "Talk to us", href: "/contact", variant: "outline" },
    ],
  },
  split: {
    eyebrow: "Billing clarity",
    title: "Transparent guidance for Mental Health Care Plan pathways",
    description:
      "With a valid GP plan, eligible patients can claim rebates. We explain each step so there are no surprises.",
    imageSrc: "/assets/telehealth-session.svg",
    imageAlt: "Illustration representing planning and reviewing care documentation.",
    imageOnLeft: true,
  },
  highlights: {
    title: "Rebate pathway essentials",
    items: [
      {
        title: "Eligibility review",
        description:
          "Confirm that your referral and clinical pathway align with current Medicare criteria.",
      },
      {
        title: "Upfront fee visibility",
        description:
          "Understand session fees, rebate amounts, and expected out-of-pocket costs before treatment.",
      },
      {
        title: "Claim support",
        description: "Operational workflows help patients complete claims smoothly after eligible sessions.",
      },
      {
        title: "Documentation quality",
        description: "Structured records support compliance and reduce claim friction.",
      },
    ],
  },
  faq: {
    title: "Medicare FAQs",
    items: [
      {
        question: "Do all sessions receive a rebate?",
        answer: "Rebates depend on eligibility, referral validity, and current Medicare limits.",
      },
      {
        question: "Can I use telehealth and still claim?",
        answer: "Yes, where eligibility and pathway requirements are met.",
      },
      {
        question: "What if my referral expires?",
        answer: "Your GP can issue updated documentation where clinically appropriate.",
      },
    ],
  },
  cta: {
    title: "Ready to check your pathway?",
    description: "Walk through intake and booking — we surface fee and rebate context at the right moments.",
    primaryHref: "/appointments/book-appointment",
    primaryLabel: "Go to booking",
    secondaryHref: "/contact",
    secondaryLabel: "Billing question",
  },
}
