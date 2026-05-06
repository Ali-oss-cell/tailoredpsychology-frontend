# Wave 6 Booking Scheduler QA Matrix

This matrix tracks validation for the scheduling-first redesign of booking flow.

## Route coverage

- [x] `/appointments/book-appointment`

## Experience coverage

- [x] Booking mode selection: `initial` vs `follow_up`
- [x] Clinician selection includes explicit "no preference" path
- [x] Date selection uses available schedule dates
- [x] Time selection uses schedule slots filtered by clinician when applicable
- [x] Follow-up mode supports reduced data entry when no changes are reported
- [x] Referral step remains conditional and supports store-only PDF workflow
- [x] Review step shows clinician/date/time summary before submit

## Validation checks

- [x] Clinician/date/slot required before continuing from schedule step
- [x] Initial mode requires full identity and intake fields
- [x] Follow-up mode permits minimal path with lower mandatory burden
- [x] Consent step blocks submission until all required acknowledgements are checked

## Quality checks

- [x] Draft persistence remains active for non-file fields
- [x] Stepper and navigation remain stable across conditional steps
- [x] `typecheck`, `lint`, and `build` pass
