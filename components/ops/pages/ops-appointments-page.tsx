"use client"

import * as React from "react"

import {
  AdminDataTable,
  type AdminDataTableColumn,
} from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"
import { opsPagesContent } from "@/content/ops-pages"
import { formatDateTimeAu } from "@/src/lib/format-au"
import type { AdminAppointmentItem } from "@/src/admin/ops/api"
import { useOpsAppointments } from "@/src/admin/ops/queries/use-ops-appointments"

type OpsRole = "manager" | "admin"

const appointmentColumns: AdminDataTableColumn<AdminAppointmentItem>[] = [
  {
    key: "appointment",
    header: "Appointment",
    sortable: true,
    sortValue: (row) => row.appointmentId,
    renderCell: (row) => row.appointmentId,
  },
  {
    key: "patient",
    header: "Patient",
    sortable: true,
    sortValue: (row) => row.patientName,
    renderCell: (row) => row.patientName,
  },
  {
    key: "clinician",
    header: "Clinician",
    sortable: true,
    sortValue: (row) => row.clinicianName,
    renderCell: (row) => row.clinicianName,
  },
  {
    key: "start",
    header: "Scheduled",
    sortable: true,
    sortValue: (row) => new Date(row.scheduledStartAt).getTime(),
    renderCell: (row) => formatDateTimeAu(row.scheduledStartAt),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortValue: (row) => row.status,
    renderCell: (row) => row.status,
  },
]

export function OpsAppointmentsPage({ role }: { role: OpsRole }) {
  const { data: rows = [], isLoading, error } = useOpsAppointments()
  const [search, setSearch] = useUrlSearchQuery()
  const [status, setStatus] = React.useState("all")
  const copy = role === "manager" ? opsPagesContent.managerAppointments : opsPagesContent.adminAppointments

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

  return (
    <OpsPortalPage
      eyebrow={role === "manager" ? "Operations" : "Administration"}
      title={copy.title}
      description={copy.description}
      tutorialId={role === "manager" ? "manager.page.appointments" : undefined}
    >
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
        resultCount={filtered.length}
        resultLabel="appointments"
      />
      <AdminDataTable
        rows={filtered}
        columns={appointmentColumns}
        keyExtractor={(row) => row.appointmentId}
        loading={isLoading}
        error={error ? "Could not load appointments." : null}
        emptyMessage="No appointments matched the current filters."
      />
    </OpsPortalPage>
  )
}
