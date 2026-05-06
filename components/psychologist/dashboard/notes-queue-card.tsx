"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPsychologistNotes } from "@/src/psychologist/notes/api"

export function NotesQueueCard() {
  const [pendingCount, setPendingCount] = useState(0)
  const [signedCount, setSignedCount] = useState(0)
  useEffect(() => {
    void (async () => {
      const user = await getCurrentUser()
      const notes = await getPsychologistNotes(user.id)
      setPendingCount(notes.filter((n) => n.status !== "signed").length)
      setSignedCount(notes.filter((n) => n.status === "signed").length)
    })()
  }, [])
  return (
    <Card className="md:col-span-5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Notes Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted/40 rounded-lg border border-border/60 p-3">
          <p className="text-muted-foreground text-xs">Pending notes</p>
          <p className="font-heading text-2xl font-semibold">{pendingCount}</p>
        </div>
        <div className="bg-muted/40 rounded-lg border border-border/60 p-3">
          <p className="text-muted-foreground text-xs">Signed today</p>
          <p className="font-heading text-2xl font-semibold">{signedCount}</p>
        </div>
      </CardContent>
    </Card>
  )
}
