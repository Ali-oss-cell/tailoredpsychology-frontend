"use client"

import { useEffect, useState } from "react"

import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { AdminSnapshotCard } from "@/components/ops/admin-snapshot-card"

type AdminLivePageSectionProps = {
  title: string
  description: string
  cardTitle: string
  load: () => Promise<Array<Record<string, unknown>>>
}

export function AdminLivePageSection({ title, description, cardTitle, load }: AdminLivePageSectionProps) {
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
    <section className="space-y-6">
      <PatientPageHeader title={title} description={description} />
      {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
      {error ? <DashboardStateBlock variant="error" message={error} /> : null}
      {!loading && !error ? <AdminSnapshotCard title={cardTitle} rows={rows} /> : null}
    </section>
  )
}
