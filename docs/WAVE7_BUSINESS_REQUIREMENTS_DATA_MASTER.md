# Wave 7 Business Requirements and Data Master Plan

This wave converts product goals into a structured, detailed checklist for patient data, lifecycle clarity, dynamic behavior, and telehealth readiness.

## Goals

- Make the full patient journey clear, easy, and consistent.
- Collect the right data once, then request only deltas in follow-up journeys.
- Define what must be dynamic vs static.
- Define storage expectations and data ownership boundaries.
- Add a timed pre-session chat channel that opens 30 minutes before video sessions.

## Scope

- Patient journey and business requirements only (no backend implementation in this wave).
- Frontend-facing requirements, data contracts, and operational expectations.
- Telehealth-first model coverage.

## Wave 7A: Patient Lifecycle State Design

Define a single lifecycle model as source of truth:

1. Lead Created
2. Account Registered
3. Intake In Progress
4. Intake Submitted
5. Booking Requested
6. Appointment Confirmed
7. Pre-Session Window Open
8. Session In Progress
9. Post-Session Follow-up
10. Ongoing Care
11. Discharged / Inactive

### Required outputs

- Lifecycle state dictionary with entry/exit criteria.
- Transition ownership map (patient, psychologist, manager/admin, system automation).
- SLA targets per state.

## Wave 7B: Patient Data Domain Matrix (Required vs Optional)

Build field-level matrix by booking type and lifecycle stage.

### Domains

- Identity and contact
- Clinical summary
- Risk and safety
- Medicare and referral
- Telehealth logistics
- Preferences and accessibility
- Consent and legal
- Billing and rebate indicators
- Engagement and retention

### Required outputs

- `required`/`optional`/`conditional` policy for each field.
- Initial vs follow-up data burden policy.
- Field deprecation and versioning notes.

## Wave 7C: Dynamic Rules Catalog

Create explicit dynamic behavior rules.

### Rule families

- Conditional step visibility
- Conditional required fields
- Telehealth safety gating
- Referral/MHTP guidance branching
- Booking fast-track for urgent flags
- Follow-up minimal-flow logic

### Required outputs

- Rule ID catalog (`BR-###` format).
- Condition and action descriptions.
- Fallback behavior for missing upstream data.

## Wave 7D: Data Storage and Audit Requirements

Define how data should be stored and tracked correctly.

### Required entities

- PatientProfile
- IntakeSubmission
- BookingRequest
- Appointment
- ReferralDocument
- ConsentRecord
- TelehealthSessionWindow
- SessionNoteSummary (metadata only at this stage)

### Required outputs

- Data ownership boundaries (frontend payload vs backend canonical).
- Audit trail requirements for sensitive updates.
- Retention/archival expectations.

## Wave 7E: Telehealth Pre-Session Chat Window

Add business requirement for a short-lived chat channel.

### Requirement

- Chat channel becomes available exactly **30 minutes before appointment start**.
- Chat channel closes automatically when:
  - Session starts and video room is joined, or
  - Appointment is marked no-show/cancelled, or
  - 15 minutes after scheduled start without join (configurable).

### Purpose

- Last-minute instructions and troubleshooting.
- Secure pre-session communication without keeping chat open all day.

### Data/events needed

- Appointment start timestamp
- Participant role and identity
- Chat window status (`locked`, `open`, `closed`)
- Open/close audit events
- Unread count and message retention policy

### UX requirements

- Locked state message before T-30.
- Auto-open state at T-30 with clear timer.
- Auto-close state with reason.
- Role-safe visibility (patient, assigned psychologist, optionally operations support if escalation flag).

## Wave 7F: Completeness Check ("Do we have everything?")

Use this checklist to validate coverage.

### Journey completeness

- [ ] All lifecycle states defined
- [ ] State transitions mapped
- [ ] SLA per state defined
- [ ] Error/recovery path per state defined

### Data completeness

- [ ] Required/optional/conditional matrix finalized
- [ ] Initial vs follow-up burden policy finalized
- [ ] Validation and normalization rules defined
- [ ] Document metadata requirements finalized

### Dynamic behavior completeness

- [ ] Rules catalog with IDs finalized
- [ ] Feature flags identified for staged rollout
- [ ] Graceful fallback behavior documented

### Telehealth completeness

- [ ] Pre-session chat window requirement approved
- [ ] Session location and emergency flows approved
- [ ] Device-readiness and fallback path documented

### Governance completeness

- [ ] Ownership assigned to product/clinical/ops/engineering
- [ ] Acceptance criteria per requirement
- [ ] Change control process for requirement updates

## Deliverables

- This wave plan (`WAVE7_BUSINESS_REQUIREMENTS_DATA_MASTER.md`)
- Master checklist (`WAVE7_REQUIREMENTS_CHECKLIST.md`) - to be generated in execution wave
- Role review log (`WAVE7_REVIEW_NOTES.md`) - to be generated in execution wave

## Out of Scope (Wave 7)

- Backend implementation details
- OCR extraction pipeline implementation
- Real-time chat engineering implementation
- Billing engine implementation

