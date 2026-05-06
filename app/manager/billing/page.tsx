import { OpsPageTemplate } from "@/components/ops/ops-page-template"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerBillingPage() {
  return <OpsPageTemplate activeRoute="manager-billing" {...opsPagesContent.managerBilling} />
}
