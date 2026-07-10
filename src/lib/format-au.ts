const LOCALE = "en-AU"

function toDate(value: string | Date): Date {
  return typeof value === "string" ? new Date(value) : value
}

/** e.g. 10 Jul 2026 */
export function formatDateAu(value: string | Date): string {
  return toDate(value).toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" })
}

/** e.g. 2:30 pm */
export function formatTimeAu(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return toDate(value).toLocaleTimeString(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    ...options,
  })
}

/** e.g. 10 Jul 2026, 2:30 pm */
export function formatDateTimeAu(value: string | Date): string {
  return toDate(value).toLocaleString(LOCALE, { dateStyle: "medium", timeStyle: "short" })
}

export function formatAud(value: number): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency: "AUD" }).format(value)
}

/** Date + time range for appointment rows (patient + ops tables). */
export function formatSessionRangeAu(
  startIso: string,
  endIso: string,
): { date: string; time: string } {
  return {
    date: formatDateAu(startIso),
    time: `${formatTimeAu(startIso)} – ${formatTimeAu(endIso)}`,
  }
}
