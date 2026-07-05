export const psychologistQueryKeys = {
  all: ["psychologist"] as const,
  dashboard: ["psychologist", "dashboard"] as const,
}

export const psychologistQueryStaleTime = {
  dashboard: 30_000,
} as const
