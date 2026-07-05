"use client"

import * as React from "react"

import { AdminDataTable, type AdminDataTableColumn } from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsShell } from "@/components/ops/ops-shell"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminOpsAppointments, type AdminAppointmentItem } from "@/src/admin/ops/api"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"

export default function AdminAppointmentsPage() {
  const [rows, setRows] = React.useState<AdminAppointmentItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = useUrlSearchQuery()
  const [status, setStatus] = React.useState("all")

  React.useEffect(() => {
    let cancelled = false
    void getAdminOpsAppointments()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load appointments.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = rows.filter((row) => {
    if (status !== "all" && row.status !== status) return false
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      row.patientName.toLowerCase().includes(term) ||
      row.clinicianName.toLowerCase().includes(term) ||
      row.appointmentId.toLowerCase().includes(term)
    )
  })

  const columns: AdminDataTableColumn<AdminAppointmentItem>[] = [
    { key: "appointment", header: "Appointment", sortable: true, sortValue: (row) => row.appointmentId, renderCell: (row) => row.appointmentId },
    { key: "patient", header: "Patient", sortable: true, sortValue: (row) => row.patientName, renderCell: (row) => row.patientName },
    { key: "clinician", header: "Clinician", sortable: true, sortValue: (row) => row.clinicianName, renderCell: (row) => row.clinicianName },
    {
      key: "start",
      header: "Scheduled",
      sortable: true,
      sortValue: (row) => new Date(row.scheduledStartAt).getTime(),
      renderCell: (row) => new Date(row.scheduledStartAt).toLocaleString(),
    },
    { key: "status", header: "Status", sortable: true, sortValue: (row) => row.status, renderCell: (row) => row.status },
  ]

  return (
    <OpsShell activeRoute="admin-appointments">
      <OpsPortalPage eyebrow="Administration"
        title={opsPagesContent.adminAppointments.title} description={opsPagesContent.adminAppointments.description}>
        <AdminFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by patient, clinician, or appointment ID"
          selects={[
            {
              key: "status",
              label: "Status",
              value: status,
              options: [
                { label: "All", value: "all" },
                { label: "Scheduled", value: "scheduled" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ],
            },
          ]}
          onSelectChange={(key, value) => {
            if (key === "status") setStatus(value)
          }}
          onClear={() => {
            setSearch("")
            setStatus("all")
          }}
        />
        <AdminDataTable
          rows={filtered}
          columns={columns}
          keyExtractor={(row) => row.appointmentId}
          loading={loading}
          error={error}
          emptyMessage="No appointments matched the current filters."
        />
      </OpsPortalPage>
    </OpsShell>
  )
}
