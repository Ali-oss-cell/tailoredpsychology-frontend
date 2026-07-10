import { PublicDetailPage } from "@/components/marketing/public-detail-page"
import { aboutPageContent } from "@/content/pages/about"
import { aboutMetadata } from "@/content/marketing-metadata"

export const metadata = aboutMetadata

export default function AboutPage() {
  return <PublicDetailPage content={aboutPageContent} />
}
