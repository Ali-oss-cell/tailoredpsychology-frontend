import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { legalPublication } from "@/content/legal/legal-publication"
import { termsOfServiceEffectiveDate, termsOfServiceSections } from "@/content/legal/terms-of-service-au"

export default function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
          <div className="border-border/50 border-b py-10 md:py-14">
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <p className="text-primary text-sm font-semibold uppercase tracking-wide">Legal</p>
              <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Terms of Service
              </h1>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
                Service terms for account usage, booking, telehealth access, and billing interactions.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
            <article className="max-w-none">
              {!legalPublication.termsOfServiceApproved ? (
                <p className="text-muted-foreground rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
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
