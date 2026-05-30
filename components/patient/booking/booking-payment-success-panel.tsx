"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { CheckCircle, Loader2 } from "lucide-react"

import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { Button } from "@/components/ui/button"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { getBookingRequestStatus, type BookingRequestStatusResponse } from "@/src/patient/booking/api"

const MAX_POLL_ATTEMPTS = 24

export function BookingPaymentSuccessPanel() {
  const searchParams = useSearchParams()
  const bookingRequestId = searchParams.get("bookingRequestId")?.trim() ?? ""
  const [status, setStatus] = React.useState<BookingRequestStatusResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isConfirming, setIsConfirming] = React.useState(true)

  React.useEffect(() => {
    if (!bookingRequestId) {
      setError("Missing booking reference. Return to booking and try again.")
      setIsConfirming(false)
      return
    }

    let cancelled = false
    let attempts = 0

    const pollOnce = async () => {
      const next = await getBookingRequestStatus(bookingRequestId)
      if (cancelled) {
        return
      }
      setStatus(next)
      if (next.state === "appointment_confirmed") {
        setIsConfirming(false)
        return
      }
      attempts += 1
      if (attempts >= MAX_POLL_ATTEMPTS) {
        setIsConfirming(false)
        setError("Payment is still processing. Refresh this page in a moment or check your appointments.")
      }
    }

    void pollOnce()
    const interval = window.setInterval(() => {
      if (cancelled) {
        return
      }
      void pollOnce()
    }, 2500)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [bookingRequestId])

  if (!bookingRequestId) {
    return (
      <section className="space-y-6">
        <PatientPageHeader title="Payment" description="We could not find your booking reference." />
        <DashboardStateBlock variant="error" message={error ?? "Missing booking reference."} />
        <Button asChild>
          <Link href="/patient/book-appointment">Back to booking</Link>
        </Button>
      </section>
    )
  }

  const confirmed = status?.state === "appointment_confirmed"

  return (
    <section className="space-y-6" data-tutorial="patient.page.booking-payment-success">
      <PatientPageHeader
        title={confirmed ? "Booking confirmed" : "Confirming payment"}
        description={
          confirmed
            ? "Your payment was received. Your telehealth appointment is confirmed."
            : "Please wait while we confirm your payment with our payment provider."
        }
      />

      {isConfirming && !confirmed && !error ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Confirming your payment…
        </div>
      ) : null}

      {confirmed ? (
        <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={16} aria-hidden />
            Appointment confirmed
          </p>
          <p className="text-sm text-muted-foreground">
            A receipt is available under Billing. You can join your session from Appointments when the chat window opens.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild size="sm">
              <Link href="/patient/appointments">View appointments</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/patient/invoices">View receipt</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <DashboardStateBlock variant="error" message={error} /> : null}

      {status ? (
        <div className="rounded-lg border border-border/60 bg-background p-4 text-xs text-muted-foreground">
          <p>
            Request ID: <span className="font-medium text-foreground">{status.bookingRequestId}</span>
          </p>
          <p>
            Status: <span className="font-medium text-foreground">{status.state.replaceAll("_", " ")}</span>
          </p>
          <p>
            Next: <span className="font-medium text-foreground">{status.nextAction}</span>
          </p>
        </div>
      ) : null}
    </section>
  )
}
