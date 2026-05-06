/** Canonical in-app path for the telehealth pre-session workspace (Wave 17). */
export function joinSessionHref(appointmentId: string): string {
  return `/video-session/${encodeURIComponent(appointmentId)}`
}
