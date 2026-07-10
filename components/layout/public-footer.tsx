import Link from "next/link"
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { PageContainer } from "@/components/layout/page-container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { hasPublishedContactDetails, publicContactDetails } from "@/content/legal/public-contact"

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/why-clink", label: "Why Tailored Psychology" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "Services" },
      { href: "/conditions", label: "Conditions" },
      { href: "/get-matched", label: "Find a psychologist" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Resources" },
      { href: "/medicare-rebates", label: "Medicare rebates" },
      { href: "/telehealth-requirements", label: "Telehealth requirements" },
    ],
  },
  {
    title: "Privacy",
    links: [
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms-of-service", label: "Terms of service" },
      { href: "/trust", label: "Trust & security" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help centre" },
      { href: "/login", label: "Patient login" },
      { href: "/register", label: "Create account" },
    ],
  },
] as const

const socialPlaceholders = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
] as const

export function PublicFooter() {
  return (
    <footer className="border-t border-border/70 bg-marketing-canvas">
      <PageContainer className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-14">
          <div className="space-y-5">
            <Link href="/" className="inline-flex" aria-label="Tailored Psychology home">
              <ClinkLogo alt="" className="size-10" />
            </Link>
            <p className="marketing-small max-w-sm">
              Psychology care with intention and clarity — telehealth across Australia with
              Medicare-aware intake.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Contact</p>
              {hasPublishedContactDetails() ? (
                <>
                  {publicContactDetails.generalEmail.trim() ? (
                    <a
                      href={`mailto:${publicContactDetails.generalEmail.trim()}`}
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
                    >
                      <EnvelopeSimple size={16} aria-hidden />
                      {publicContactDetails.generalEmail.trim()}
                    </a>
                  ) : null}
                  {publicContactDetails.phone.trim() ? (
                    <a
                      href={`tel:${publicContactDetails.phone.replace(/\s/g, "")}`}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                    >
                      <Phone size={16} aria-hidden />
                      {publicContactDetails.phone.trim()}
                    </a>
                  ) : null}
                </>
              ) : (
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
                >
                  <EnvelopeSimple size={16} aria-hidden />
                  Contact our team
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {socialPlaceholders.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground text-sm underline-offset-2 hover:underline"
                  aria-label={`${social.label} (placeholder)`}
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-sm font-semibold">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border/60 mt-10 grid gap-6 border-t pt-8 md:grid-cols-2 md:items-end">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Stay in touch</h3>
            <p className="marketing-small">
              Newsletter signup — UI placeholder only; no emails are sent yet.
            </p>
            <form className="flex max-w-md gap-2" aria-label="Newsletter signup placeholder" action="#">
              <Input
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                className="bg-card"
                disabled
              />
              <Button type="submit" variant="secondary" disabled>
                Subscribe
              </Button>
            </form>
          </div>
          <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 md:p-5">
            <h3 className="text-destructive text-sm font-semibold">Emergency resources</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              If you or someone you know is in immediate danger, call{" "}
              <a href="tel:000" className="text-foreground font-semibold underline-offset-2 hover:underline">
                000
              </a>
              . For crisis support, Lifeline is available 24/7 on{" "}
              <a
                href="tel:131114"
                className="text-foreground font-semibold underline-offset-2 hover:underline"
              >
                13 11 14
              </a>
              .
            </p>
          </div>
        </div>

        <p className="text-muted-foreground mt-8 text-center text-xs md:text-sm">
          © {new Date().getFullYear()} {publicContactDetails.entityName}. All rights reserved.
        </p>
      </PageContainer>
    </footer>
  )
}
