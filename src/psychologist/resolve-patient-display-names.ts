import { getPsychologistPatientContext } from "@/src/psychologist/workspace/api"

/** Batch-resolve patient display names for clinician UI (falls back to id on failure). */
export async function resolvePatientDisplayNames(
  psychologistId: string,
  patientIds: string[],
): Promise<Map<string, string>> {
  const unique = [...new Set(patientIds.filter(Boolean))]
  const entries = await Promise.all(
    unique.map(async (patientId) => {
      try {
        const ctx = await getPsychologistPatientContext(psychologistId, patientId)
        const name = ctx.patientDisplayName.trim()
        return [patientId, name || patientId] as const
      } catch {
        return [patientId, patientId] as const
      }
    }),
  )
  return new Map(entries)
}

export function patientDisplayName(
  names: Map<string, string> | Record<string, string> | undefined,
  patientId: string,
): string {
  if (!names) return patientId
  if (names instanceof Map) return names.get(patientId) ?? patientId
  return names[patientId] ?? patientId
}
