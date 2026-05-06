"use client"

import * as React from "react"

import { AdminDataTable, type AdminDataTableColumn } from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminOpsSettings, type AdminSettingsDomain } from "@/src/admin/ops/api"

export default function AdminSettingsPage() {
  const [rows, setRows] = React.useState<AdminSettingsDomain[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    void getAdminOpsSettings()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load settings domains.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = rows.filter((row) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return row.key.toLowerCase().includes(term) || row.value.toLowerCase().includes(term)
  })

  const columns: AdminDataTableColumn<AdminSettingsDomain>[] = [
    { key: "key", header: "Domain", sortable: true, sortValue: (row) => row.key, renderCell: (row) => row.key },
    { key: "value", header: "Value", sortable: true, sortValue: (row) => row.value, renderCell: (row) => row.value },
    { key: "editable", header: "Editable", sortable: true, sortValue: (row) => (row.editable ? 1 : 0), renderCell: (row) => (row.editable ? "yes" : "no") },
  ]

  return (
    <OpsShell activeRoute="admin-settings">
      <section className="space-y-6">
        <PatientPageHeader title={opsPagesContent.adminSettings.title} description={opsPagesContent.adminSettings.description} />
        <AdminFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search setting domain or value"
          onClear={() => setSearch("")}
        />
        <AdminDataTable
          rows={filtered}
          columns={columns}
          keyExtractor={(row) => row.key}
          loading={loading}
          error={error}
          emptyMessage="No settings domains matched your search."
        />
      </section>
    </OpsShell>
  )
}
