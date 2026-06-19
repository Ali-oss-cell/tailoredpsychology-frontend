"use client"

import { Plus } from "@phosphor-icons/react/dist/ssr"
import { useCallback, useEffect, useMemo, useState } from "react"

import { MoodCheckinSkeleton } from "@/components/patient/dashboard/dashboard-skeletons"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/src/auth/current-user"
import { getMoodCheckins, postMoodCheckin } from "@/src/patient/mood/api"

type MoodOption = {
  emoji: string
  label: string
}

type MoodCheckinCardProps = {
  options: MoodOption[]
}

export function MoodCheckinCard({ options }: MoodCheckinCardProps) {
  const [items, setItems] = useState<{ moodLabel: string; createdAt: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patientId, setPatientId] = useState<string | null>(null)
  const [showAddHint, setShowAddHint] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      if (user.role !== "patient") {
        setPatientId(null)
        setItems([])
        return
      }
      setPatientId(user.id)
      const data = await getMoodCheckins(user.id, 14)
      setItems(data.items.map((i) => ({ moodLabel: i.moodLabel, createdAt: i.createdAt })))
    } catch {
      setError("Could not load mood history.")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const latestLabel = items[0]?.moodLabel

  const sparkSlots = useMemo(() => {
    const recent = items.slice(0, 5).reverse()
    return Array.from({ length: 5 }, (_, i) => recent[i] ?? null)
  }, [items])

  async function submitMood(label: string): Promise<void> {
    if (!patientId || saving) return
    setSaving(true)
    setError(null)
    try {
      await postMoodCheckin(patientId, label)
      await load()
    } catch {
      setError("Could not save mood.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Mood Check-in</CardTitle>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Add mood entry"
          type="button"
          disabled={!patientId || saving}
          onClick={() => setShowAddHint((v) => !v)}
        >
          <Plus size={14} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No options yet." />
        ) : (
          <>
            {showAddHint ? (
              <p className="text-muted-foreground text-center text-xs">Tap an emoji below to log how you feel.</p>
            ) : null}
            <p className="text-muted-foreground text-center text-xs">How are you feeling today?</p>
            {loading ? (
              <MoodCheckinSkeleton />
            ) : !patientId ? (
              <p className="text-muted-foreground text-center text-xs">Sign in as a patient to save moods.</p>
            ) : (
              <div className="flex items-center justify-between gap-2">
                {options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    disabled={saving}
                    className="hover:bg-muted/80 flex h-12 w-12 items-center justify-center rounded-full text-xl transition-colors disabled:opacity-50"
                    aria-label={option.label}
                    aria-pressed={latestLabel === option.label}
                    onClick={() => void submitMood(option.label)}
                  >
                    <span className={latestLabel === option.label ? "scale-110" : ""}>{option.emoji}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="text-muted-foreground flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span>Last check-ins</span>
              <div className="flex gap-1" aria-hidden>
                {sparkSlots.map((entry, index) => (
                  <span
                    key={index}
                    className={cn("h-2.5 w-2.5 rounded-full", entry ? "bg-primary" : "bg-muted")}
                    style={entry ? { opacity: 0.35 + index * 0.12 } : undefined}
                  />
                ))}
              </div>
            </div>
            {error ? <p className="text-destructive text-center text-xs">{error}</p> : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}
