import Link from "next/link"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { PageContainer } from "@/components/layout/page-container"

const footerLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/telehealth-requirements", label: "Telehealth Requirements" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
]

export function PublicFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <PageContainer className="flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="mb-2 inline-flex" aria-label="Tailored Psychology home">
            <ClinkLogo alt="" className="size-10" />
          </Link>
          <p className="text-muted-foreground text-sm">
            Psychology care with intention and clarity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </PageContainer>
    </footer>
  )
}
