"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { psychologistNotesContent } from "@/content/psychologist-notes"
import {
  createPsychologistNote,
  getPsychologistNote,
  getPsychologistNotes,
  signPsychologistNote,
  type PsychologistNote,
  updatePsychologistNote,
} from "@/src/psychologist/notes/api"
import { getCurrentUser } from "@/src/auth/current-user"
import { getNoteSessionChoices, type NoteSessionChoice } from "@/src/psychologist/note-session-choices"
import { getPsychologistPatientContext } from "@/src/psychologist/workspace/api"

type AutosaveStatus = "idle" | "saving" | "saved" | "error"

function statusBadgeVariant(status: PsychologistNote["status"]): "default" | "secondary" | "outline" {
  if (status === "signed") return "default"
  if (status === "ready_for_signoff") return "secondary"
  return "outline"
}

export default function PsychologistNotesPage() {
  const [notes, setNotes] = useState<PsychologistNote[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [editorBody, setEditorBody] = useState("")
  const [selectedContext, setSelectedContext] = useState<Awaited<ReturnType<typeof getPsychologistPatientContext>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [psychologistId, setPsychologistId] = useState("")
  const [sessionChoices, setSessionChoices] = useState<NoteSessionChoice[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle")
  const editorScopeRef = useRef<string | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const user = await getCurrentUser()
        setPsychologistId(user.id)
        const [notesData, choices] = await Promise.all([getPsychologistNotes(user.id), getNoteSessionChoices(user.id)])
        setNotes(notesData)
        setSessionChoices(choices)
        setSelectedSessionId(choices[0]?.sessionId ?? "")
      } catch {
        setError("Could not load notes queue.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!selectedNoteId || !psychologistId) return
    let cancelled = false
    editorScopeRef.current = null
    void (async () => {
      try {
        const note = await getPsychologistNote(psychologistId, selectedNoteId)
        if (cancelled) return
        setEditorBody(note.body)
        editorScopeRef.current = selectedNoteId
        const context = await getPsychologistPatientContext(psychologistId, note.patientId).catch(() => null)
        if (!cancelled) setSelectedContext(context)
      } catch {
        if (!cancelled) setError("Could not load selected note.")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [psychologistId, selectedNoteId])

  useEffect(() => {
    if (!selectedNoteId || !psychologistId) return
    if (editorScopeRef.current !== selectedNoteId) return

    const note = notes.find((n) => n.noteId === selectedNoteId)
    if (!note || note.status === "signed") return
    if (editorBody === note.body) return

    const t = window.setTimeout(() => {
      if (editorScopeRef.current !== selectedNoteId) return
      void (async () => {
        setAutosaveStatus("saving")
        try {
          const updated = await updatePsychologistNote(psychologistId, selectedNoteId, { body: editorBody })
          setNotes((prev) => prev.map((item) => (item.noteId === selectedNoteId ? updated : item)))
          setAutosaveStatus("saved")
          window.setTimeout(() => setAutosaveStatus((s) => (s === "saved" ? "idle" : s)), 2500)
        } catch {
          setAutosaveStatus("error")
        }
      })()
    }, 750)

    return () => window.clearTimeout(t)
  }, [editorBody, notes, psychologistId, selectedNoteId])

  async function onCreate(): Promise<void> {
    if (!psychologistId) return
    const choice = sessionChoices.find((item) => item.sessionId === selectedSessionId)
    if (!choice) {
      setError("Choose a patient session to attach this note to.")
      return
    }
    try {
      const created = await createPsychologistNote(psychologistId, {
        patientId: choice.patientId,
        sessionId: choice.sessionId,
        status: "draft",
        body: "Initial therapist note.",
      })
      setNotes((prev) => [created, ...prev])
      setError(null)
    } catch {
      setError("Could not create note.")
    }
  }

  async function onSign(noteId: string): Promise<void> {
    try {
      const updated = await signPsychologistNote(psychologistId, noteId)
      setNotes((prev) => prev.map((item) => (item.noteId === noteId ? updated : item)))
    } catch {
      setError("Could not sign note.")
    }
  }

  const onSaveSelected = useCallback(async (): Promise<void> => {
    if (!selectedNoteId) return
    try {
      const updated = await updatePsychologistNote(psychologistId, selectedNoteId, { body: editorBody })
      setNotes((prev) => prev.map((item) => (item.noteId === selectedNoteId ? updated : item)))
      setError(null)
      setAutosaveStatus("saved")
      window.setTimeout(() => setAutosaveStatus("idle"), 2000)
    } catch {
      setError("Could not save note changes.")
    }
  }, [editorBody, psychologistId, selectedNoteId])

  const activeNote = selectedNoteId ? notes.find((n) => n.noteId === selectedNoteId) : undefined

  return (
    <PsychologistShell activeRoute="notes">
      <PsychologistPortalPage
        title={psychologistNotesContent.header.title}
        description={psychologistNotesContent.header.description}
        eyebrow="Documentation"
        tutorialId="psychologist.page.notes"
      >
        <Card className="interactive-lift">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">Queue</p>
            <CardTitle className="text-lg">Notes queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
              <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs sm:max-w-md">
                <span className="text-muted-foreground">Attach to session</span>
                <select
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                  value={selectedSessionId}
                  onChange={(event) => setSelectedSessionId(event.target.value)}
                  disabled={loading || sessionChoices.length === 0}
                >
                  {sessionChoices.length === 0 ? (
                    <option value="">No sessions in workspace</option>
                  ) : (
                    sessionChoices.map((item) => (
                      <option key={item.sessionId} value={item.sessionId}>
                        {item.label}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <Button
                size="sm"
                className="shrink-0"
                disabled={loading || !psychologistId || sessionChoices.length === 0}
                onClick={() => void onCreate()}
              >
                Create note
              </Button>
            </div>
            {!loading && sessionChoices.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                Schedule a session or ensure patients appear in your pre-session workspace to create a note.
              </p>
            ) : null}
            {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
            {error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!loading && !error && notes.length === 0 ? (
              <DashboardStateBlock variant="empty" message="No notes yet." />
            ) : null}
            {notes.map((item) => (
              <PortalListRow key={item.noteId} className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto_auto_auto]">
                <p className="text-sm font-medium">{item.patientId}</p>
                <p className="text-muted-foreground text-sm">{item.sessionId}</p>
                <Badge variant={statusBadgeVariant(item.status)} className="w-fit text-[10px] uppercase">
                  {item.status.replace(/_/g, " ")}
                </Badge>
                <p className="text-muted-foreground text-sm">{new Date(item.updatedAt).toLocaleString()}</p>
                <Button size="sm" variant="outline" onClick={() => setSelectedNoteId(item.noteId)}>
                  Open
                </Button>
                <Button size="sm" variant="outline" disabled={item.status === "signed"} onClick={() => void onSign(item.noteId)}>
                  {item.status === "signed" ? "Signed" : "Sign"}
                </Button>
              </PortalListRow>
            ))}
          </CardContent>
        </Card>
        {selectedNoteId ? (
          <Card className="interactive-lift">
            <CardHeader className="pb-3">
              <p className="card-eyebrow">Editor</p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">Note detail</CardTitle>
                {activeNote ? (
                  <Badge variant={statusBadgeVariant(activeNote.status)}>{activeNote.status.replace(/_/g, " ")}</Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground text-xs" aria-live="polite">
                {autosaveStatus === "saving"
                  ? "Saving draft…"
                  : autosaveStatus === "saved"
                    ? "Saved."
                    : autosaveStatus === "error"
                      ? "Autosave failed — use Save draft or try again."
                      : activeNote?.status === "signed"
                        ? "This note is signed and locked."
                        : "Edits save automatically while you type."}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={editorBody}
                onChange={(event) => setEditorBody(event.target.value)}
                rows={6}
                disabled={activeNote?.status === "signed"}
                aria-label="Therapist note body"
                className="w-full rounded border border-border px-2 py-2 text-sm disabled:opacity-60"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => void onSaveSelected()} disabled={activeNote?.status === "signed"}>
                  Save draft
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedNoteId(null)}>
                  Close
                </Button>
              </div>
              {activeNote && activeNote.status !== "signed" ? (
                <div className="rounded border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                  <p className="font-medium">Before you sign</p>
                  <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5">
                    <li>Confirm the note reflects this session and your clinical judgement.</li>
                    <li>Risk, consent, and mandatory reporting obligations for your jurisdiction still apply.</li>
                    <li>Signing locks the note for editing — use Save draft until you are ready.</li>
                  </ul>
                </div>
              ) : null}
              {selectedContext ? (
                <div className="rounded border border-border/60 p-3 text-xs text-muted-foreground">
                  patient: {selectedContext.patientDisplayName} · risk: {selectedContext.riskLevel} · referral:{" "}
                  {selectedContext.referralStatus}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </PsychologistPortalPage>
    </PsychologistShell>
  )
}
