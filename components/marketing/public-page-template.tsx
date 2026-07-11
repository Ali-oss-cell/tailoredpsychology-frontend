import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { InfoSection } from "@/components/marketing/info-section"
import { PageHero } from "@/components/marketing/page-hero"

type PublicPageTemplateProps = {
  eyebrow: string
  title: string
  description: string
  infoTitle: string
  infoBody: string
  featureTitle: string
  features: Array<{ title: string; description: string }>
}

export function PublicPageTemplate({
  eyebrow,
  title,
  description,
  infoTitle,
  infoBody,
  featureTitle,
  features,
}: PublicPageTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="relative overflow-x-clip">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
        <PageHero eyebrow={eyebrow} title={title} description={description} />
        <InfoSection title={infoTitle} body={infoBody} muted />
        <FeatureGrid title={featureTitle} items={features} />
        <CtaStrip
          title="Ready to take the next step?"
          description="Book a consultation or speak with our team to find the best pathway."
          primaryHref="/get-matched"
          primaryLabel="Get Matched"
          secondaryHref="/contact"
          secondaryLabel="Contact Us"
        />
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
