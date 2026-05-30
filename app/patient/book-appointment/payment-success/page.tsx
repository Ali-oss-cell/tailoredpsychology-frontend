import { BookingPaymentSuccessPanel } from "@/components/patient/booking/booking-payment-success-panel"
import { PatientShell } from "@/components/patient/patient-shell"
import { Suspense } from "react"

export default function BookingPaymentSuccessPage() {
  return (
    <PatientShell activeRoute="appointments">
      <Suspense fallback={null}>
        <BookingPaymentSuccessPanel />
      </Suspense>
    </PatientShell>
  )
}
