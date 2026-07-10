"use client"

import * as React from "react"
import { CalendarBlank, Queue, UsersThree, UsersFour } from "@phosphor-icons/react/dist/ssr"

import {
  DashboardSummaryCard,
  DashboardSummaryCardsRow,
} from "@/components/shared/dashboard-summary-card"
import {
  getAdminOpsAppointments,
  getAdminOpsPatients,
  getAdminOpsStaff,
} from "@/src/admin/ops/api"
import { getOpsInsights } from "@/src/ops/insights/api"

type OpsDashboardSummaryCardsProps = {
  mode: "manager" | "admin"
}

function isToday(iso: string): boolean {
  const date = new Date(iso)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function OpsDashboardSummaryCards({ mode }: OpsDashboardSummaryCardsProps) {
  const [staffCount, setStaffCount] = React.useState<number | null>(null)
  const [patientCount, setPatientCount] = React.useState<number | null>(null)
  const [appointmentsToday, setAppointmentsToday] = React.useState<number | null>(null)
  const [queueTotal, setQueueTotal] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(true)

  const staffHref = mode === "manager" ? "/manager/staff" : "/admin/staff"
  const patientsHref = mode === "manager" ? "/manager/patients" : "/admin/patients"
  const appointmentsHref = mode === "manager" ? "/manager/appointments" : "/admin/appointments"
  const queueHref = mode === "manager" ? "/manager/dashboard" : "/admin/dashboard"

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)

    void Promise.all([getAdminOpsStaff(), getAdminOpsPatients(), getAdminOpsAppointments(), getOpsInsights()])
      .then(([staff, patients, appointments, insights]) => {
        if (cancelled) return
        const activeStaff = staff.filter((member) => member.status.toLowerCase() === "active").length
        setStaffCount(activeStaff)
        setPatientCount(patients.length)
        setAppointmentsToday(appointments.filter((item) => isToday(item.scheduledStartAt)).length)
        setQueueTotal(insights.queueTotal)
      })
      .catch(() => {
        if (!cancelled) {
          setStaffCount(null)
          setPatientCount(null)
          setAppointmentsToday(null)
          setQueueTotal(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mode])

  const staffValue =
    staffCount === null ? "—" : staffCount === 0 ? "No staff" : `${staffCount} active`

  const patientsValue =
    patientCount === null ? "—" : patientCount === 0 ? "No patients" : `${patientCount} on file`

  const appointmentsValue =
    appointmentsToday === null
      ? "—"
      : appointmentsToday === 0
        ? "None today"
        : `${appointmentsToday} today`

  const queueValue =
    queueTotal === null ? "—" : queueTotal === 0 ? "All clear" : `${queueTotal} in queue`

  return (
    <DashboardSummaryCardsRow aria-label="Operations summary" data-tutorial={`${mode}.dashboard.summary-cards`}>
      <DashboardSummaryCard
        title="Staff"
        value={staffValue}
        href={staffHref}
        linkLabel="View staff"
        icon={<UsersFour size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <DashboardSummaryCard
        title="Patients"
        value={patientsValue}
        href={patientsHref}
        linkLabel="View patients"
        icon={<UsersThree size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <DashboardSummaryCard
        title="Appointments today"
        value={appointmentsValue}
        href={appointmentsHref}
        linkLabel="View schedule"
        icon={<CalendarBlank size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <DashboardSummaryCard
        title="Pending queues"
        value={queueValue}
        href={queueHref}
        linkLabel="View queues"
        icon={<Queue size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
    </DashboardSummaryCardsRow>
  )
}
