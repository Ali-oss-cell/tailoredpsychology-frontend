import { BookingPaymentSuccessPanel } from "@/components/patient/booking/booking-payment-success-panel"
import { Suspense } from "react"

export default function BookingPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingPaymentSuccessPanel />
    </Suspense>
  )
}
