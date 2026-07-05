"use client"

import * as React from "react"

import { AdminDataTable, type AdminDataTableColumn } from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsShell } from "@/components/ops/ops-shell"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminOpsStaff, type AdminStaffItem } from "@/src/admin/ops/api"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"

export default function AdminStaffPage() {
  const [rows, setRows] = React.useState<AdminStaffItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = useUrlSearchQuery()
  const [role, setRole] = React.useState("all")

  React.useEffect(() => {
    let cancelled = false
    void getAdminOpsStaff()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load staff.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = rows.filter((row) => {
    if (role !== "all" && row.role !== role) return false
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return row.displayName.toLowerCase().includes(term) || row.email.toLowerCase().includes(term) || row.userId.toLowerCase().includes(term)
  })

  const columns: AdminDataTableColumn<AdminStaffItem>[] = [
    { key: "userId", header: "User ID", sortable: true, sortValue: (row) => row.userId, renderCell: (row) => row.userId },
    { key: "name", header: "Name", sortable: true, sortValue: (row) => row.displayName, renderCell: (row) => row.displayName },
    { key: "email", header: "Email", sortable: true, sortValue: (row) => row.email, renderCell: (row) => row.email },
    { key: "role", header: "Role", sortable: true, sortValue: (row) => row.role, renderCell: (row) => row.role },
    { key: "status", header: "Status", sortable: true, sortValue: (row) => row.status, renderCell: (row) => row.status },
  ]

  return (
    <OpsShell activeRoute="admin-staff">
      <OpsPortalPage eyebrow="Administration"
        title={opsPagesContent.adminStaff.title} description={opsPagesContent.adminStaff.description}>
        <AdminFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, or user ID"
          selects={[
            {
              key: "role",
              label: "Role",
              value: role,
              options: [
                { label: "All", value: "all" },
                { label: "Psychologist", value: "psychologist" },
                { label: "Practice Manager", value: "practice_manager" },
                { label: "Admin", value: "admin" },
              ],
            },
          ]}
          onSelectChange={(key, value) => {
            if (key === "role") setRole(value)
          }}
          onClear={() => {
            setSearch("")
            setRole("all")
          }}
        />
        <AdminDataTable
          rows={filtered}
          columns={columns}
          keyExtractor={(row) => row.userId}
          loading={loading}
          error={error}
          emptyMessage="No staff members matched the current filters."
        />
      </OpsPortalPage>
    </OpsShell>
  )
}
