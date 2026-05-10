import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { PrivacyPolicyDocument } from "@/components/legal/privacy-policy-document"
import { privacyPolicySections } from "@/content/legal/privacy-policy-au"

export default function PrivacyPolicyPage() {
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
                Privacy Policy (Australia)
              </h1>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
                How we handle personal information—including health information—in connection with Tailored Psychology.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
            <PrivacyPolicyDocument sections={privacyPolicySections} />
          </div>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
