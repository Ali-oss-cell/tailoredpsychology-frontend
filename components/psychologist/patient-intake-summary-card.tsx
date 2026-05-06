"use client"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PatientIntakeLatest } from "@/src/psychologist/workspace/api"

function section(data: Record<string, unknown>, key: string): Record<string, unknown> | undefined {
  const v = data[key]
  if (typeof v !== "object" || v === null || Array.isArray(v)) return undefined
  return v as Record<string, unknown>
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined
}

type RowProps = { label: string; value: string }

function Row({ label, value }: RowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <dt className="text-muted-foreground shrink-0 text-xs font-medium sm:w-40">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

type PatientIntakeSummaryCardProps = {
  intake: PatientIntakeLatest | null
  loading: boolean
  error: boolean
}

export function PatientIntakeSummaryCard({ intake, loading, error }: PatientIntakeSummaryCardProps) {
  const rows = React.useMemo(() => {
    if (!intake?.data) return []
    const data = intake.data
    const booking = section(data, "bookingMeta")
    const identity = section(data, "patientIdentity")
    const care = section(data, "careContext")
    const medicare = section(data, "medicarePath")
    const out: RowProps[] = []
    const name = str(identity?.fullName)
    if (name) out.push({ label: "Preferred name", value: name })
    const bookingType = str(booking?.bookingType)
    if (bookingType) out.push({ label: "Booking type", value: bookingType })
    const concerns = str(care?.presentingConcerns)
    if (concerns) out.push({ label: "Presenting concerns", value: concerns })
    const risk = str(care?.riskFlag)
    if (risk) out.push({ label: "Risk flag", value: risk })
    const mhtp = str(medicare?.hasMhtp)
    if (mhtp) out.push({ label: "Medicare Mental Health Plan", value: mhtp })
    return out
  }, [intake])

  return (
    <Card id="patient-intake-summary">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Intake summary</CardTitle>
        <CardDescription>
          Key fields for session preparation. Raw intake JSON is not shown here by design.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        {loading ? <p className="text-muted-foreground">Loading intake…</p> : null}
        {error ? (
          <p className="text-muted-foreground">Intake could not be loaded. You may lack access or intake is not available.</p>
        ) : null}
        {!loading && !error && intake ? (
          <>
            <p className="text-muted-foreground mb-3 text-xs">
              Last updated {new Date(intake.updatedAt).toLocaleString()} · Version {intake.draftVersion}
              {intake.committed ? " · Committed" : " · In progress"}
            </p>
            {rows.length === 0 ? (
              <p className="text-muted-foreground">No structured intake fields yet.</p>
            ) : (
              <dl className="space-y-2">
                {rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
