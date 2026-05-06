"use client"

import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { CardTitle } from "@/components/ui/card"

export type ClinicianPublicProfileHeaderProps = {
  name: string
  /** Secondary line under the title (e.g. email on the psychologist edit page) */
  subtitle?: string
  specialtyLine?: string
  bio?: string
  profileImageUrl?: string
  /** `booking` = compact schedule picker; `care` = care-team card header */
  density?: "booking" | "care"
  /** e.g. status badge next to the name (care team) */
  titleRowEnd?: ReactNode
  /** e.g. “Next: Tue 10:30” under bio (booking) */
  footer?: ReactNode
  className?: string
}

const imageSizePx = { booking: 56, care: 64 } as const

function initialsFromDisplayName(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Shared avatar + name + specialty + bio block for patient-facing clinician listings.
 * Uses `next/image` with `unoptimized` so HTTPS profile URLs from the API work without per-domain `remotePatterns`.
 * When there is no image URL, shows initials derived from `name` (care density uses larger circle).
 */
export function ClinicianPublicProfileHeader({
  name,
  subtitle,
  specialtyLine,
  bio,
  profileImageUrl,
  density = "care",
  titleRowEnd,
  footer,
  className,
}: ClinicianPublicProfileHeaderProps) {
  const px = imageSizePx[density]

  return (
    <div className={cn("flex flex-wrap items-start gap-3", className)}>
      {profileImageUrl ? (
        <Image
          src={profileImageUrl}
          alt=""
          width={px}
          height={px}
          className="shrink-0 rounded-full object-cover"
          unoptimized
        />
      ) : (
        <div
          className={cn(
            "bg-primary/15 text-primary flex shrink-0 items-center justify-center rounded-full font-semibold",
            density === "booking" ? "h-14 w-14 text-lg" : "h-16 w-16 text-xl",
          )}
          aria-hidden
        >
          {initialsFromDisplayName(name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        {density === "care" ? (
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-lg">{name}</CardTitle>
            {titleRowEnd}
          </div>
        ) : (
          <p className="text-sm font-semibold">{name}</p>
        )}
        {subtitle ? (
          <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
        ) : null}
        {specialtyLine ? (
          <p
            className={cn(
              "text-muted-foreground",
              density === "booking" ? "mt-1 text-xs" : "mt-1 text-sm",
            )}
          >
            {specialtyLine}
          </p>
        ) : null}
        {bio ? (
          <p
            className={cn(
              "text-muted-foreground mt-1 text-xs line-clamp-2",
              density === "care" && "mt-2 text-sm leading-relaxed line-clamp-none",
            )}
          >
            {bio}
          </p>
        ) : null}
        {footer}
      </div>
    </div>
  )
}
