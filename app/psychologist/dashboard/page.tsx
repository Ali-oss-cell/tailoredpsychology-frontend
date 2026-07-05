import { PsychologistDashboardView } from "@/components/psychologist/dashboard/psychologist-dashboard-view"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"

export default function PsychologistDashboardPage() {
  return (
    <PsychologistShell activeRoute="dashboard">
      <PsychologistDashboardView />
    </PsychologistShell>
  )
}
