import { OpsPageTemplate } from "@/components/ops/ops-page-template"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerStaffPage() {
  return <OpsPageTemplate activeRoute="manager-staff" {...opsPagesContent.managerStaff} />
}
