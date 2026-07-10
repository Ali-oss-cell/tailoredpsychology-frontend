import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { PageHero } from "@/components/marketing/page-hero"
import { PrivacyPolicyDocument } from "@/components/legal/privacy-policy-document"
import { privacyPolicySections } from "@/content/legal/privacy-policy-au"
import { privacyPolicyMetadata } from "@/content/marketing-metadata"

export const metadata = privacyPolicyMetadata

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
          <PageHero
            eyebrow="Legal"
            title="Privacy Policy (Australia)"
            description="How we handle personal information—including health information—in connection with Tailored Psychology."
          />
          <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
            <PrivacyPolicyDocument sections={privacyPolicySections} />
          </div>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
