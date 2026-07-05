"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { CheckCircle, CircleNotch } from "@phosphor-icons/react"

import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { getBookingRequestStatus, type BookingRequestStatusResponse } from "@/src/patient/booking/api"
import { invalidatePatientBookingConfirmation } from "@/src/patient/queries/invalidate"

const MAX_POLL_ATTEMPTS = 24

export function BookingPaymentSuccessPanel() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const bookingRequestId = searchParams.get("bookingRequestId")?.trim() ?? ""
  const [status, setStatus] = React.useState<BookingRequestStatusResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isConfirming, setIsConfirming] = React.useState(true)
  const hasInvalidatedRef = React.useRef(false)

  React.useEffect(() => {
    if (!bookingRequestId) {
      setError("Missing booking reference. Return to booking and try again.")
      setIsConfirming(false)
      return
    }

    let cancelled = false
    let attempts = 0

    const pollOnce = async () => {
      try {
        const next = await getBookingRequestStatus(bookingRequestId)
        if (cancelled) {
          return
        }
        setStatus(next)
        if (next.state === "appointment_confirmed") {
          setIsConfirming(false)
          if (!hasInvalidatedRef.current) {
            hasInvalidatedRef.current = true
            void invalidatePatientBookingConfirmation(queryClient)
          }
          return
        }
        attempts += 1
        if (attempts >= MAX_POLL_ATTEMPTS) {
          setIsConfirming(false)
          setError("Payment is still processing. Refresh this page in a moment or check your appointments.")
        }
      } catch {
        if (!cancelled) {
          setIsConfirming(false)
          setError("Could not confirm payment status. Check your appointments or try refreshing.")
        }
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
  }, [bookingRequestId, queryClient])

  if (!bookingRequestId) {
    return (
      <PatientPortalPage
        title="Payment"
        description="We could not find your booking reference."
        eyebrow="Booking"
        showJourney
        tutorialId="patient.page.booking-payment-success"
      >
        <DashboardStateBlock variant="error" message={error ?? "Missing booking reference."} />
        <Button asChild>
          <Link href="/patient/book-appointment">Back to booking</Link>
        </Button>
      </PatientPortalPage>
    )
  }

  const confirmed = status?.state === "appointment_confirmed"

  return (
    <PatientPortalPage
      title={confirmed ? "Booking confirmed" : "Confirming payment"}
      description={
        confirmed
          ? "Your payment was received. Your telehealth appointment is confirmed."
          : "Please wait while we confirm your payment with our payment provider."
      }
      eyebrow="Booking"
      showJourney
      tutorialId="patient.page.booking-payment-success"
    >
      {isConfirming && !confirmed && !error ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-4 text-sm">
          <CircleNotch className="animate-spin" size={16} aria-hidden />
          Confirming your payment…
        </div>
      ) : null}

      {confirmed ? (
        <Card className="shadow-e2 border-primary/30 bg-primary/5">
          <CardContent className="space-y-3 pt-6">
            <p className="card-eyebrow">Confirmed</p>
            <p className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle size={16} className="text-primary" aria-hidden />
              Appointment confirmed
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your dashboard and journey will update automatically. A receipt is available under Billing. Join your session
              from Appointments when the chat window opens.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href="/patient/dashboard">Go to dashboard</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/patient/appointments">View appointments</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/patient/invoices">View receipt</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {error ? <DashboardStateBlock variant="error" message={error} /> : null}

      {status ? (
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-xs text-muted-foreground">
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
    </PatientPortalPage>
  )
}
