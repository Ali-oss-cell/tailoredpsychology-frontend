export type PublicNavItem = {
  href: string
  label: string
  /** Reserved for mobile sheet / tooltips later */
  description?: string
}

export const PUBLIC_NAV_ITEMS: readonly PublicNavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/why-clink", label: "Why Clink" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust" },
  { href: "/conditions", label: "Conditions" },
  { href: "/medicare-rebates", label: "Medicare" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const

export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true
  if (href === "/conditions" && pathname.startsWith("/conditions/")) return true
  return false
}
