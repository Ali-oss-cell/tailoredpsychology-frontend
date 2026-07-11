import { conditionPages } from "@/content/conditions"
import { matchClinicianCatalog } from "@/content/get-matched-quiz"

export type HomeTrustIndicator = {
  label: string
  icon: "medicare" | "ahpra" | "telehealth" | "australia" | "privacy"
}

export type HomeTrustBarItem = {
  title: string
  description: string
  icon: "evidence" | "licensed" | "video" | "matching" | "australia" | "privacy"
}

export type HomeCertificationBadge = {
  label: string
  icon: "aapi" | "medicare" | "ahpra" | "iso27001"
  /** Present only for claims not yet cleared by counsel — renders as a muted "pending review" chip. */
  pendingReview?: boolean
}

export type HomeCareJourneyStep = {
  step: number
  title: string
  description: string
  icon: "match" | "meet" | "manage"
}

export type HomeHowItWorksStep = {
  title: string
  description: string
  icon: "questions" | "match" | "book"
}

export type HomeServiceCard = {
  slug: string
  title: string
  description: string
}

export type HomeWhyChooseItem = {
  eyebrow: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
}

export type HomeTestimonial = {
  quote: string
  name: string
  context: string
}

export type HomeHeroStat = {
  value: string
  label: string
  disclaimer?: string
}

export type HomePageContent = {
  hero: {
    badge: string
    title: string
    titleAccent: string
    description: string
    imageSrc: string
    imageAlt: string
    primaryAction: { href: string; label: string }
    secondaryAction: { href: string; label: string }
    tertiaryAction: { href: string; label: string }
    trustIndicators: HomeTrustIndicator[]
    floatingStats: HomeHeroStat[]
  }
  trustBar: HomeTrustBarItem[]
  certificationBadges: HomeCertificationBadge[]
  careJourneySteps: {
    title: string
    description: string
    steps: HomeCareJourneyStep[]
  }
  howItWorks: {
    title: string
    description: string
    steps: HomeHowItWorksStep[]
  }
  services: {
    title: string
    description: string
    items: HomeServiceCard[]
  }
  featuredPsychologists: {
    title: string
    description: string
    disclaimer: string
  }
  whyChooseUs: {
    title: string
    description: string
    items: HomeWhyChooseItem[]
  }
  testimonials: {
    title: string
    description: string
    disclaimer: string
    items: HomeTestimonial[]
  }
  faq: {
    title: string
    items: Array<{ question: string; answer: string }>
  }
  ctaStrip: {
    title: string
    description: string
    primaryHref: string
    primaryLabel: string
    secondaryHref: string
    secondaryLabel: string
  }
}

const featuredConditionSlugs = [
  "anxiety",
  "depression",
  "adhd",
  "trauma-ptsd",
  "stress-burnout",
  "sleep",
] as const

