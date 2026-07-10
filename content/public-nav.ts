export type PublicNavLink = {
  href: string
  label: string
  description?: string
}

export type PublicNavMegaMenu = {
  id: "services" | "resources"
  label: string
  href: string
  description?: string
  items: readonly PublicNavLink[]
}

export type PublicNavItem =
  | ({ type: "link" } & PublicNavLink)
  | ({ type: "mega" } & PublicNavMegaMenu)

export const PUBLIC_NAV_MEGA_MENUS = {
  services: {
    id: "services",
    type: "mega" as const,
    label: "Services",
    href: "/services",
    description: "Therapy formats and condition-specific care pathways.",
    items: [
      { href: "/services", label: "Individual Therapy", description: "One-on-one psychology sessions." },
      { href: "/services", label: "Couples Therapy", description: "Relationship and communication support." },
      { href: "/services", label: "Child Psychology", description: "Youth and family pathways." },
      { href: "/conditions/adhd", label: "ADHD Support", description: "Attention and executive function care." },
      { href: "/conditions/anxiety", label: "Anxiety Support", description: "Worry, panic, and stress pathways." },
      { href: "/conditions/depression", label: "Depression Support", description: "Low mood and motivation care." },
      { href: "/conditions/trauma-ptsd", label: "Trauma & PTSD", description: "Trauma-informed recovery support." },
    ],
  },
  resources: {
    id: "resources",
    type: "mega" as const,
    label: "Resources",
    href: "/resources",
    description: "Guides, rebates, and support between sessions.",
    items: [
      { href: "/resources", label: "Articles", description: "Educational reads and tools." },
      { href: "/#faq", label: "FAQ", description: "Common questions about care." },
      { href: "/medicare-rebates", label: "Medicare", description: "Rebates and Mental Health Treatment Plans." },
      { href: "/telehealth-requirements", label: "Telehealth Guide", description: "What you need for secure video sessions." },
      { href: "/resources", label: "Emergency Resources", description: "Crisis numbers and after-hours support." },
    ],
  },
} as const

export const PUBLIC_PRIMARY_NAV_ITEMS: readonly PublicNavItem[] = [
  PUBLIC_NAV_MEGA_MENUS.services,
  { type: "link", href: "/conditions", label: "Conditions" },
  { type: "link", href: "/pricing", label: "Pricing" },
  PUBLIC_NAV_MEGA_MENUS.resources,
  { type: "link", href: "/about", label: "About" },
] as const

export const PUBLIC_SECONDARY_NAV_ITEMS: readonly PublicNavLink[] = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/trust", label: "Trust" },
] as const

export const PUBLIC_MOBILE_SUPPORT_LINKS: readonly PublicNavLink[] = [
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Patient Portal" },
  { href: "/register", label: "Create Account" },
] as const

/** @deprecated Use PUBLIC_PRIMARY_NAV_ITEMS — kept for gradual migration in tests */
export const PUBLIC_NAV_ITEMS: readonly PublicNavLink[] = PUBLIC_PRIMARY_NAV_ITEMS.flatMap((item) =>
  item.type === "link"
    ? [{ href: item.href, label: item.label }]
    : [{ href: item.href, label: item.label }],
)

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) {
    return pathname === "/"
  }
  if (pathname === href) return true
  if (href === "/conditions" && pathname.startsWith("/conditions/")) return true
  if (href === "/services" && pathname === "/services") return true
  if (href === "/resources" && pathname === "/resources") return true
  if (href === "/about" && pathname === "/about") return true
  if (href === "/trust" && pathname === "/trust") return true
  if (href === "/medicare-rebates" && pathname.startsWith("/medicare-rebates")) return true
  if (href === "/telehealth-requirements" && pathname.startsWith("/telehealth-requirements")) return true
  return false
}

export function isNavMegaActive(pathname: string, menu: PublicNavMegaMenu): boolean {
  if (isNavLinkActive(pathname, menu.href)) return true
  return menu.items.some((item) => {
    if (item.href.startsWith("/#")) return false
    if (pathname === item.href) return true
    if (item.href.startsWith("/conditions/") && pathname.startsWith("/conditions/")) {
      return pathname === item.href
    }
    return false
  })
}

export function isNavItemActive(pathname: string, href: string): boolean {
  return isNavLinkActive(pathname, href)
}
