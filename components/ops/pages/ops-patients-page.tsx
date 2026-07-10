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
import type { AdminPatientItem } from "@/src/admin/ops/api"
import { useOpsPatients } from "@/src/admin/ops/queries/use-ops-patients"

type OpsRole = "manager" | "admin"

const patientColumns: AdminDataTableColumn<AdminPatientItem>[] = [
  {
    key: "patientId",
    header: "Patient ID",
    sortable: true,
    sortValue: (row) => row.patientId,
    renderCell: (row) => row.patientId,
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
    key: "intake",
    header: "Intake",
    sortable: true,
    sortValue: (row) => row.intakeState,
    renderCell: (row) => row.intakeState,
  },
  {
    key: "retention",
    header: "Retention",
    sortable: true,
    sortValue: (row) => row.retentionStatus,
    renderCell: (row) => row.retentionStatus,
  },
  {
    key: "legalHold",
    header: "Legal hold",
    sortable: true,
    sortValue: (row) => (row.legalHoldActive ? 1 : 0),
    renderCell: (row) => (row.legalHoldActive ? "on" : "off"),
  },
]

export function OpsPatientsPage({ role }: { role: "manager" | "admin" }) {
  const { data: rows = [], isLoading, error } = useOpsPatients()
  const [search, setSearch] = useUrlSearchQuery()
  const [retentionStatus, setRetentionStatus] = React.useState("all")
  const copy = role === "manager" ? opsPagesContent.managerPatients : opsPagesContent.adminPatients

  const filtered = rows.filter((row) => {
    if (retentionStatus !== "all" && row.retentionStatus !== retentionStatus) return false
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      row.displayName.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      row.patientId.toLowerCase().includes(term)
    )
  })

  return (
    <OpsPortalPage
      eyebrow={role === "manager" ? "Operations" : "Administration"}
      title={copy.title}
      description={copy.description}
      tutorialId={role === "manager" ? "manager.page.patients" : undefined}
    >
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
        resultCount={filtered.length}
        resultLabel="patients"
      />
      <AdminDataTable
        rows={filtered}
        columns={patientColumns}
        keyExtractor={(row) => row.patientId}
        loading={isLoading}
        error={error ? "Could not load patients." : null}
        emptyMessage="No patients matched the current filters."
      />
    </OpsPortalPage>
  )
}
