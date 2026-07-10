"use client"

import Link from "next/link"
import { CheckCircle } from "@phosphor-icons/react"

import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"

export function BookingSubmittedStep() {
  const { submittedStatus } = useBookingWizardContext()

  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
      <p className="flex items-center gap-2 text-sm font-medium">
        <CheckCircle
          size={16}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
          aria-hidden
        />
        Booking request submitted
      </p>
      <p className="text-sm">
        Thanks. Your intake has been submitted. We will review referral details and contact you with matched
        telehealth options.
      </p>
      <p>
        <Link
          href="/patient/dashboard"
          className="text-primary rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Go to dashboard
        </Link>
        {" · "}
        <Link
          href="/patient/appointments"
          className="text-primary rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          View your appointments
        </Link>
      </p>
      {submittedStatus ? (
        <div className="bg-background/70 rounded-md border border-primary/30 p-3 text-xs">
          <p>
            Request ID: <span className="font-medium">{submittedStatus.bookingRequestId}</span>
          </p>
          <p>
            Status: <span className="font-medium">{submittedStatus.state.replaceAll("_", " ")}</span>
          </p>
          <p>
            Next action: <span className="font-medium">{submittedStatus.nextAction}</span>
          </p>
          {submittedStatus.referralDocumentId ? (
            <p>
              Referral document: <span className="font-medium">{submittedStatus.referralDocumentId}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
