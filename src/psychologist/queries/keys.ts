import type { PsychologistWorkspaceQuery } from "@/src/psychologist/workspace/api"

export const psychologistQueryKeys = {
  all: ["psychologist"] as const,
  currentUser: ["psychologist", "current-user"] as const,
  dashboard: ["psychologist", "dashboard"] as const,
  workspace: (psychologistId?: string, query?: PsychologistWorkspaceQuery) =>
    [
      "psychologist",
      "workspace",
      psychologistId,
      query?.readinessStatus ?? "all",
      query?.staleMinutes ?? "none",
      query?.sortBy ?? "default",
      query?.sortOrder ?? "default",
    ] as const,
  sessions: (psychologistId?: string) => ["psychologist", "sessions", psychologistId] as const,
  caseload: (psychologistId?: string) => ["psychologist", "caseload", psychologistId] as const,
  recordings: (psychologistId?: string) => ["psychologist", "recordings", psychologistId] as const,
}

export const psychologistQueryStaleTime = {
  currentUser: 5 * 60_000,
  dashboard: 30_000,
  workspace: 60_000,
  sessions: 60_000,
  caseload: 60_000,
  recordings: 2 * 60_000,
} as const
