import type { PublicDetailPageContent } from "@/content/pages/types"

export const contactPageContent: PublicDetailPageContent = {
  hero: {
    eyebrow: "Contact",
    title: "Talk to our care and operations team",
    description:
      "Reach out for appointments, referrals, billing questions, or service guidance. We route enquiries quickly to the right pathway.",
    kicker: "For emergencies or immediate danger, use local emergency services — this inbox is not monitored as a crisis line.",
    actions: [
      { label: "Get matched", href: "/get-matched", variant: "default" },
      { label: "Browse resources", href: "/resources", variant: "outline" },
    ],
  },
  split: {
    eyebrow: "Support pathways",
    title: "Clear response flow for every enquiry",
    description:
      "Clinical, referral, and operations requests follow structured handling so patients and partners receive timely and accurate support.",
    imageSrc: "/assets/marketing-couple-hands-feet-priscilladupreez.jpg",
    imageAlt: "Two adults gently holding a baby's feet in a soft, intimate moment.",
  },
  highlights: {
    title: "How we can help",
    items: [
      {
        title: "General enquiries",
        description:
          "Questions about services, session formats, availability, and getting started at Clink.",
      },
      {
        title: "Referral support",
        description: "Guidance for referral submission, status updates, and required documentation.",
      },
      {
        title: "Billing and Medicare",
        description: "Help with invoices, rebates, payment confirmations, and account-related concerns.",
      },
      {
        title: "Operational assistance",
        description: "Changes to appointments, account settings, and non-clinical platform support.",
      },
    ],
    muted: true,
  },
  faq: {
    title: "Contact FAQs",
    items: [
      {
        question: "How quickly do you respond?",
        answer:
          "Most enquiries are reviewed promptly during business hours and routed by priority and category.",
      },
      {
        question: "Can I submit referral documents online?",
        answer: "Yes, referrals can be uploaded through the patient flow and reviewed by authorized staff.",
      },
      {
        question: "Where can I find crisis support contacts?",
        answer: "Crisis and emergency support numbers are listed in our resources section for immediate access.",
      },
    ],
  },
  cta: {
    title: "Prefer to self-serve first?",
    description: "Many answers live in our services, Medicare, and resources pages — then reach out if you still need a human.",
    primaryHref: "/services",
    primaryLabel: "View services",
    secondaryHref: "/register",
    secondaryLabel: "Create account",
  },
}
