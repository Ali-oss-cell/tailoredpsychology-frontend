export const opsQueryKeys = {
  staff: ["ops", "staff"] as const,
  patients: ["ops", "patients"] as const,
  appointments: ["ops", "appointments"] as const,
  billing: ["ops", "billing"] as const,
}

export const opsQueryStaleTime = {
  list: 30_000,
  billing: 60_000,
} as const
