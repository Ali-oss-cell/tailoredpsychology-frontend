"use client"

import { useEffect, useState } from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createAdminPsychologistUser,
  getAdminPsychologistUsers,
  updateAdminPsychologistUser,
  type AdminPsychologistUser,
} from "@/src/admin/users/api"

const emptyDraft = {
  email: "",
  displayName: "",
  registrationNumber: "",
  providerNumber: "",
  specialties: "",
  status: "active" as const,
}

export function AdminPsychologistUsersCard() {
  const [rows, setRows] = useState<AdminPsychologistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)

  async function load(): Promise<void> {
    setLoading(true)
    setError(null)
    try {
      setRows(await getAdminPsychologistUsers())
    } catch {
      setError("Could not load psychologist users.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  async function onCreate(): Promise<void> {
    setBusyId("create")
    setError(null)
    try {
      const created = await createAdminPsychologistUser({
        email: draft.email.trim(),
        displayName: draft.displayName.trim(),
        registrationNumber: draft.registrationNumber.trim(),
        providerNumber: draft.providerNumber.trim(),
        specialties: draft.specialties.split(",").map((item) => item.trim()).filter(Boolean),
        status: draft.status,
      })
      setRows((prev) => [created, ...prev])
      setDraft(emptyDraft)
    } catch {
      setError("Could not create psychologist account.")
    } finally {
      setBusyId(null)
    }
  }

  async function onToggleStatus(row: AdminPsychologistUser): Promise<void> {
    setBusyId(row.id)
    setError(null)
    try {
      const updated = await updateAdminPsychologistUser(row.id, {
        displayName: row.displayName,
        registrationNumber: row.registrationNumber,
        providerNumber: row.providerNumber,
        specialties: row.specialties,
        status: row.status === "active" ? "inactive" : "active",
      })
      setRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError("Could not update psychologist status.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Psychologist Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void load()} /> : null}
        <div className="grid gap-2 rounded-md border border-border/60 p-3 md:grid-cols-3">
          <input
            className="h-9 rounded border border-border bg-background px-2 text-sm"
            placeholder="Email"
            value={draft.email}
            onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            className="h-9 rounded border border-border bg-background px-2 text-sm"
            placeholder="Display name"
            value={draft.displayName}
            onChange={(event) => setDraft((prev) => ({ ...prev, displayName: event.target.value }))}
          />
          <input
            className="h-9 rounded border border-border bg-background px-2 text-sm"
            placeholder="Registration number"
            value={draft.registrationNumber}
            onChange={(event) => setDraft((prev) => ({ ...prev, registrationNumber: event.target.value }))}
          />
          <input
            className="h-9 rounded border border-border bg-background px-2 text-sm"
            placeholder="Provider number"
            value={draft.providerNumber}
            onChange={(event) => setDraft((prev) => ({ ...prev, providerNumber: event.target.value }))}
          />
          <input
            className="h-9 rounded border border-border bg-background px-2 text-sm md:col-span-2"
            placeholder="Specialties (comma separated)"
            value={draft.specialties}
            onChange={(event) => setDraft((prev) => ({ ...prev, specialties: event.target.value }))}
          />
          <Button
            size="sm"
            disabled={
              busyId === "create" ||
              !draft.email.trim() ||
              !draft.displayName.trim() ||
              !draft.registrationNumber.trim() ||
              !draft.providerNumber.trim()
            }
            onClick={() => void onCreate()}
          >
            {busyId === "create" ? "Creating..." : "Create psychologist"}
          </Button>
        </div>
        {rows.map((row) => (
          <article key={row.id} className="rounded-md border border-border/70 p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{row.displayName}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
              </div>
              <Button size="sm" variant="outline" disabled={busyId === row.id} onClick={() => void onToggleStatus(row)}>
                {busyId === row.id ? "Saving..." : row.status === "active" ? "Set inactive" : "Set active"}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Registration: {row.registrationNumber} • Provider: {row.providerNumber} • Specialties:{" "}
              {row.specialties.join(", ") || "—"} • Status: {row.status}
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  )
}
