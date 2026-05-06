# Wave 5 Booking QA Matrix

This matrix tracks validation for the telehealth-first AU booking intake flow.

## Route coverage

- [x] `/appointments/book-appointment`

## Step coverage

- [x] Step 1: Reason and urgency
- [x] Step 2: Medicare and referral path
- [x] Step 3: Clinical background + telehealth safety
- [x] Step 4: Referral PDF upload (store-only)
- [x] Step 5: Preferences and availability
- [x] Step 6: Consent checklist
- [x] Step 7: Review and submit

## UX and validation checks

- [x] Multi-step flow has clear progress indicator and back/continue actions
- [x] Required fields block forward navigation with inline error summary
- [x] Conditional Medicare/referral fields only appear when relevant
- [x] Telehealth safety fields are included (location + emergency contact)
- [x] Referral upload enforces PDF-only and max size (8MB)
- [x] Draft persistence works locally for non-file fields
- [x] Submission moves to confirmation state and clears local draft

## Architecture checks

- [x] Route uses `PatientShell` and existing patient role guards
- [x] Intake model is typed (`src/patient/booking/types.ts`)
- [x] Content/config separated from UI (`content/patient-booking.ts`)
- [x] Shared booking primitives extracted under `components/patient/booking/*`
