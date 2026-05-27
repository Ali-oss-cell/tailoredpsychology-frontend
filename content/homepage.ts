export type HomePageContent = {
  hero: {
    badge: string
    title: string
    titleAccent: string
    description: string
    imageSrc: string
    imageAlt: string
    primaryAction: { href: string; label: string }
    secondaryAction: {
      href: string
      label: string
      variant: "outline" | "ghost" | "secondary" | "default"
    }
  }
  trustStats: Array<{ value: string; label: string }>
  wellbeingIntro: {
    eyebrow?: string
    title: string
    description: string
    imageSrc: string
    imageAlt: string
    imageOnLeft?: boolean
    action?: { href: string; label: string }
  }
  guidedCare: {
    eyebrow?: string
    title: string
    description: string
    imageSrc: string
    imageAlt: string
    imageOnLeft?: boolean
    action?: { href: string; label: string }
  }
  servicesPreview: {
    title: string
    description: string
    items: Array<{ title: string; description: string }>
  }
  trustConnection: {
    eyebrow?: string
    title: string
    description: string
    imageSrc: string
    imageAlt: string
    imageOnLeft?: boolean
    action?: { href: string; label: string }
  }
  carePath: {
    title: string
    description: string
    steps: Array<{ title: string; body: string }>
    imageSrc: string
    imageAlt: string
  }
  telehealthBand: {
    title: string
    description: string
    items: Array<{
      title: string
      description: string
      icon: "telehealth" | "medicare"
    }>
  }
  teamSnapshot: {
    eyebrow?: string
    title: string
    description: string
    imageSrc: string
    imageAlt: string
    imageOnLeft?: boolean
    action?: { href: string; label: string }
  }
  moments: {
    title: string
    description: string
    items: Array<{ src: string; alt: string; caption: string }>
  }
  clinicalBand: {
    title: string
    description: string
    clinic: { src: string; alt: string; caption: string }
    team: { src: string; alt: string; caption: string }
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

export const homepageContent: HomePageContent = {
  hero: {
    badge: "Available for new patients",
    title: "Find the right psychologist for",
    titleAccent: "your situation",
    description:
      "Answer a few quick questions — about 2 minutes — and we will suggest psychologists who fit your state, goals, and preferences. Warm, evidence-based care when you are ready to book.",
    imageSrc: "/assets/hero-consultation-CPVmFEx5.webp",
    imageAlt: "A psychologist and client talking together in a bright, comfortable consultation space.",
    primaryAction: { href: "/get-matched", label: "Find your right psychologist" },
    secondaryAction: {
      href: "/services",
      label: "View Services",
      variant: "outline",
    },
  },
  trustStats: [
    { value: "4.9/5", label: "Patient satisfaction" },
    { value: "15+", label: "Clinical psychologists" },
    { value: "100%", label: "Confidential care" },
  ],
  wellbeingIntro: {
    eyebrow: "Whole-person care",
    title: "Wellbeing is more than a checklist",
    description:
      "Sleep, stress, relationships, and physical health all shape mental health. We hold space for the full picture so your plan feels realistic—not like another rigid program.",
    imageSrc: "/assets/auth-wellness-Cy4YmFxd.webp",
    imageAlt: "Person in a quiet, restorative moment suggesting balance and self-care.",
    action: { href: "/register", label: "Create an account" },
  },
  guidedCare: {
    eyebrow: "Guided support",
    title: "Care that adapts to your pace and priorities",
    description:
      "Whether you are navigating anxiety, burnout, or a major life change, sessions are structured around clear goals, regular check-ins, and practical strategies you can use between appointments.",
    imageSrc: "/assets/home-guided-support-rzFm5cPb.jpg",
    imageAlt: "Clinician reviewing notes with a warm, collaborative tone in session.",
  },
  servicesPreview: {
    title: "How we can support you",
    description:
      "Comprehensive psychology services designed to foster resilience, growth, and healing in a safe environment.",
    items: [
      {
        title: "Individual Therapy",
        description:
          "One-on-one sessions for anxiety, depression, trauma, and life transitions using evidence-based approaches.",
      },
      {
        title: "Couples Counselling",
        description:
          "Support for communication and relationship challenges in a neutral, collaborative therapeutic space.",
      },
      {
        title: "Child and Adolescent",
        description:
          "Specialized care for younger clients navigating school pressure, emotional regulation, and developmental changes.",
      },
    ],
  },
  trustConnection: {
    eyebrow: "Trust first",
    title: "A therapeutic relationship you can rely on",
    description:
      "We invest in fit, consent, and transparent communication so you always know how your care works, what to expect in session, and how your information is protected.",
    imageSrc: "/assets/home-trust-connection-C5Do13n-.webp",
    imageAlt: "Two people in conversation, suggesting empathy and connection.",
    imageOnLeft: true,
    action: { href: "/trust", label: "How we earn trust" },
  },
  carePath: {
    title: "From first contact to ongoing care",
    description:
      "A straightforward path so you spend less time on logistics and more time on what matters.",
    steps: [
      {
        title: "Tell us what you need",
        body: "Share your goals, availability, and preferences—telehealth, in-person, or a mix.",
      },
      {
        title: "Get matched thoughtfully",
        body: "We suggest clinicians whose experience and style align with your situation.",
      },
      {
        title: "Build momentum together",
        body: "Regular sessions, clear plans, and collaborative review of progress over time.",
      },
    ],
    imageSrc: "/assets/home-process-notes-DFNaNRKT.jpg",
    imageAlt: "Therapy notes and planning materials on a desk, suggesting structured care.",
  },
  telehealthBand: {
    title: "Accessible care, wherever you are.",
    description:
      "Choose secure telehealth or in-clinic appointments, with clear Medicare guidance and billing support.",
    items: [
      {
        title: "Secure Telehealth",
        description:
          "Attend encrypted video sessions from home with a simple, reliable joining flow.",
        icon: "telehealth",
      },
      {
        title: "Medicare Rebates",
        description:
          "Eligible patients can claim rebates with a valid Mental Health Care Plan from their GP.",
        icon: "medicare",
      },
    ],
  },
  teamSnapshot: {
    eyebrow: "Clinical depth",
    title: "Psychologists who collaborate and keep learning",
    description:
      "Our clinicians bring diverse specialties and stay current with research-backed methods—so you benefit from both individual attention and a connected practice culture.",
    imageSrc: "/assets/home-benefits-team-PZcsa_1m.jpg",
    imageAlt: "Clinical team collaborating in a professional healthcare setting.",
    action: { href: "/why-clink", label: "Why Tailored Psychology" },
  },
  moments: {
    title: "Care in the moments that shape your week",
    description:
      "From focused therapy to flexible telehealth and supportive check-ins, the same standards apply across how you meet us.",
    items: [
      {
        src: "/assets/hero-therapy-BYkdR1Cj.webp",
        alt: "Therapy session in a calm room.",
        caption: "In-person sessions when you want a dedicated space away from home.",
      },
      {
        src: "/assets/hero-telehealth-CKKDaObt.webp",
        alt: "Person joining a telehealth call from home.",
        caption: "Telehealth that fits workdays, travel, or regional access needs.",
      },
      {
        src: "/assets/hero-support-EqaJeg5E.webp",
        alt: "Supportive conversation between two people.",
        caption: "Supportive dialogue with clear next steps—not open-ended uncertainty.",
      },
    ],
  },
  clinicalBand: {
    title: "Where thoughtful care meets real collaboration",
    description:
      "Whether you prefer a dedicated therapy room or coordinated teamwork behind the scenes, the environment is built to feel steady—not rushed.",
    clinic: {
      src: "/assets/clinic-room.svg",
      alt: "Calm in-clinic therapy room with natural light.",
      caption: "In-clinic spaces designed to feel grounded and private.",
    },
    team: {
      src: "/assets/team-discussion.svg",
      alt: "Clinical team discussing care plans together.",
      caption: "Clinicians align on approaches so your care stays coherent.",
    },
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "How do I know if Tailored Psychology is right for me?",
        answer:
          "Start with a short matching flow or a call with our team. We will ask about your goals, availability, and preferences, then suggest clinicians who fit—there is no pressure to book until you feel ready.",
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
          "Your psychologist will explain confidentiality, consent, and how sessions work. You will set initial goals together and agree on frequency and format—so you leave with a clear sense of direction.",
      },
    ],
  },
  ctaStrip: {
    title: "Ready to start your care journey?",
    description:
      "Tell us your preferences and availability, and we will help match you with the right psychologist.",
    primaryHref: "/get-matched",
    primaryLabel: "Find your right psychologist",
    secondaryHref: "/contact",
    secondaryLabel: "Talk to Our Team",
  },
}
