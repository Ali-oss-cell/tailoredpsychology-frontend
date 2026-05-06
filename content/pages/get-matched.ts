import type { PublicDetailPageContent } from "@/content/pages/types"

export const getMatchedPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "Matching",
    title: "Find the right psychologist with confidence",
    description:
      "Share your goals, preferences, and availability to receive care recommendations that fit your needs.",
  },
  split: {
    eyebrow: "How Matching Works",
    title: "A guided flow designed to reduce decision fatigue",
    description:
      "The matching process combines care goals, session preferences, and scheduling to suggest clinicians with relevant expertise.",
    imageSrc:
      "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Patient matching flow concept illustration.",
  },
  highlights: {
    title: "What we consider",
    items: [
      {
        title: "Clinical needs",
        description:
          "Presenting concerns and treatment goals help us prioritize suitable therapeutic expertise.",
      },
      {
        title: "Session preferences",
        description:
          "Telehealth or in-clinic choices are included from the beginning to avoid later rework.",
      },
      {
        title: "Availability windows",
        description:
          "Preferred days and times improve matching quality and reduce booking friction.",
      },
      {
        title: "Care continuity",
        description:
          "Recommendations aim for long-term fit, not just first-session availability.",
      },
    ],
    muted: true,
  },
  faq: {
    title: "Matching FAQs",
    items: [
      {
        question: "How long does matching take?",
        answer:
          "Most matches can be generated quickly once preferences and intake details are completed.",
      },
      {
        question: "Can I request a different psychologist later?",
        answer:
          "Yes. If fit changes, the care team can help with a transition plan.",
      },
      {
        question: "Do I need a referral first?",
        answer:
          "Not always. Referral requirements depend on pathway and rebate eligibility.",
      },
    ],
  },
}
