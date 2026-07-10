import { Phone, WarningCircle } from "@phosphor-icons/react"

import { bookingContent } from "@/content/patient-booking"

export function BookingCrisisPanel() {
  const copy = bookingContent.crisisSupport
  return (
    <div
      className="border-warning/40 bg-warning/10 space-y-3 rounded-dashboard-card border p-5"
      role="region"
      aria-labelledby="booking-crisis-title"
    >
      <p id="booking-crisis-title" className="flex items-center gap-2 text-sm font-semibold">
        <WarningCircle size={18} className="text-warning shrink-0" aria-hidden />
        {copy.title}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">{copy.body}</p>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <Phone size={16} className="text-warning mt-0.5 shrink-0" aria-hidden />
          <span>
            <strong className="font-semibold">{copy.emergency}</strong>
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Phone size={16} className="text-warning mt-0.5 shrink-0" aria-hidden />
          <span>
            <strong className="font-semibold">{copy.lifeline}</strong>
          </span>
        </li>
      </ul>
      <p className="text-muted-foreground text-xs leading-relaxed">{copy.practice}</p>
    </div>
  )
}
