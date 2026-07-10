import { formatSessionRangeAu } from "@/src/lib/format-au"

/** Shared patient-facing appointment row labels (matches appointments list). */
export function formatSessionRange(startIso: string, endIso: string): { date: string; time: string } {
  return formatSessionRangeAu(startIso, endIso)
}
