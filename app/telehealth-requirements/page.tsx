import { PublicDetailPage } from "@/components/marketing/public-detail-page"
import { telehealthRequirementsPageContent } from "@/content/pages/telehealth-requirements"
import { telehealthRequirementsMetadata } from "@/content/marketing-metadata"

export const metadata = telehealthRequirementsMetadata

export default function TelehealthRequirementsPage() {
  return <PublicDetailPage content={telehealthRequirementsPageContent} />
}
