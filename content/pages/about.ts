import type { PublicDetailPageContent } from "@/content/pages/types"

export const aboutPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "About Tailored Psychology",
    title: "Psychology with intention and warmth",
    description:
      "We are a modern psychology clinic focused on evidence-based care, clear communication, and long-term wellbeing outcomes.",
  },
  split: {
    eyebrow: "Our Philosophy",
    title: "Clinical quality without losing the human touch",
    description:
      "Every treatment pathway is collaborative and practical. We combine strong clinical frameworks with a calm, empathetic environment where patients feel heard.",
    imageSrc: "/assets/clinic-room.svg",
    imageAlt: "A calm therapy room with natural light and comfortable seating.",
  },
  highlights: {
    title: "What makes our care different",
    items: [
      {
        title: "Evidence-based practice",
        description:
          "Treatment approaches are selected for proven outcomes and tailored to each patient context.",
      },
      {
        title: "Continuity of care",
        description:
          "Clear goals, regular progress reviews, and coordinated communication across clinical workflows.",
      },
      {
        title: "Accessible support",
        description:
          "In-clinic and telehealth pathways designed to reduce friction and improve care consistency.",
      },
      {
        title: "Privacy-first operations",
        description:
          "Consent, data handling, and auditability are integrated into how we deliver care every day.",
      },
    ],
  },
  brandBand: {
    title: "Identity built for clarity and calm",
    body: "Our visual language mirrors how we practice: straightforward, warm, and focused on you—not noise.",
    imageSrc: "/assets/logo-tailored-png.png",
    imageAlt: "Tailored Psychology wordmark on a clean background.",
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "Who can book with Tailored Psychology?",
        answer:
          "We support adults, couples, and younger clients through role-appropriate intake and matching pathways.",
      },
      {
        question: "Do you offer telehealth?",
        answer:
          "Yes. Patients can choose telehealth, in-clinic care, or a hybrid model depending on availability and preference.",
      },
      {
        question: "How is progress tracked?",
        answer:
          "Clinicians set clear treatment goals and review progress regularly with notes and structured follow-up.",
      },
    ],
  },
}
