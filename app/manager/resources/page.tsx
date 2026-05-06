import { OpsPageTemplate } from "@/components/ops/ops-page-template"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerResourcesPage() {
  return <OpsPageTemplate activeRoute="manager-resources" {...opsPagesContent.managerResources} />
}
