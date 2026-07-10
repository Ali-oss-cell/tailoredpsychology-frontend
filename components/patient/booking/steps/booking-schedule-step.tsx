"use client"

import { CaretLeft, CaretRight } from "@phosphor-icons/react"

import { ClinicianBookingOptionCard } from "@/components/patient/booking/clinician-booking-option-card"
import { BookingScheduleSkeleton } from "@/components/patient/booking/booking-schedule-skeleton"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { bookingContent } from "@/content/patient-booking"
import { australianEasternTimezoneLabel } from "@/src/lib/format-au"
import {
  dateKey,
  monthGridDays,
  monthLabel,
} from "@/src/patient/booking/booking-schedule-utils"

export function BookingScheduleStep() {
  const {
    draft,
    updateDraft,
    bookingEligibility,
    matchSource,
    preselectedClinicianName,
    liveClinicians,
    liveScheduleByDate,
    isLoadingSchedule,
    scheduleLoadError,
    calendarMonth,
    setCalendarMonth,
    setAvailabilityRetryNonce,
  } = useBookingWizardContext()

  const availableDates = Object.keys(liveScheduleByDate)
  const monthDays = monthGridDays(calendarMonth)

  const availableSlotsForDate = (date: string) => {
    const slots = liveScheduleByDate[date] ?? []
    if (!draft.scheduleSelection.selectedClinicianId || draft.scheduleSelection.selectedClinicianId === "no-preference") {
      return slots
    }
    return slots.filter((slot) => slot.clinicianId === draft.scheduleSelection.selectedClinicianId)
  }

  if (isLoadingSchedule) {
    return (
      <div className="space-y-5" aria-busy="true" aria-live="polite" aria-label="Loading schedule options">
        <p className="text-muted-foreground text-sm">{bookingContent.helper.schedule}</p>
        <BookingScheduleSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {bookingEligibility.isNewPatient ? (
        <div className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <Badge variant="secondary" className="rounded-full">
            First appointment
          </Badge>
          <p className="text-sm font-medium">
            {matchSource && preselectedClinicianName
              ? bookingContent.newPatient.scheduleBanner(preselectedClinicianName)
              : bookingContent.newPatient.scheduleBanner("")}
          </p>
        </div>
      ) : null}
      <p className="text-muted-foreground text-sm">{bookingContent.helper.schedule}</p>
      <p className="text-muted-foreground text-xs">{australianEasternTimezoneLabel()}</p>
      {scheduleLoadError ? (
        <div className="space-y-2">
          <DashboardStateBlock variant="error" message={scheduleLoadError} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAvailabilityRetryNonce((n) => n + 1)}
          >
            Retry loading live availability
          </Button>
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        {liveClinicians.map((clinician) => {
          const selected = draft.scheduleSelection.selectedClinicianId === clinician.id
          return (
            <ClinicianBookingOptionCard
              key={clinician.id}
              name={clinician.name}
              specialtyLine={clinician.specialty}
              bio={clinician.bio}
              profileImageUrl={clinician.profileImageUrl}
              nextAvailableLabel={clinician.nextAvailable}
              selected={selected}
              onSelect={() =>
                updateDraft("scheduleSelection", {
                  ...draft.scheduleSelection,
                  selectedClinicianId: clinician.id,
                  selectedSlotId: "",
                })
              }
            />
          )
        })}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Choose date (monthly schedule)</label>
        <div className="rounded-xl border border-border/60 bg-muted/25 p-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="rounded-md border border-border/70 p-2 hover:bg-muted"
              aria-label="Previous month"
            >
              <CaretLeft size={16} />
            </button>
            <p className="font-heading text-lg font-semibold">{monthLabel(calendarMonth)}</p>
            <button
              type="button"
              onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="rounded-md border border-border/70 p-2 hover:bg-muted"
              aria-label="Next month"
            >
              <CaretRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs text-muted-foreground">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((weekday) => (
              <div key={weekday} className="py-1">
                {weekday}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const key = dateKey(day)
              const isCurrentMonth = day.getMonth() === calendarMonth.getMonth()
              const isAvailable = availableDates.includes(key)
              const isSelected = draft.scheduleSelection.selectedDate === key

              return (
                <button
                  key={key}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() =>
                    updateDraft("scheduleSelection", {
                      ...draft.scheduleSelection,
                      selectedDate: key,
                      selectedSlotId: "",
                    })
                  }
                  className={`h-10 rounded-md text-sm transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isAvailable
                        ? "bg-background border border-border/70 hover:bg-muted"
                        : "text-muted-foreground/50"
                  } ${!isCurrentMonth ? "opacity-45" : ""}`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {draft.scheduleSelection.selectedDate ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose available slot</label>
          <div className="flex flex-wrap gap-2">
            {availableSlotsForDate(draft.scheduleSelection.selectedDate).map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() =>
                  updateDraft("scheduleSelection", {
                    ...draft.scheduleSelection,
                    selectedSlotId: slot.id,
                  })
                }
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  draft.scheduleSelection.selectedSlotId === slot.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
          {draft.scheduleSelection.selectedSlotId ? (
            <p className="text-muted-foreground text-xs">{bookingContent.helper.slotHold}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
