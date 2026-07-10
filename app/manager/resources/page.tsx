"use client"

import * as React from "react"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"

import {
  AdminDataTable,
  type AdminDataTableColumn,
} from "@/components/ops/admin-data-table"
import { AdminFilterBar } from "@/components/ops/admin-filter-bar"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { opsPagesContent } from "@/content/ops-pages"
import { formatDateTimeAu } from "@/src/lib/format-au"
import {
  getAdminOpsResources,
  type AdminResourceItem,
} from "@/src/admin/ops/api"

export default function ManagerResourcesPage() {
  const [rows, setRows] = React.useState<AdminResourceItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = useUrlSearchQuery()
  const [stateFilter, setStateFilter] = React.useState("all")

  React.useEffect(() => {
    let cancelled = false
    void getAdminOpsResources()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load resources.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = rows.filter((row) => {
    if (stateFilter !== "all" && row.state !== stateFilter) return false
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      row.title.toLowerCase().includes(term) ||
      row.owner.toLowerCase().includes(term) ||
      row.resourceId.toLowerCase().includes(term)
    )
  })

  const columns: AdminDataTableColumn<AdminResourceItem>[] = [
    {
      key: "resourceId",
      header: "Resource",
      sortable: true,
      sortValue: (row) => row.resourceId,
      renderCell: (row) => row.resourceId,
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (row) => row.title,
      renderCell: (row) => row.title,
    },
    {
      key: "state",
      header: "State",
      sortable: true,
      sortValue: (row) => row.state,
      renderCell: (row) => row.state,
    },
    {
      key: "owner",
      header: "Owner",
      sortable: true,
      sortValue: (row) => row.owner,
      renderCell: (row) => row.owner,
    },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      sortValue: (row) => new Date(row.updatedAt).getTime(),
      renderCell: (row) => formatDateTimeAu(row.updatedAt),
    },
  ]

  return (
    <OpsPortalPage
      eyebrow="Operations"
      title={opsPagesContent.managerResources.title}
      description={opsPagesContent.managerResources.description}
      tutorialId="manager.page.resources"
    >
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title, owner, or resource ID"
        selects={[
          {
            key: "state",
            label: "State",
            value: stateFilter,
            options: [
              { label: "All", value: "all" },
              { label: "Received", value: "received" },
              { label: "Review needed", value: "review_needed" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
              { label: "Info requested", value: "info_requested" },
            ],
          },
        ]}
        onSelectChange={(key, value) => {
          if (key === "state") setStateFilter(value)
        }}
        onClear={() => {
          setSearch("")
          setStateFilter("all")
        }}
      />
      <AdminDataTable
        rows={filtered}
        columns={columns}
        keyExtractor={(row) => row.resourceId}
        loading={loading}
        error={error}
        emptyMessage="No resources matched the current filters."
      />
    </OpsPortalPage>
  )
}
