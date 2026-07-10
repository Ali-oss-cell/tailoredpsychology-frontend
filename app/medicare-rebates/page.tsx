import { PublicDetailPage } from "@/components/marketing/public-detail-page"
import { medicareRebatesPageContent } from "@/content/pages/medicare-rebates"
import { medicareRebatesMetadata } from "@/content/marketing-metadata"

export const metadata = medicareRebatesMetadata

export default function MedicareRebatesPage() {
  return <PublicDetailPage content={medicareRebatesPageContent} />
}
