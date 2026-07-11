import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { PageHero } from "@/components/marketing/page-hero"
import { legalPublication } from "@/content/legal/legal-publication"
import { termsOfServiceEffectiveDate, termsOfServiceSections } from "@/content/legal/terms-of-service-au"
import { termsMetadata } from "@/content/marketing-metadata"

export const metadata = termsMetadata

export default function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-clip">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
          <PageHero
            eyebrow="Legal"
            title="Terms of Service"
            description="Service terms for account usage, booking, telehealth access, and billing interactions."
          />
          <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
            <article className="max-w-none">
              {!legalPublication.termsOfServiceApproved ? (
                <p className="text-muted-foreground rounded-lg border border-warning bg-warning/10 px-4 py-3 text-sm leading-relaxed">
                  <strong>Pending legal sign-off.</strong> Confirm final counsel approval in
                  `frontend/docs/LEGAL_SIGNOFF_TRACKER.md` before production publication.
                </p>
              ) : null}
              <p className="text-muted-foreground mt-4 text-sm">Last updated: {termsOfServiceEffectiveDate}</p>
              <hr className="my-8 border-border" />
              {termsOfServiceSections.map((section) => (
                <section key={section.id} id={section.id} className="mb-10 scroll-mt-24">
                  <h2 className="font-heading text-xl font-semibold tracking-tight">{section.title}</h2>
                  <div className="text-muted-foreground mt-3 space-y-3 text-sm leading-relaxed md:text-base">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`${section.id}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
