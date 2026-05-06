"use client"

import * as React from "react"

import { AdminDataTable, type AdminDataTableColumn } from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminDeletionQueue, type AdminDeletionQueueItem } from "@/src/admin/ops/api"

export default function AdminDataDeletionPage() {
  const [rows, setRows] = React.useState<AdminDeletionQueueItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [stateFilter, setStateFilter] = React.useState<"all" | "deleted" | "legal_hold" | "purge_eligible">("all")

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    void getAdminDeletionQueue(stateFilter)
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load deletion queue.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [stateFilter])

  const columns: AdminDataTableColumn<AdminDeletionQueueItem>[] = [
    { key: "patientId", header: "Patient", sortable: true, sortValue: (row) => row.patientId, renderCell: (row) => row.patientId },
    {
      key: "deletedAt",
      header: "Deleted at",
      sortable: true,
      sortValue: (row) => (row.deletedAt ? new Date(row.deletedAt).getTime() : 0),
      renderCell: (row) => (row.deletedAt ? new Date(row.deletedAt).toLocaleString() : "active"),
    },
    {
      key: "retentionUntil",
      header: "Retention until",
      sortable: true,
      sortValue: (row) => (row.retentionUntil ? new Date(row.retentionUntil).getTime() : 0),
      renderCell: (row) => (row.retentionUntil ? new Date(row.retentionUntil).toLocaleString() : "n/a"),
    },
    { key: "legalHold", header: "Legal hold", sortable: true, sortValue: (row) => (row.legalHoldActive ? 1 : 0), renderCell: (row) => (row.legalHoldActive ? "on" : "off") },
    { key: "purgeEligible", header: "Purge eligible", sortable: true, sortValue: (row) => (row.purgeEligible ? 1 : 0), renderCell: (row) => (row.purgeEligible ? "yes" : "no") },
  ]

  return (
    <OpsShell activeRoute="admin-data-deletion">
      <section className="space-y-6">
        <PatientPageHeader title={opsPagesContent.adminDataDeletion.title} description={opsPagesContent.adminDataDeletion.description} />
        <AdminFilterBar
          searchValue=""
          onSearchChange={() => undefined}
          selects={[
            {
              key: "state",
              label: "Queue state",
              value: stateFilter,
              options: [
                { label: "All", value: "all" },
                { label: "Deleted", value: "deleted" },
                { label: "Legal hold", value: "legal_hold" },
                { label: "Purge eligible", value: "purge_eligible" },
              ],
            },
          ]}
          onSelectChange={(_, value) => setStateFilter(value as "all" | "deleted" | "legal_hold" | "purge_eligible")}
        />
        <AdminDataTable
          rows={rows}
          columns={columns}
          keyExtractor={(row) => row.patientId}
          loading={loading}
          error={error}
          emptyMessage="No records in the current deletion queue filter."
        />
      </section>
    </OpsShell>
  )
}
