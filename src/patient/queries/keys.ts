export const patientQueryKeys = {
  all: ["patient"] as const,
  currentUser: ["patient", "current-user"] as const,
  dashboard: ["patient", "dashboard"] as const,
  appointmentsRoot: ["patient", "appointments"] as const,
  appointments: (patientId?: string) => ["patient", "appointments", patientId] as const,
  invoices: ["patient", "invoices"] as const,
  appointmentSessionDetails: (patientId?: string) => ["patient", "appointment-session-details", patientId] as const,
  journey: ["patient", "journey"] as const,
}

export const patientQueryStaleTime = {
  currentUser: 5 * 60_000,
  dashboard: 60_000,
  appointments: 60_000,
  invoices: 2 * 60_000,
  appointmentSessionDetails: 60_000,
  journey: 60_000,
} as const
