"use client"

import Link from "next/link"
import { CalendarBlank, User } from "@phosphor-icons/react/dist/ssr"
import { useState } from "react"

import { AppointmentManagePanel } from "@/components/patient/appointments/appointment-manage-panel"
import { joinSessionHref } from "@/src/session/join-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type UpcomingSessionCardProps = {
  appointmentId: string
  sessionType: string
  clinicianName: string
  dateLabel: string
  timeLabel: string
  suppressJoinButton?: boolean
}

export function UpcomingSessionCard({
  appointmentId,
  sessionType,
  clinicianName,
  dateLabel,
  timeLabel,
  suppressJoinButton = false,
}: UpcomingSessionCardProps) {
  const [showManage, setShowManage] = useState(false)

  return (
    <Card className="md:col-span-8">
      <CardHeader className="pb-3">
        <div className="text-muted-foreground mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs">
          <CalendarBlank size={14} />
          Upcoming Session
        </div>
        <CardTitle className="text-xl">{sessionType}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
            <User size={16} />
            {clinicianName}
          </p>
          <div className="text-right">
            <p className="font-heading text-primary text-lg font-semibold">{dateLabel}</p>
            <p className="text-muted-foreground text-sm">{timeLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4" data-tutorial="patient.dashboard.join-session">
          {!suppressJoinButton ? (
            <Button asChild>
              <Link href={joinSessionHref(appointmentId)}>Join Telehealth Session</Link>
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => setShowManage((open) => !open)}>
            {showManage ? "Close Manage" : "Manage"}
          </Button>
        </div>

        {showManage ? <AppointmentManagePanel appointmentId={appointmentId} /> : null}
      </CardContent>
    </Card>
  )
}
