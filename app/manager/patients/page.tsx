import { OpsPageTemplate } from "@/components/ops/ops-page-template"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerPatientsPage() {
  return <OpsPageTemplate activeRoute="manager-patients" {...opsPagesContent.managerPatients} />
}
