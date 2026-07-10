"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PortalListRow } from "@/components/shared/portal-list-row"
import {
  PortalFormField,
  PortalSelect,
  PortalTextarea,
} from "@/components/shared/portal-form-field"
import { psychologistNotesContent } from "@/content/psychologist-notes"
import { formatDateTimeAu } from "@/src/lib/format-au"
import { toast } from "@/src/lib/toast"
import {
  createPsychologistNote,
  getPsychologistNote,
  getPsychologistNotes,
  signPsychologistNote,
  type PsychologistNote,
  updatePsychologistNote,
} from "@/src/psychologist/notes/api"
import { usePsychologistId } from "@/src/psychologist/queries/use-current-user"
import { getNoteSessionChoices, type NoteSessionChoice } from "@/src/psychologist/note-session-choices"
import { getPsychologistPatientContext } from "@/src/psychologist/workspace/api"
import { cn } from "@/lib/utils"

type AutosaveStatus = "idle" | "saving" | "saved" | "error"
type MobileNotesTab = "queue" | "editor"

function statusBadgeVariant(status: PsychologistNote["status"]): "default" | "secondary" | "outline" {
  if (status === "signed") return "default"
  if (status === "ready_for_signoff") return "secondary"
  return "outline"
}

export default function PsychologistNotesPage() {
  const psychologistId = usePsychologistId() ?? ""
  const [notes, setNotes] = useState<PsychologistNote[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [editorBody, setEditorBody] = useState("")
  const [selectedContext, setSelectedContext] = useState<Awaited<ReturnType<typeof getPsychologistPatientContext>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionChoices, setSessionChoices] = useState<NoteSessionChoice[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle")
  const [mobileTab, setMobileTab] = useState<MobileNotesTab>("queue")
  const editorScopeRef = useRef<string | null>(null)

  useEffect(() => {
    if (!psychologistId) return
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const [notesData, choices] = await Promise.all([getPsychologistNotes(psychologistId), getNoteSessionChoices(psychologistId)])
        setNotes(notesData)
        setSessionChoices(choices)
        setSelectedSessionId(choices[0]?.sessionId ?? "")
      } catch {
        setError("Could not load notes queue.")
      } finally {
        setLoading(false)
      }
    })()
  }, [psychologistId])

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
          toast.error("Autosave failed — use Save draft or try again.")
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
      setSelectedNoteId(created.noteId)
      setMobileTab("editor")
      toast.success("Note created.")
    } catch {
      setError("Could not create note.")
      toast.error("Could not create note.")
    }
  }

  async function onSign(noteId: string): Promise<void> {
    try {
      const updated = await signPsychologistNote(psychologistId, noteId)
      setNotes((prev) => prev.map((item) => (item.noteId === noteId ? updated : item)))
      toast.success("Note signed.")
    } catch {
      setError("Could not sign note.")
      toast.error("Could not sign note.")
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
      toast.success("Note saved.")
    } catch {
      setError("Could not save note changes.")
      toast.error("Could not save note changes.")
    }
  }, [editorBody, psychologistId, selectedNoteId])

  const activeNote = selectedNoteId ? notes.find((n) => n.noteId === selectedNoteId) : undefined

  const showQueuePanel = mobileTab === "queue"
  const showEditorPanel = Boolean(selectedNoteId) && mobileTab === "editor"

  return (
    <PsychologistPortalPage
        title={psychologistNotesContent.header.title}
        description={psychologistNotesContent.header.description}
        eyebrow="Documentation"
        tutorialId="psychologist.page.notes"
      >
        <div
          className="bg-muted/40 border-border/60 flex gap-1 rounded-lg border p-1 md:hidden"
          role="tablist"
          aria-label="Notes sections"
        >
          <Button
            type="button"
            size="sm"
            variant={mobileTab === "queue" ? "default" : "ghost"}
            className="flex-1"
            role="tab"
            aria-selected={mobileTab === "queue"}
            onClick={() => setMobileTab("queue")}
          >
            Queue
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mobileTab === "editor" ? "default" : "ghost"}
            className="flex-1"
            role="tab"
            aria-selected={mobileTab === "editor"}
            disabled={!selectedNoteId}
            onClick={() => setMobileTab("editor")}
          >
            Note
          </Button>
        </div>

        <Card className={cn("interactive-lift", !showQueuePanel && "hidden md:block")}>
          <CardHeader className="pb-3">
            <p className="card-eyebrow">Queue</p>
            <CardTitle className="text-lg">Notes queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
              <PortalFormField
                id="note-session"
                label="Attach to session"
                className="min-w-0 flex-1 sm:max-w-md"
              >
                <PortalSelect
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
                </PortalSelect>
              </PortalFormField>
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
                <p className="text-muted-foreground text-sm">{formatDateTimeAu(item.updatedAt)}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedNoteId(item.noteId)
                    setMobileTab("editor")
                  }}
                >
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
          <Card className={cn("interactive-lift", !showEditorPanel && "hidden md:block")}>
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
              <PortalFormField id="note-body" label="Therapist note body">
                <PortalTextarea
                  value={editorBody}
                  onChange={(event) => setEditorBody(event.target.value)}
                  rows={6}
                  disabled={activeNote?.status === "signed"}
                  aria-label="Therapist note body"
                />
              </PortalFormField>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => void onSaveSelected()} disabled={activeNote?.status === "signed"}>
                  Save draft
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedNoteId(null)
                    setMobileTab("queue")
                  }}
                >
                  Close
                </Button>
              </div>
              {activeNote && activeNote.status !== "signed" ? (
                <div className="border-warning/30 bg-warning/10 text-foreground rounded-lg border px-3 py-2 text-xs">
                  <p className="font-medium">Before you sign</p>
                  <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5">
                    <li>Confirm the note reflects this session and your clinical judgement.</li>
                    <li>Risk, consent, and mandatory reporting obligations for your jurisdiction still apply.</li>
                    <li>Signing locks the note for editing — use Save draft until you are ready.</li>
                  </ul>
                </div>
              ) : null}
              {selectedContext ? (
                <div className="border-border/60 bg-muted/30 rounded-lg border p-3 text-xs text-muted-foreground">
                  patient: {selectedContext.patientDisplayName} · risk: {selectedContext.riskLevel} · referral:{" "}
                  {selectedContext.referralStatus}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </PsychologistPortalPage>
  )
}
