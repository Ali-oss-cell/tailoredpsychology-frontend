# Wave 6 Scheduling Redesign Plan

This wave upgrades booking UX from broad availability windows to real clinician + schedule slot selection.

## Goals

- Let patients choose a clinician (or no preference).
- Let patients choose a real date and time slot from schedule availability.
- Reduce repeated form burden by splitting booking paths:
  - Initial appointment (full intake)
  - Follow-up appointment (delta-only updates)

## Scope

- Booking route: `/appointments/book-appointment`
- Existing booking components under `components/patient/booking/*`
- Existing booking data contract under `src/patient/booking/types.ts`
- Existing booking content under `content/patient-booking.ts`

## Planned changes

1. Add booking mode and schedule model
   - `bookingType: initial | follow_up`
   - `selectedClinicianId`
   - `selectedDate`
   - `selectedSlotId`
   - `changesSinceLastVisit`

2. Add clinician selection UX
   - List of clinician cards with specialty and next available hint
   - Include "no preference" option

3. Add schedule selection UX
   - Date selector from available schedule dates
   - Slot selector for selected date
   - Validation that slot must be selected before continue

4. Conditional intake burden
   - Initial booking: full intake sections
   - Follow-up booking: brief update fields only

5. Keep referral flow conditional
   - Show referral upload step for initial or changed referral context

## Done criteria

- No more morning/afternoon/evening selection.
- Clinician and slot selection is required before submission.
- Follow-up flow asks significantly fewer fields than initial flow.
- Submission summary includes selected clinician and slot.
- `typecheck`, `lint`, and `build` pass.
