/** Mirror backend patient reschedule rules in `AppointmentsService.manageAppointment`. */
export const RESCHEDULE_MIN_LEAD_MS = 60 * 60 * 1000
export const RESCHEDULE_LOCK_BEFORE_START_MS = 2 * 60 * 60 * 1000
export const RESCHEDULE_MAX_DAYS = 180

export const RESCHEDULE_RULE_LINES = [
  "New time must be at least 1 hour from now.",
  "You cannot reschedule online within 2 hours of the current session start — call the clinic instead.",
  `You can pick a date up to ${RESCHEDULE_MAX_DAYS} days ahead.`,
] as const
