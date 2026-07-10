import Link from "next/link"
import {
  FacebookLogo,
  FirstAid,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { PageContainer } from "@/components/layout/page-container"
import { PublicFooterAccordion } from "@/components/layout/public-footer-accordion"
import { PublicFooterBackToTop } from "@/components/layout/public-footer-back-to-top"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  FOOTER_COLUMNS,
  FOOTER_EMERGENCY,
  FOOTER_LEGAL_LINKS,
  FOOTER_MISSION,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TRUST_BADGES,
} from "@/content/public-footer"
import { publicContactDetails } from "@/content/legal/public-contact"
import { cn } from "@/lib/utils"

const socialIconMap = {
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  youtube: YoutubeLogo,
} as const

function FooterLinkColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/70 bg-marketing-canvas">
      <PageContainer className="py-12 md:py-16">
        <div className="hidden gap-8 md:grid md:grid-cols-3 lg:grid-cols-6 lg:gap-6 xl:gap-8">
          <div className="space-y-4 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label="Tailored Psychology home">
              <ClinkLogo alt="" className="size-10" />
            </Link>
            <p className="marketing-small">{FOOTER_MISSION}</p>
            <ul className="flex flex-wrap gap-2" aria-label="Trust indicators">
              {FOOTER_TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="bg-card text-muted-foreground rounded-full border border-border/60 px-3 py-1 text-xs font-medium"
                >
                  {badge}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {FOOTER_SOCIAL_LINKS.map((social) => {
                const Icon = socialIconMap[social.icon]
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="bg-card text-muted-foreground hover:text-foreground inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-e1"
                    aria-label={`${social.label} (placeholder)`}
                  >
                    <Icon size={20} weight="duotone" aria-hidden />
                  </Link>
                )
              })}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <FooterLinkColumn key={column.id} title={column.title} links={column.links} />
          ))}

          <div className="space-y-3 md:col-span-3 lg:col-span-1">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="marketing-small">
              Occasional updates on telehealth psychology, Medicare guidance, and new resources.
            </p>
            <form
              className="flex flex-col gap-2"
              aria-label="Newsletter signup placeholder"
              action="#"
            >
              <Input
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                className="bg-card min-h-11 rounded-xl"
                disabled
              />
              <Button type="submit" variant="secondary" className="min-h-11 rounded-xl" disabled>
                Subscribe
              </Button>
            </form>
            <p className="text-muted-foreground text-xs leading-relaxed">
              By subscribing you agree to our{" "}
              <Link href="/privacy-policy" className="text-foreground underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              . Unsubscribe anytime. UI placeholder only.
            </p>
          </div>
        </div>

        <div className="space-y-5 md:hidden">
          <div className="space-y-4">
            <Link href="/" className="inline-flex" aria-label="Tailored Psychology home">
              <ClinkLogo alt="" className="size-10" />
            </Link>
            <p className="marketing-small">{FOOTER_MISSION}</p>
            <ul className="flex flex-wrap gap-2" aria-label="Trust indicators">
              {FOOTER_TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="bg-card text-muted-foreground rounded-full border border-border/60 px-3 py-1 text-xs font-medium"
                >
                  {badge}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {FOOTER_SOCIAL_LINKS.map((social) => {
                const Icon = socialIconMap[social.icon]
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="bg-card text-muted-foreground hover:text-foreground inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/60 transition-all duration-200"
                    aria-label={`${social.label} (placeholder)`}
                  >
                    <Icon size={20} weight="duotone" aria-hidden />
                  </Link>
                )
              })}
            </div>
          </div>
          <PublicFooterAccordion columns={FOOTER_COLUMNS} />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="marketing-small">
              Occasional updates on telehealth psychology, Medicare guidance, and new resources.
            </p>
            <form className="flex flex-col gap-2" aria-label="Newsletter signup placeholder" action="#">
              <Input
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                className="bg-card min-h-11 rounded-xl"
                disabled
              />
              <Button type="submit" variant="secondary" className="min-h-11 rounded-xl" disabled>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div
          className={cn(
            "border-destructive/20 bg-destructive/5 mt-10 rounded-2xl border p-5 md:p-6",
            "flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5",
          )}
          role="region"
          aria-label="Emergency support"
        >
          <div className="bg-destructive/10 text-destructive flex size-11 shrink-0 items-center justify-center rounded-xl">
            <FirstAid size={24} weight="duotone" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-destructive text-base font-semibold">{FOOTER_EMERGENCY.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              If you or someone you know is in immediate danger, call emergency services. For crisis
              support, these services are available 24/7 across Australia.
            </p>
            <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              {FOOTER_EMERGENCY.lines.map((line) => (
                <li key={line.href}>
                  <a
                    href={line.href}
                    className="bg-card hover:border-destructive/30 inline-flex min-h-11 flex-col justify-center rounded-xl border border-border/60 px-4 py-2 transition-colors"
                  >
                    <span className="text-foreground text-sm font-semibold">{line.label}</span>
                    <span className="text-muted-foreground text-xs">{line.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border/60 mt-10 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {new Date().getFullYear()} {publicContactDetails.entityName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label === "Sitemap" ? "Sitemap" : undefined}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors md:text-sm"
              >
                {link.label}
              </Link>
            ))}
            <PublicFooterBackToTop />
          </nav>
        </div>
      </PageContainer>
    </footer>
  )
}
