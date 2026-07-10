export type FooterLink = {
  href: string
  label: string
}

export type FooterColumn = {
  id: string
  title: string
  links: readonly FooterLink[]
}

export const FOOTER_MISSION =
  "Psychology care with intention and clarity — telehealth across Australia with Medicare-aware intake and AHPRA-registered clinicians."

export const FOOTER_TRUST_BADGES = [
  "ABN on request",
  "Australia Wide",
  "Privacy First",
  "AHPRA Registered",
] as const

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    id: "quick-links",
    title: "Quick Links",
    links: [
      { href: "/about", label: "About" },
      { href: "/get-matched", label: "Find Psychologist" },
      { href: "/pricing", label: "Pricing" },
      { href: "/conditions", label: "Conditions" },
      { href: "/resources", label: "Resources" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    id: "services",
    title: "Services",
    links: [
      { href: "/services", label: "Individual Therapy" },
      { href: "/services", label: "Couples Therapy" },
      { href: "/conditions/adhd", label: "ADHD Support" },
      { href: "/conditions/anxiety", label: "Anxiety Support" },
      { href: "/conditions/depression", label: "Depression Support" },
      { href: "/conditions/trauma-ptsd", label: "Trauma & PTSD" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/medicare-rebates", label: "Medicare" },
      { href: "/telehealth-requirements", label: "Telehealth Guide" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/contact", label: "Help" },
      { href: "/resources", label: "Emergency Resources" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { href: "/login", label: "Patient Portal" },
      { href: "/login", label: "Clinician Login" },
      { href: "/register", label: "Create Account" },
      { href: "/contact", label: "Contact" },
      { href: "/contact", label: "Accessibility" },
    ],
  },
] as const

export const FOOTER_LEGAL_LINKS: readonly FooterLink[] = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms" },
  { href: "/contact", label: "Accessibility" },
  { href: "/sitemap.xml", label: "Sitemap" },
] as const

export const FOOTER_SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", icon: "linkedin" as const },
  { label: "Instagram", href: "#", icon: "instagram" as const },
  { label: "Facebook", href: "#", icon: "facebook" as const },
  { label: "YouTube", href: "#", icon: "youtube" as const },
] as const

export const FOOTER_EMERGENCY = {
  title: "Emergency Support",
  lines: [
    { label: "000", href: "tel:000", description: "Immediate danger" },
    { label: "Lifeline 13 11 14", href: "tel:131114", description: "24/7 crisis support" },
    { label: "Beyond Blue 1300 22 4636", href: "tel:1300224636", description: "Anxiety and depression support" },
  ],
} as const
