/** Seed / demo data for booking schedule fallback — not user-facing copy. */
export const CLINICIAN_PORTRAIT_URLS: Record<string, string> = {
  clinician_001: "https://i.pravatar.cc/300?u=clink-clinician-001",
  clinician_002: "https://i.pravatar.cc/300?u=clink-clinician-002",
  clinician_003: "https://i.pravatar.cc/300?u=clink-clinician-003",
}

export const clinicians = [
  {
    id: "clinician_001",
    name: "Avery Mitchell",
    specialty: "Clinical psychology, anxiety, burnout",
    nextAvailable: "Tue 10:30 AM",
  },
  {
    id: "clinician_002",
    name: "Jordan Nguyen",
    specialty: "Trauma-informed care, relationships",
    nextAvailable: "Wed 2:00 PM",
  },
  {
    id: "clinician_003",
    name: "Samira Khan",
    specialty: "Mood disorders, telehealth care plans",
    nextAvailable: "Thu 9:00 AM",
  },
  {
    id: "no-preference",
    name: "No preference",
    specialty: "Auto-match earliest suitable clinician",
    nextAvailable: "Earliest available slot",
  },
] as const

export function mapStaticCliniciansToLiveOptions(): {
  id: string
  name: string
  specialty: string
  nextAvailable: string
  profileImageUrl?: string
}[] {
  return clinicians.map((c) => ({
    id: c.id,
    name: c.name,
    specialty: c.specialty,
    nextAvailable: c.nextAvailable,
    profileImageUrl: CLINICIAN_PORTRAIT_URLS[c.id] ?? undefined,
  }))
}

export const scheduleByDate: Record<string, { id: string; label: string; clinicianId: string }[]> = {
  "2026-05-04": [
    { id: "slot-2026-05-04-0900", label: "9:00 AM", clinicianId: "clinician_003" },
    { id: "slot-2026-05-04-1030", label: "10:30 AM", clinicianId: "clinician_001" },
    { id: "slot-2026-05-04-1400", label: "2:00 PM", clinicianId: "clinician_002" },
  ],
  "2026-05-05": [
    { id: "slot-2026-05-05-1100", label: "11:00 AM", clinicianId: "clinician_001" },
    { id: "slot-2026-05-05-1330", label: "1:30 PM", clinicianId: "clinician_002" },
    { id: "slot-2026-05-05-1600", label: "4:00 PM", clinicianId: "clinician_003" },
  ],
  "2026-05-06": [
    { id: "slot-2026-05-06-0930", label: "9:30 AM", clinicianId: "clinician_002" },
    { id: "slot-2026-05-06-1230", label: "12:30 PM", clinicianId: "clinician_001" },
    { id: "slot-2026-05-06-1500", label: "3:00 PM", clinicianId: "clinician_003" },
  ],
}
