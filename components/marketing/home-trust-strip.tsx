import Link from "next/link"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { publicContactDetails } from "@/content/legal/public-contact"
import { cn } from "@/lib/utils"

type HomeTrustStripProps = {
  className?: string
}

const trustLinks = [
  { href: "/trust", label: "Trust & security" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms-of-service", label: "Terms of service" },
] as const

export function HomeTrustStrip({ className }: HomeTrustStripProps) {
  return (
    <section
      className={cn(
        "border-border/60 bg-muted/25 border-y py-4",
        className,
      )}
      aria-label="Trust and legal information"
    >
      <PageContainer>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 sm:items-center">
            <ShieldCheck size={20} weight="duotone" className="text-primary mt-0.5 shrink-0 sm:mt-0" aria-hidden />
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-medium">{publicContactDetails.entityName}</span>
              {" — "}
              Australian telehealth psychology with privacy-first design and clinician governance.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Legal and trust links">
            {trustLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary font-medium underline-offset-2 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </PageContainer>
    </section>
  )
}
