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
import type { AdminStaffItem } from "@/src/admin/ops/api"
import { useOpsStaff } from "@/src/admin/ops/queries/use-ops-staff"

type OpsRole = "manager" | "admin"

const staffColumns: AdminDataTableColumn<AdminStaffItem>[] = [
  {
    key: "userId",
    header: "User ID",
    sortable: true,
    sortValue: (row) => row.userId,
    renderCell: (row) => row.userId,
  },
  {
    key: "name",
    header: "Name",
    sortable: true,
    sortValue: (row) => row.displayName,
    renderCell: (row) => row.displayName,
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    sortValue: (row) => row.email,
    renderCell: (row) => row.email,
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
    sortValue: (row) => row.role,
    renderCell: (row) => row.role,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortValue: (row) => row.status,
    renderCell: (row) => row.status,
  },
]

export function OpsStaffPage({ role }: { role: OpsRole }) {
  const { data: rows = [], isLoading, error } = useOpsStaff()
  const [search, setSearch] = useUrlSearchQuery()
  const [roleFilter, setRoleFilter] = React.useState("all")
  const copy = role === "manager" ? opsPagesContent.managerStaff : opsPagesContent.adminStaff

  const filtered = rows.filter((row) => {
    if (roleFilter !== "all" && row.role !== roleFilter) return false
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      row.displayName.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      row.userId.toLowerCase().includes(term)
    )
  })

  return (
    <OpsPortalPage
      eyebrow={role === "manager" ? "Operations" : "Administration"}
      title={copy.title}
      description={copy.description}
      tutorialId={role === "manager" ? "manager.page.staff" : undefined}
    >
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or user ID"
        selects={[
          {
            key: "role",
            label: "Role",
            value: roleFilter,
            options: [
              { label: "All", value: "all" },
              { label: "Psychologist", value: "psychologist" },
              { label: "Practice Manager", value: "practice_manager" },
              { label: "Admin", value: "admin" },
            ],
          },
        ]}
        onSelectChange={(key, value) => {
          if (key === "role") setRoleFilter(value)
        }}
        onClear={() => {
          setSearch("")
          setRoleFilter("all")
        }}
      />
      <AdminDataTable
        rows={filtered}
        columns={staffColumns}
        keyExtractor={(row) => row.userId}
        loading={isLoading}
        error={error ? "Could not load staff." : null}
        emptyMessage="No staff members matched the current filters."
      />
    </OpsPortalPage>
  )
}
