"use client"

import * as React from "react"

import { AdminDataTable, type AdminDataTableColumn } from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminOpsPatients, type AdminPatientItem } from "@/src/admin/ops/api"

export default function AdminPatientsPage() {
  const [rows, setRows] = React.useState<AdminPatientItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [retentionStatus, setRetentionStatus] = React.useState("all")

  React.useEffect(() => {
    let cancelled = false
    void getAdminOpsPatients()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load patients.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = rows.filter((row) => {
    if (retentionStatus !== "all" && row.retentionStatus !== retentionStatus) return false
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return row.displayName.toLowerCase().includes(term) || row.email.toLowerCase().includes(term) || row.patientId.toLowerCase().includes(term)
  })

  const columns: AdminDataTableColumn<AdminPatientItem>[] = [
    { key: "patientId", header: "Patient ID", sortable: true, sortValue: (row) => row.patientId, renderCell: (row) => row.patientId },
    { key: "name", header: "Name", sortable: true, sortValue: (row) => row.displayName, renderCell: (row) => row.displayName },
    { key: "email", header: "Email", sortable: true, sortValue: (row) => row.email, renderCell: (row) => row.email },
    { key: "intake", header: "Intake", sortable: true, sortValue: (row) => row.intakeState, renderCell: (row) => row.intakeState },
    { key: "retention", header: "Retention", sortable: true, sortValue: (row) => row.retentionStatus, renderCell: (row) => row.retentionStatus },
    { key: "legalHold", header: "Legal hold", sortable: true, sortValue: (row) => (row.legalHoldActive ? 1 : 0), renderCell: (row) => (row.legalHoldActive ? "on" : "off") },
  ]

  return (
    <OpsShell activeRoute="admin-patients">
      <section className="space-y-6">
        <PatientPageHeader title={opsPagesContent.adminPatients.title} description={opsPagesContent.adminPatients.description} />
        <AdminFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, or patient ID"
          selects={[
            {
              key: "retentionStatus",
              label: "Retention status",
              value: retentionStatus,
              options: [
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Deleted", value: "deleted" },
                { label: "Legal hold", value: "legal_hold" },
                { label: "Purge pending", value: "purge_pending" },
              ],
            },
          ]}
          onSelectChange={(key, value) => {
            if (key === "retentionStatus") setRetentionStatus(value)
          }}
          onClear={() => {
            setSearch("")
            setRetentionStatus("all")
          }}
        />
        <AdminDataTable
          rows={filtered}
          columns={columns}
          keyExtractor={(row) => row.patientId}
          loading={loading}
          error={error}
          emptyMessage="No patients matched the current filters."
        />
      </section>
    </OpsShell>
  )
}
