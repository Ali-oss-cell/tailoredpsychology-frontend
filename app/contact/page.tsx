import { PublicDetailPage } from "@/components/marketing/public-detail-page"
import { PublicContactDetailsSection } from "@/components/legal/public-contact-details-section"
import { contactPageContent } from "@/content/pages/contact"
import { contactMetadata } from "@/content/marketing-metadata"

export const metadata = contactMetadata

export default function ContactPage() {
  return (
    <PublicDetailPage content={contactPageContent} afterHeroSlot={<PublicContactDetailsSection />} />
  )
}
