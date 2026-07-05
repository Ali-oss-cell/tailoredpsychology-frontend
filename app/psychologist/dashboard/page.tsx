import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { NotesQueueCard } from "@/components/psychologist/dashboard/notes-queue-card"
import { OpsBentoCard } from "@/components/psychologist/dashboard/ops-bento-card"
import { PreSessionWorkspaceCard } from "@/components/psychologist/dashboard/pre-session-workspace-card"
import { SessionsOverviewCard } from "@/components/psychologist/dashboard/sessions-overview-card"
import { TodayScheduleCard } from "@/components/psychologist/dashboard/today-schedule-card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { psychologistDashboardContent } from "@/content/psychologist-dashboard"

export default function PsychologistDashboardPage() {
  return (
    <PsychologistShell activeRoute="dashboard">
      <section className="space-y-6">
        <PatientPageHeader
          title={psychologistDashboardContent.greeting.title}
          description={psychologistDashboardContent.greeting.description}
          eyebrow="Clinician workspace"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <SessionsOverviewCard />
          <OpsBentoCard items={psychologistDashboardContent.operations} />
          <TodayScheduleCard />
          <NotesQueueCard />
          <PreSessionWorkspaceCard />
        </div>
      </section>
    </PsychologistShell>
  )
}
