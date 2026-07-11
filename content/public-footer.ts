export type FooterLink = {
  href: string
  label: string
}

export const FOOTER_TAGLINE =
  "Telehealth psychology across Australia — Medicare-aware intake with AHPRA-registered clinicians."

export const FOOTER_TRUST_BADGES = ["AHPRA Registered", "Australia Wide", "Privacy First"] as const

export const FOOTER_EXPLORE_LINKS: readonly FooterLink[] = [
  { href: "/about", label: "About" },
  { href: "/get-matched", label: "Find Psychologist" },
  { href: "/pricing", label: "Pricing" },
  { href: "/conditions", label: "Conditions" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
]

export const FOOTER_SUPPORT_LINKS: readonly FooterLink[] = [
  { href: "/#faq", label: "FAQ" },
  { href: "/medicare-rebates", label: "Medicare" },
  { href: "/login", label: "Patient Portal" },
  { href: "/register", label: "Create Account" },
]

export const FOOTER_LEGAL_LINKS: readonly FooterLink[] = [
  { href: "/privacy-policy", label: "Privacy" },
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

export const FOOTER_CRISIS_LINES = [
  { label: "000", href: "tel:000" },
  { label: "Lifeline 13 11 14", href: "tel:131114" },
  { label: "Beyond Blue 1300 22 4636", href: "tel:1300224636" },
] as const
