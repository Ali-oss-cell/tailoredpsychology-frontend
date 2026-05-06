import type { PublicDetailPageContent } from "@/content/pages/types"

export const telehealthRequirementsPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "Telehealth Requirements",
    title: "Prepare for secure and effective online sessions",
    description:
      "Follow simple setup guidelines to keep telehealth appointments stable, private, and clinically effective.",
  },
  split: {
    eyebrow: "Session Readiness",
    title: "Technical reliability and privacy are essential",
    description:
      "A stable connection, private environment, and clear backup plan help keep sessions safe and uninterrupted.",
    imageSrc:
      "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Telehealth video session setup with secure workflow.",
  },
  highlights: {
    title: "Before each telehealth session",
    items: [
      {
        title: "Private location",
        description:
          "Choose a quiet space where you can speak openly without interruption.",
      },
      {
        title: "Device and connection check",
        description:
          "Test camera, audio, and internet quality a few minutes before your appointment.",
      },
      {
        title: "Contingency details",
        description:
          "Keep emergency contact and location details current in case support is needed.",
      },
      {
        title: "Secure access",
        description:
          "Use the official appointment link and avoid joining through shared/public devices.",
      },
    ],
    muted: true,
  },
  faq: {
    title: "Telehealth FAQs",
    items: [
      {
        question: "What if my internet drops mid-session?",
        answer:
          "Your clinician follows a continuity protocol, including reconnection and backup contact pathways.",
      },
      {
        question: "Can I join from my phone?",
        answer:
          "Yes, phone access is supported, though a laptop can provide a more stable experience.",
      },
      {
        question: "Is telehealth encrypted?",
        answer:
          "Sessions use secure infrastructure designed to protect patient confidentiality.",
      },
    ],
  },
}
