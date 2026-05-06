import { PublicDetailPage } from "@/components/marketing/public-detail-page"
import { getMatchedPageContent } from "@/content/pages/get-matched"

export default function GetMatchedPage() {
  return <PublicDetailPage content={getMatchedPageContent} />
}
