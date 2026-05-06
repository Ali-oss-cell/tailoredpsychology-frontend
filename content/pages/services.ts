import type { PublicDetailPageContent } from "@/content/pages/types"

export const servicesPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "Services",
    title: "Psychology services built around you",
    description:
      "From one-on-one therapy to structured clinical pathways, our services are designed for clarity, outcomes, and accessibility.",
    kicker: "Same clinical standards whether you meet in person or by secure video — notes, scheduling, and follow-up stay connected.",
    actions: [
      { label: "Get matched", href: "/get-matched", variant: "default" },
      { label: "Book a visit", href: "/appointments/book-appointment", variant: "outline" },
    ],
  },
  split: {
    eyebrow: "Care model",
    title: "Flexible formats with consistent clinical quality",
    description:
      "Patients can engage through in-clinic or telehealth sessions, with the same standards for notes, scheduling, and treatment continuity.",
    imageSrc: "/assets/marketing-cliff-sunset-zac-durant.jpg",
    imageAlt: "Silhouette of a person on a hill at sunset with arms raised toward warm light.",
    imageOnLeft: true,
  },
  highlights: {
    title: "Service streams",
    items: [
      {
        title: "Individual therapy",
        description:
          "Support for anxiety, mood concerns, trauma recovery, and personal growth using evidence-based methods.",
      },
      {
        title: "Couples and relationship care",
        description:
          "Guided communication and relational repair frameworks tailored to the couple's goals and context.",
      },
      {
        title: "Youth and family pathways",
        description:
          "Age-appropriate interventions that align family support, education needs, and clinical goals.",
      },
      {
        title: "Referral-informed treatment",
        description:
          "Integrated intake and referral review supports continuity for Medicare and GP-linked pathways.",
      },
    ],
  },
  brandBand: {
    title: "Telehealth with the same clinical spine",
    body: "When you meet by secure video, scheduling, notes, and follow-up stay connected to the same pathway as in-clinic care.",
    imageSrc: "/assets/telehealth-session.svg",
    imageAlt: "Illustration representing a calm telehealth session.",
  },
  faq: {
    title: "Service FAQs",
    items: [
      {
        question: "How do I choose the right service?",
        answer:
          "Use our matching flow or speak to our team; we map your goals and preferences to the most suitable pathway.",
      },
      {
        question: "Can I switch between telehealth and in-clinic?",
        answer:
          "Yes, where clinically appropriate and scheduling allows, patients can move between session formats.",
      },
      {
        question: "Are services available after hours?",
        answer: "Availability depends on clinician schedules. The booking flow surfaces real-time options.",
      },
    ],
  },
  cta: {
    title: "Find the right clinician and format",
    description: "Tell us what you are looking for — we will guide you into the right intake and booking path.",
    primaryHref: "/get-matched",
    primaryLabel: "Get matched",
    secondaryHref: "/contact",
    secondaryLabel: "Ask a question",
  },
}
