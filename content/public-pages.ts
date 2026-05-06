export type PublicPageContent = {
  eyebrow: string
  title: string
  description: string
  infoTitle: string
  infoBody: string
  featureTitle: string
  features: Array<{ title: string; description: string }>
}

export const publicPagesContent: Record<string, PublicPageContent> = {
  about: {
    eyebrow: "Our Practice",
    title: "Psychology with intention",
    description:
      "Clink combines evidence-based care with a deeply human therapeutic experience.",
    infoTitle: "How we work",
    infoBody:
      "We focus on continuity, clarity, and measurable progress while adapting treatment plans to each person and life context.",
    featureTitle: "What defines our care",
    features: [
      { title: "Evidence-led", description: "Modalities chosen for outcomes, not trends." },
      { title: "Collaborative", description: "Care plans shaped with clients, not for clients." },
      { title: "Consistent", description: "Clear milestones and review points throughout therapy." },
    ],
  },
  services: {
    eyebrow: "Service Model",
    title: "Services built around your needs",
    description:
      "From one-on-one therapy to structured care plans, Clink supports every stage of the journey.",
    infoTitle: "Formats we offer",
    infoBody:
      "In-clinic and telehealth sessions are supported by consistent documentation, referrals, and billing workflows.",
    featureTitle: "Service areas",
    features: [
      { title: "Individual Therapy", description: "Personalized therapy pathways for common and complex needs." },
      { title: "Couples Support", description: "Relationship support grounded in practical communication tools." },
      { title: "Youth Care", description: "Age-appropriate support for adolescents and families." },
    ],
  },
  telehealth: {
    eyebrow: "Telehealth",
    title: "Telehealth requirements and safety",
    description:
      "Prepare your environment, device, and contingency plan before each online session.",
    infoTitle: "Session readiness",
    infoBody:
      "Stable internet, private location, and backup contact details help ensure continuity during telehealth appointments.",
    featureTitle: "Before your session",
    features: [
      { title: "Private Space", description: "Use a quiet location where you can speak freely." },
      { title: "Reliable Device", description: "Laptop or phone with camera and audio access enabled." },
      { title: "Emergency Details", description: "Confirm your location and support contact details." },
    ],
  },
  medicare: {
    eyebrow: "Medicare",
    title: "Understand Medicare rebates",
    description:
      "We help eligible clients process rebates with clear billing expectations from the first session.",
    infoTitle: "How claims work",
    infoBody:
      "With a valid Mental Health Care Plan, eligible sessions can be partially rebated based on current Medicare guidance.",
    featureTitle: "Rebate support",
    features: [
      { title: "Plan guidance", description: "Know what your GP referral needs to include." },
      { title: "Transparent billing", description: "Understand out-of-pocket costs before booking." },
      { title: "Fast processing", description: "Claims workflow designed to reduce waiting time." },
    ],
  },
  resources: {
    eyebrow: "Resources",
    title: "Tools for ongoing wellbeing",
    description:
      "Browse curated articles, exercises, and support pathways that complement your care.",
    infoTitle: "What you will find",
    infoBody:
      "Resources are organized by topic so patients can quickly access practical support between sessions.",
    featureTitle: "Library highlights",
    features: [
      { title: "Coping guides", description: "Actionable techniques for daily emotional regulation." },
      { title: "Crisis links", description: "Trusted emergency and after-hours support channels." },
      { title: "Digital tools", description: "Apps and structured exercises for routine practice." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Talk to our team",
    description:
      "Reach out for enquiries, referrals, availability, and support navigating your next step.",
    infoTitle: "How we respond",
    infoBody:
      "Our team reviews requests quickly and routes each enquiry to the appropriate care or operations pathway.",
    featureTitle: "Contact pathways",
    features: [
      { title: "General enquiries", description: "Questions about services, fees, or therapist availability." },
      { title: "Referral support", description: "Guidance for referral and intake documentation." },
      { title: "Operational support", description: "Scheduling, billing, and account assistance." },
    ],
  },
  matched: {
    eyebrow: "Matching",
    title: "Get matched with the right psychologist",
    description:
      "Share your goals, preferences, and availability so we can recommend the best-fit clinician.",
    infoTitle: "How matching works",
    infoBody:
      "We combine your needs, logistics, and therapeutic preferences to suggest suitable psychologists.",
    featureTitle: "Matching factors",
    features: [
      { title: "Care goals", description: "Presenting concerns, treatment goals, and preferred style." },
      { title: "Availability", description: "Preferred times and telehealth/in-clinic choices." },
      { title: "Clinical fit", description: "Therapist expertise aligned to your priorities." },
    ],
  },
}
