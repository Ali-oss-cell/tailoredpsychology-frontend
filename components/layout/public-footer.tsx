import Link from "next/link"
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { PageContainer } from "@/components/layout/page-container"
import { PublicFooterBackToTop } from "@/components/layout/public-footer-back-to-top"
import {
  FOOTER_CRISIS_LINES,
  FOOTER_EXPLORE_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_SUPPORT_LINKS,
  FOOTER_TAGLINE,
  FOOTER_TRUST_BADGES,
} from "@/content/public-footer"
import { publicContactDetails } from "@/content/legal/public-contact"

const socialIconMap = {
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  youtube: YoutubeLogo,
} as const

function FooterLinkGroup({
  title,
  links,
}: {
  title: string
  links: readonly { href: string; label: string }[]
}) {
  return (
    <div>
      <h3 className="text-foreground mb-2 text-xs font-semibold tracking-wide uppercase">{title}</h3>
      <ul className="flex flex-col gap-0.5">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground inline-flex min-h-9 items-center text-sm transition-colors"
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
      <PageContainer className="py-6 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-xs space-y-3">
            <Link href="/" className="inline-flex" aria-label="Tailored Psychology home">
              <ClinkLogo alt="" className="size-8" />
            </Link>
            <p className="text-muted-foreground text-sm leading-snug">{FOOTER_TAGLINE}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {FOOTER_TRUST_BADGES.map((badge, index) => (
                <span key={badge} className="text-muted-foreground inline-flex items-center text-xs">
                  {index > 0 ? (
                    <span className="text-border me-3" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {FOOTER_SOCIAL_LINKS.map((social) => {
                const Icon = socialIconMap[social.icon]
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary inline-flex size-9 items-center justify-center rounded-lg transition-colors"
                    aria-label={`${social.label} (placeholder)`}
                  >
                    <Icon size={18} weight="duotone" aria-hidden />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-10 md:gap-12">
            <FooterLinkGroup title="Explore" links={FOOTER_EXPLORE_LINKS} />
            <FooterLinkGroup title="Support" links={FOOTER_SUPPORT_LINKS} />
          </div>
        </div>

        <div className="border-border/60 mt-6 flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between md:gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {publicContactDetails.entityName}. All rights reserved.
          </p>

          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-foreground font-medium">Need urgent help?</span>{" "}
            {FOOTER_CRISIS_LINES.map((line, index) => (
              <span key={line.href}>
                {index > 0 ? (
                  <span className="text-border mx-1.5" aria-hidden>
                    ·
                  </span>
                ) : null}
                <a
                  href={line.href}
                  className="text-foreground hover:text-primary font-medium underline-offset-2 transition-colors hover:underline"
                >
                  {line.label}
                </a>
              </span>
            ))}
          </p>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label === "Sitemap" ? "Sitemap" : undefined}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
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
