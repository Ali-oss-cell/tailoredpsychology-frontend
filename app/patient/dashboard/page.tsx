import { QuickActionsCard } from "@/components/patient/dashboard/quick-actions-card"
import { ResourceRecommendationsCard } from "@/components/patient/dashboard/resource-recommendations-card"
import { PatientDashboardUpcomingSession } from "@/components/patient/dashboard/patient-dashboard-upcoming-session"
import { PatientJourneyTimelineCard } from "@/components/patient/dashboard/patient-journey-timeline-card"
import Link from "next/link"

import { PatientShell } from "@/components/patient/patient-shell"
import { PatientTelehealth101Cta } from "@/components/tutorials/patient-telehealth-101-cta"
import { PatientTutorialOnboardingCta } from "@/components/tutorials/patient-tutorial-onboarding-cta"
import { patientDashboardContent } from "@/content/patient-dashboard"

export default function PatientDashboardPage() {
  return (
    <PatientShell activeRoute="dashboard">
      <section className="space-y-6" data-tutorial="patient.page.dashboard">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {patientDashboardContent.greeting.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            {patientDashboardContent.greeting.description}
          </p>
        </header>

        <PatientTutorialOnboardingCta />

        <PatientTelehealth101Cta />

        <p className="text-muted-foreground text-sm">
          <span data-tutorial="patient.dashboard.video-setup-link">
            <Link href="/patient/video-setup" className="text-primary font-medium underline-offset-2 hover:underline">
              Test camera & microphone
            </Link>
          </span>{" "}
          before a video visit.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <PatientDashboardUpcomingSession />
          <QuickActionsCard actions={patientDashboardContent.quickActions} />
          <ResourceRecommendationsCard items={patientDashboardContent.resources} />
          <PatientJourneyTimelineCard />
        </div>
      </section>
    </PatientShell>
  )
}
