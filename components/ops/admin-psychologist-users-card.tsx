"use client"

import { useEffect, useMemo, useState } from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { ClientPaginationBar, useClientPagination } from "@/components/shared/client-pagination"
import {
  PortalFormField,
  PortalTextInput,
} from "@/components/shared/portal-form-field"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  createAdminPsychologistUser,
  getAdminPsychologistUsers,
  updateAdminPsychologistUser,
  type AdminPsychologistUser,
} from "@/src/admin/users/api"
import { toast } from "@/src/lib/toast"

const emptyDraft = {
  email: "",
  displayName: "",
  registrationNumber: "",
  providerNumber: "",
  specialties: "",
  status: "active" as const,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AHPRA_PATTERN = /^[A-Z]{3}\d{10}$/i

function validateCreateDraft(draft: typeof emptyDraft): string | null {
  if (!EMAIL_PATTERN.test(draft.email.trim())) return "Enter a valid email address."
  if (!AHPRA_PATTERN.test(draft.registrationNumber.trim())) {
    return "AHPRA registration is usually 3 letters followed by 10 digits (e.g. PSY0001234567)."
  }
  if (!/^\d{6,8}$/.test(draft.providerNumber.trim())) {
    return "Medicare provider number is usually 6–8 digits."
  }
  return null
}

export function AdminPsychologistUsersCard() {
  const [rows, setRows] = useState<AdminPsychologistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createConfirmOpen, setCreateConfirmOpen] = useState(false)
  const [createValidationError, setCreateValidationError] = useState<string | null>(null)
  const [search] = useUrlSearchQuery()

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
      setShowCreateForm(false)
      toast.success("Psychologist account created.")
    } catch {
      setError("Could not create psychologist account.")
      toast.error("Could not create psychologist account.")
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
      toast.success(`Psychologist set to ${updated.status}.`)
    } catch {
      setError("Could not update psychologist status.")
      toast.error("Could not update psychologist status.")
    } finally {
      setBusyId(null)
    }
  }

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) => {
      const haystack = [
        row.displayName,
        row.email,
        row.registrationNumber,
        row.providerNumber,
        row.specialties.join(" "),
        row.status,
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [rows, search])

  const pagination = useClientPagination(filteredRows)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Psychologist Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void load()} /> : null}
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm">Create psychologist portal accounts.</p>
          <Button size="sm" variant="outline" onClick={() => setShowCreateForm((open) => !open)}>
            {showCreateForm ? "Hide form" : "Add user"}
          </Button>
        </div>
        {showCreateForm ? (
        <div className="grid gap-3 rounded-md border border-border/60 p-3 md:grid-cols-2">
          <PortalFormField id="create-email" label="Email" required error={createValidationError && createValidationError.includes("email") ? createValidationError : undefined}>
            <PortalTextInput
              type="email"
              placeholder="clinician@example.com"
              value={draft.email}
              onChange={(event) => {
                setCreateValidationError(null)
                setDraft((prev) => ({ ...prev, email: event.target.value }))
              }}
            />
          </PortalFormField>
          <PortalFormField id="create-display-name" label="Display name" required>
            <PortalTextInput
              placeholder="Dr Alex Smith"
              value={draft.displayName}
              onChange={(event) => setDraft((prev) => ({ ...prev, displayName: event.target.value }))}
            />
          </PortalFormField>
          <PortalFormField
            id="create-registration"
            label="Registration number"
            hint="AHPRA format: 3 letters + 10 digits (e.g. PSY0001234567)"
            required
            error={createValidationError && createValidationError.includes("AHPRA") ? createValidationError : undefined}
          >
            <PortalTextInput
              value={draft.registrationNumber}
              onChange={(event) => {
                setCreateValidationError(null)
                setDraft((prev) => ({ ...prev, registrationNumber: event.target.value }))
              }}
            />
          </PortalFormField>
          <PortalFormField
            id="create-provider"
            label="Provider number"
            hint="Medicare provider number — usually 6–8 digits"
            required
            error={createValidationError && createValidationError.includes("provider") ? createValidationError : undefined}
          >
            <PortalTextInput
              value={draft.providerNumber}
              onChange={(event) => {
                setCreateValidationError(null)
                setDraft((prev) => ({ ...prev, providerNumber: event.target.value }))
              }}
            />
          </PortalFormField>
          <PortalFormField id="create-specialties" label="Specialties (comma separated)" className="md:col-span-2">
            <PortalTextInput
              value={draft.specialties}
              onChange={(event) => setDraft((prev) => ({ ...prev, specialties: event.target.value }))}
            />
          </PortalFormField>
          {createValidationError && !createValidationError.includes("email") && !createValidationError.includes("AHPRA") && !createValidationError.includes("provider") ? (
            <p className="text-destructive md:col-span-2 text-xs">{createValidationError}</p>
          ) : null}
          <Button
            size="sm"
            className="md:col-span-2 md:w-fit"
            disabled={
              busyId === "create" ||
              !draft.email.trim() ||
              !draft.displayName.trim() ||
              !draft.registrationNumber.trim() ||
              !draft.providerNumber.trim()
            }
            onClick={() => {
              const validationError = validateCreateDraft(draft)
              if (validationError) {
                setCreateValidationError(validationError)
                return
              }
              setCreateConfirmOpen(true)
            }}
          >
            {busyId === "create" ? "Creating..." : "Create psychologist"}
          </Button>
        </div>
        ) : null}
        {!loading && !error && search.trim() ? (
          <p className="text-muted-foreground text-xs">
            {filteredRows.length} psychologist{filteredRows.length === 1 ? "" : "s"} matched your search
          </p>
        ) : null}
        {!loading && !error && search.trim() && filteredRows.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No psychologist users matched your search." />
        ) : null}
        {pagination.pageItems.map((row) => (
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
        <ClientPaginationBar
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          canGoPrev={pagination.canGoPrev}
          canGoNext={pagination.canGoNext}
          onPrev={() => pagination.setPage((p) => Math.max(1, p - 1))}
          onNext={() => pagination.setPage((p) => Math.min(pagination.totalPages, p + 1))}
        />
      </CardContent>
      <ConfirmDialog
        open={createConfirmOpen}
        title="Create psychologist account?"
        description={`This will create a portal account for ${draft.displayName.trim() || "this clinician"} at ${draft.email.trim()}.`}
        confirmLabel="Create account"
        isLoading={busyId === "create"}
        onCancel={() => setCreateConfirmOpen(false)}
        onConfirm={() => {
          setCreateConfirmOpen(false)
          void onCreate()
        }}
      />
    </Card>
  )
}
