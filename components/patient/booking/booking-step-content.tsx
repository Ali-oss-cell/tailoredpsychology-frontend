"use client"

import type { BookingStepId } from "@/src/patient/booking/types"

import { BookingClinicalStep } from "@/components/patient/booking/steps/booking-clinical-step"
import { BookingConsentStep } from "@/components/patient/booking/steps/booking-consent-step"
import { BookingMedicareStep } from "@/components/patient/booking/steps/booking-medicare-step"
import { BookingModeStep } from "@/components/patient/booking/steps/booking-mode-step"
import { BookingReasonStep } from "@/components/patient/booking/steps/booking-reason-step"
import { BookingReferralStep } from "@/components/patient/booking/steps/booking-referral-step"
import { BookingReviewStep } from "@/components/patient/booking/steps/booking-review-step"
import { BookingScheduleStep } from "@/components/patient/booking/steps/booking-schedule-step"
import { BookingSubmittedStep } from "@/components/patient/booking/steps/booking-submitted-step"

export function BookingStepContent({ step }: { step: BookingStepId }) {
  switch (step) {
    case "mode":
      return <BookingModeStep />
    case "reason":
      return <BookingReasonStep />
    case "medicare":
      return <BookingMedicareStep />
    case "clinical":
      return <BookingClinicalStep />
    case "referral":
      return <BookingReferralStep />
    case "schedule":
      return <BookingScheduleStep />
    case "consent":
      return <BookingConsentStep />
    case "review":
      return <BookingReviewStep />
    case "submitted":
      return <BookingSubmittedStep />
    default:
      return null
  }
}
