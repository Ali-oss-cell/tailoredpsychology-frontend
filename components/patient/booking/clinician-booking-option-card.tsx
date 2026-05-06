"use client"

import { ClinicianPublicProfileHeader } from "@/components/shared/clinician-public-profile-header"
import { cn } from "@/lib/utils"

export type ClinicianBookingOptionCardProps = {
  name: string
  specialtyLine: string
  bio?: string
  profileImageUrl?: string
  nextAvailableLabel: string
  selected: boolean
  onSelect: () => void
}

/**
 * Selectable clinician row for the booking schedule step; composes {@link ClinicianPublicProfileHeader}.
 */
export function ClinicianBookingOptionCard({
  name,
  specialtyLine,
  bio,
  profileImageUrl,
  nextAvailableLabel,
  selected,
  onSelect,
}: ClinicianBookingOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border/70 bg-background",
      )}
    >
      <ClinicianPublicProfileHeader
        density="booking"
        name={name}
        specialtyLine={specialtyLine}
        bio={bio}
        profileImageUrl={profileImageUrl}
        footer={<p className="text-primary mt-2 text-xs">Next: {nextAvailableLabel}</p>}
      />
    </button>
  )
}