export const homepageContent: HomePageContent = {
  hero: {
    badge: "Available Australia wide",
    title: "Find the right psychologist for",
    titleAccent: "your journey",
    description:
      "Answer a few quick questions — about 2 minutes — and we will suggest psychologists who fit your state, goals, and preferences. Warm, evidence-based care when you are ready to book.",
    imageSrc: "/assets/hero-consultation-CPVmFEx5.webp",
    imageAlt:
      "A psychologist and client talking together in a bright, comfortable consultation space.",
    primaryAction: { href: "/get-matched", label: "Find your psychologist" },
    secondaryAction: { href: "/services", label: "Explore services" },
    tertiaryAction: { href: "#how-it-works", label: "How it works" },
    trustIndicators: [
      { label: "Medicare supported", icon: "medicare" },
      { label: "AHPRA registered", icon: "ahpra" },
      { label: "Secure telehealth", icon: "telehealth" },
      { label: "Australia wide", icon: "australia" },
      { label: "Privacy first", icon: "privacy" },
    ],
    floatingStats: [
      {
        value: "~2 min",
        label: "Matching quiz",
        disclaimer: "Typical completion time",
      },
      {
        value: "15+",
        label: "Clinical psychologists",
        disclaimer: "Illustrative practice snapshot",
      },
      {
        value: "100%",
        label: "Confidential care",
        disclaimer: "Privacy-first by design",
      },
    ],
  },
  trustBar: [
    {
      title: "Evidence-based care",
      description: "Structured, research-informed approaches tailored to your goals.",
      icon: "evidence",
    },
    {
      title: "Licensed professionals",
      description: "AHPRA-registered psychologists with credentialing at onboarding.",
      icon: "licensed",
    },
    {
      title: "Secure video",
      description: "Encrypted telehealth with a simple, reliable joining flow.",
      icon: "video",
    },
    {
      title: "Fast matching",
      description: "A short quiz surfaces clinicians who fit your state and needs.",
      icon: "matching",
    },
    {
      title: "Australia wide",
      description: "Telehealth across states and territories where clinicians are registered.",
      icon: "australia",
    },
    {
      title: "Privacy",
      description: "Consent, access controls, and transparent data handling.",
      icon: "privacy",
    },
  ],
  certificationBadges: [
    { label: "AAPi Member", icon: "aapi", pendingReview: true },
    { label: "Medicare", icon: "medicare" },
    { label: "AHPRA Registered", icon: "ahpra" },
    { label: "ISO 27001", icon: "iso27001", pendingReview: true },
  ],
  careJourneySteps: {
    title: "Your path to better mental health",
    description:
      "A streamlined, secure process designed around your needs, so you get the right support without unnecessary friction.",
    steps: [
      {
        step: 1,
        title: "Match",
        description:
          "Complete a brief assessment to find a highly qualified practitioner tailored to your specific clinical needs.",
        icon: "match",
      },
      {
        step: 2,
        title: "Meet",
        description:
          "Connect securely from any device. Our platform ensures high-definition video with clinical-grade privacy.",
        icon: "meet",
      },
      {
        step: 3,
        title: "Manage",
        description:
          "Track your progress, access therapeutic resources, and manage appointments easily through your patient dashboard.",
        icon: "manage",
      },
    ],
  },
  howItWorks: {
    title: "How it works",
    description:
      "A straightforward path from first questions to your first session — less logistics, more focus on care.",
    steps: [
      {
        title: "Answer a few questions",
        description:
          "Tell us your state, goals, and preferences in a confidential quiz — about 2 minutes.",
        icon: "questions",
      },
      {
        title: "We match you thoughtfully",
        description:
          "We suggest psychologists whose experience, modality, and availability align with your situation.",
        icon: "match",
      },
      {
        title: "Book when you are ready",
        description:
          "Choose a clinician and a real available slot. No pressure until you feel comfortable to proceed.",
        icon: "book",
      },
    ],
  },
  services: {
    title: "Support for what you are facing",
    description:
      "Evidence-based psychology pathways across common concerns. Explore a condition to learn how we approach care.",
    items: featuredConditionSlugs
      .map((slug) => conditionPages.find((c) => c.slug === slug))
      .filter((c): c is (typeof conditionPages)[number] => Boolean(c))
      .map((c) => ({
        slug: c.slug,
        title: c.title.replace(/ support$/, ""),
        description: c.summary,
      })),
  },
  featuredPsychologists: {
    title: "Featured psychologists",
    description:
      "A sample of clinicians you may see after matching. Registration and availability vary by state.",
    disclaimer:
      "Profiles shown are illustrative examples from our matching catalogue; your suggested clinicians may differ.",
  },
  whyChooseUs: {
    title: "Why choose Tailored Psychology",
    description:
      "Care designed around fit, evidence, and respect for your pace — not a one-size-fits-all program.",
    items: [
      {
        eyebrow: "Privacy first",
        title: "Your information stays yours",
        description:
          "Consent, access controls, and transparent communication about how your data is used — so you can focus on therapy, not paperwork anxiety.",
        imageSrc: "/assets/home-trust-connection-C5Do13n-.webp",
        imageAlt: "Two people in conversation, suggesting empathy and trust.",
      },
      {
        eyebrow: "Evidence based",
        title: "Care grounded in research",
        description:
          "Structured assessment, clear goals, and approaches informed by current evidence — adapted to what works for you in practice.",
        imageSrc: "/assets/home-process-notes-DFNaNRKT.jpg",
        imageAlt: "Therapy notes and planning materials suggesting structured care.",
      },
      {
        eyebrow: "Personal matching",
        title: "Fit matters as much as expertise",
        description:
          "We combine your goals, logistics, and preferences to suggest clinicians with relevant experience — you choose who feels right.",
        imageSrc: "/assets/home-guided-support-rzFm5cPb.jpg",
        imageAlt: "Clinician reviewing notes in a collaborative session.",
      },
      {
        eyebrow: "Experienced clinicians",
        title: "Depth across specialties",
        description:
          "Our psychologists bring diverse specialties and stay current with research-backed methods — individual attention within a connected practice.",
        imageSrc: "/assets/home-benefits-team-PZcsa_1m.jpg",
        imageAlt: "Clinical team collaborating in a professional healthcare setting.",
      },
      {
        eyebrow: "Australia wide",
        title: "Care wherever you are",
        description:
          "Secure telehealth across Australia, with in-clinic options where available. Medicare-aware intake helps you understand typical rebate pathways.",
        imageSrc: "/assets/hero-telehealth-CKKDaObt.webp",
        imageAlt: "Person joining a telehealth call from home.",
      },
    ],
  },
  testimonials: {
    title: "What patients say",
    description:
      "Experiences vary — these examples reflect common themes we hear, not guaranteed outcomes.",
    disclaimer:
      "Illustrative testimonials for layout demonstration; names and details are fictionalised.",
    items: [
      {
        quote:
          "The matching quiz saved me scrolling through profiles. I felt understood from the first session and knew what to expect.",
        name: "M. R.",
        context: "Matched for anxiety · NSW telehealth",
      },
      {
        quote:
          "Clear Medicare guidance upfront meant no surprises at billing. Telehealth was straightforward — I could join from work between meetings.",
        name: "J. T.",
        context: "Follow-up care · VIC",
      },
      {
        quote:
          "I appreciated being able to switch clinicians when my needs changed. The team explained options without pressure.",
        name: "S. L.",
        context: "Relationship support · QLD",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "How do I know if Tailored Psychology is right for me?",
        answer:
          "Start with a short matching flow or a call with our team. We will ask about your goals, availability, and preferences, then suggest clinicians who fit — there is no pressure to book until you feel ready.",
      },
      {
        question: "Can I use Medicare or private cover?",
        answer:
          "Many clients use a Mental Health Care Plan for Medicare rebates on eligible sessions. Coverage varies by insurer for extras; we can outline typical pathways and what to confirm with your fund.",
      },
      {
        question: "Is telehealth as effective as in-person care?",
        answer:
          "Research supports telehealth for many common concerns when sessions are structured well and privacy is protected. If telehealth is not the right fit, we can help you switch to in-clinic visits where available.",
      },
      {
        question: "What happens in the first session?",
        answer:
          "Your psychologist will explain confidentiality, consent, and how sessions work. You will set initial goals together and agree on frequency and format — so you leave with a clear sense of direction.",
      },
      {
        question: "How quickly can I get an appointment?",
        answer:
          "Availability depends on clinician schedules and your preferences. The booking flow shows real available slots after matching — many patients book within a few days.",
      },
      {
        question: "Can I change psychologist if it is not the right fit?",
        answer:
          "Yes. Therapeutic fit matters. Contact our team or use intake again to explore other clinicians — we want you to feel comfortable with your choice.",
      },
    ],
  },
  ctaStrip: {
    title: "Ready to start your care journey?",
    description:
      "Tell us your preferences and availability, and we will help match you with the right psychologist.",
    primaryHref: "/get-matched",
    primaryLabel: "Find your psychologist",
    secondaryHref: "/contact",
    secondaryLabel: "Talk to our team",
  },
}

/** Featured clinicians for homepage cards — excludes auto-match placeholder. */
export const homepageFeaturedClinicians = matchClinicianCatalog.map((c) => ({
  id: c.id,
  name: c.name,
  specialty: c.specialty,
  languages: c.languages,
  profileImageUrl: c.profileImageUrl,
  bookHref: "/get-matched",
}))
