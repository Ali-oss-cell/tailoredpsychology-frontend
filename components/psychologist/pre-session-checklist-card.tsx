"use client"

import * as React from "react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PsychologistWorkspaceItem } from "@/src/psychologist/workspace/api"
import { joinSessionHref } from "@/src/session/join-session"

const ACTION_LABELS: Record<string, string> = {
  review_intake: "Review intake responses",
  check_referral: "Confirm referral document on file",
  risk_escalation: "Review risk / safety signals",
  review_readiness: "Review telehealth readiness",
}

const STORAGE_KEY = "clink_prepsession_checklist_v1"

type StoredMap = Record<string, boolean>

function readMap(): StoredMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as StoredMap
  } catch {
    return {}
  }
}

function writeMap(map: StoredMap) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota */
  }
}

function actionKey(psychologistId: string, patientId: string, appointmentId: string, action: string) {
  return `${psychologistId}|${patientId}|${appointmentId}|${action}`
}

function actionHref(
  action: string,
  patientId: string,
  appointmentId: string,
): { href: string; label: string } {
  const encPatient = encodeURIComponent(patientId)
  switch (action) {
    case "review_intake":
      return { href: `/psychologist/patients/${encPatient}#patient-intake-summary`, label: "Open intake" }
    case "check_referral":
      return { href: `/psychologist/patients/${encPatient}#patient-referrals`, label: "Open referrals" }
    case "risk_escalation":
      return { href: `/psychologist/patients/${encPatient}#patient-clinical-snapshot`, label: "Open snapshot" }
    case "review_readiness":
      return { href: joinSessionHref(appointmentId), label: "Open readiness" }
    default:
      return { href: `/psychologist/patients/${encPatient}`, label: "Open profile" }
  }
}

type PreSessionChecklistCardProps = {
  items: PsychologistWorkspaceItem[]
  psychologistId: string
  patientId: string
}

export function PreSessionChecklistCard({ items, psychologistId, patientId }: PreSessionChecklistCardProps) {
  const [checked, setChecked] = React.useState<StoredMap>({})

  React.useEffect(() => {
    setChecked(readMap())
  }, [psychologistId, patientId])

  const setDone = (appointmentId: string, action: string, done: boolean) => {
    const key = actionKey(psychologistId, patientId, appointmentId, action)
    setChecked((prev) => {
      const next = { ...prev, [key]: done }
      writeMap(next)
      return next
    })
  }

  const upcoming = [...items].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  const mergedActions = new Set<string>()
  for (const item of upcoming) {
    for (const a of item.actions) mergedActions.add(a)
  }

  return (
    <Card id="patient-prep-checklist">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Pre-session checklist</CardTitle>
        <CardDescription>Based on your upcoming appointments with this patient. Checked items are stored in this browser session only.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground">No upcoming sessions in your workspace for this patient.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((item) => (
              <li key={item.appointmentId} className="rounded-md border border-border/60 p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{new Date(item.startsAt).toLocaleString()}</span>
                  <Link
                    href={joinSessionHref(item.appointmentId)}
                    className="text-primary text-xs underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Open session
                  </Link>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Readiness: {item.readinessStatus} · Referral: {item.referralStatus.replace(/_/g, " ")} · Intake:{" "}
                  {item.intakeState.replace(/_/g, " ")}
                </p>
                {item.actions.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 border-t border-border/40 pt-2">
                    {item.actions.map((action) => {
                      const key = actionKey(psychologistId, patientId, item.appointmentId, action)
                      const isDone = Boolean(checked[key])
                      const deep = actionHref(action, patientId, item.appointmentId)
                      return (
                        <li key={key} className="flex flex-wrap items-start gap-2">
                          <label className="flex cursor-pointer items-start gap-2 text-xs">
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 shrink-0"
                              checked={isDone}
                              onChange={(e) => setDone(item.appointmentId, action, e.target.checked)}
                            />
                            <span className={isDone ? "text-muted-foreground line-through" : ""}>
                              {ACTION_LABELS[action] ?? action}
                            </span>
                          </label>
                          <Link
                            href={deep.href}
                            className="text-primary ml-auto text-[11px] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                          >
                            {deep.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {mergedActions.size > 0 ? (
          <div>
            <p className="mb-2 font-medium">All suggested actions</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {[...mergedActions].map((key) => (
                <li key={key}>{ACTION_LABELS[key] ?? key}</li>
              ))}
            </ul>
          </div>
        ) : upcoming.length > 0 ? (
          <p className="text-muted-foreground">No automated prep flags for upcoming visits.</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
