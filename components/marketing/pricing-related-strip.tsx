import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

const LINKS = [
  { href: "/medicare-rebates?source=pricing", label: "Medicare rebates guide" },
  { href: "/trust?source=pricing", label: "Trust & safety" },
  { href: "/why-clink?source=pricing", label: "Why Tailored Psychology" },
] as const

export function PricingRelatedStrip() {
  return (
    <PageSection className="py-10 md:py-12">
      <PageContainer>
        <div className="border-border/60 flex flex-col gap-3 rounded-2xl border bg-muted/20 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Related pages</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Related marketing pages">
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-primary inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
              >
                {item.label}
                <ArrowRight size={16} weight="bold" aria-hidden className="shrink-0 opacity-80" />
              </Link>
            ))}
          </nav>
        </div>
      </PageContainer>
    </PageSection>
  )
}
