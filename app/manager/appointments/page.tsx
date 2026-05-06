import { OpsPageTemplate } from "@/components/ops/ops-page-template"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerAppointmentsPage() {
  return <OpsPageTemplate activeRoute="manager-appointments" {...opsPagesContent.managerAppointments} />
}
