import { redirect } from "next/navigation"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

/** Legacy URL; booking lives under `/patient/*` so the patient layout (including tutorials) stays mounted. */
export default async function LegacyBookAppointmentRedirect({ searchParams }: PageProps) {
  const raw = searchParams ? await searchParams : {}
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item)
      }
    } else {
      params.set(key, value)
    }
  }
  const qs = params.toString()
  redirect(qs ? `/patient/book-appointment?${qs}` : "/patient/book-appointment")
}
