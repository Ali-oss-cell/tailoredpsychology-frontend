"use client"

import Link from "next/link"
import { UserCircle } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePatientCareTeam } from "@/src/patient/queries/use-patient-care-team"

/** Compact "Your Care Team" sidebar card (Stitch appointments-screen spec). */
export function AppointmentsCareTeamCard() {
  const careTeamQuery = usePatientCareTeam()
  const team = careTeamQuery.data ?? []

  return (
    <Card className="dashboard-card rounded-2xl shadow-e1">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg font-semibold">Your Care Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {careTeamQuery.isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading care team">
            {[0, 1].map((key) => (
              <div key={key} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {careTeamQuery.isError ? (
          <DashboardStateBlock
            variant="error"
            message="Could not load your care team."
            onRetry={() => void careTeamQuery.refetch()}
          />
        ) : null}
        {careTeamQuery.isSuccess && team.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No assigned clinicians yet." />
        ) : null}
        {team.slice(0, 3).map((clinician) => (
          <div key={clinician.clinicianId} className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary-strong flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <UserCircle size={22} weight="duotone" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{clinician.displayName}</p>
              <p className="text-muted-foreground truncate text-xs">
                {clinician.specialties[0] ?? "Psychologist"}
              </p>
            </div>
          </div>
        ))}
        <Link
          href="/patient/my-clinician"
          className="text-primary-strong inline-flex text-sm font-medium underline-offset-2 hover:underline"
        >
          View full team
        </Link>
      </CardContent>
    </Card>
  )
}
