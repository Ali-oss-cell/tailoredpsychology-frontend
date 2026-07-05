"use client"

import { useEffect, useState } from "react"

import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { AdminSnapshotCard } from "@/components/ops/admin-snapshot-card"

type AdminLivePageSectionProps = {
  title: string
  description: string
  cardTitle: string
  eyebrow?: string
  load: () => Promise<Array<Record<string, unknown>>>
}

export function AdminLivePageSection({
  title,
  description,
  cardTitle,
  eyebrow = "Administration",
  load,
}: AdminLivePageSectionProps) {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await load()
        if (!mounted) return
        setRows(data)
      } catch {
        if (!mounted) return
        setError("Could not load live admin data.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [load])

  return (
    <OpsPortalPage title={title} description={description} eyebrow={eyebrow}>
      {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
      {error ? <DashboardStateBlock variant="error" message={error} /> : null}
      {!loading && !error ? <AdminSnapshotCard title={cardTitle} rows={rows} /> : null}
    </OpsPortalPage>
  )
}
