# Wave 7 Requirements Checklist

This is the execution-grade checklist for Wave 7 business requirements.

Status values:
- `Not started`
- `In progress`
- `Blocked`
- `Done`
- `Deferred`

Priority values:
- `P0` Critical
- `P1` High
- `P2` Medium

Owner roles:
- `Product`
- `Clinical`
- `Ops`
- `Frontend`
- `Backend`
- `Security`
- `Data`

---

## A) Lifecycle and Journey Requirements

### Canonical patient lifecycle state dictionary (W8A-01)

| State ID | Label | Primary owner | Entry trigger | Exit trigger (examples) |
|---|---|---|---|---|
| `discover` | Discover | Patient | Public site visit or campaign entry | Starts pre-screen / registration |
| `pre_screen` | Pre-screen | Patient/Ops | Starts eligibility/intake pre-check | Eligible -> account setup, ineligible -> closed |
| `account_created` | Account created | Patient | Registration completed | Starts intake/booking |
| `intake_draft` | Intake draft | Patient | Intake started but not submitted | Submit intake / abandon timeout |
| `intake_submitted` | Intake submitted | Patient | Intake + booking request submitted | Ops/clinical triage starts |
| `triage_review` | Triage review | Ops/Clinical | Intake enters queue | Assign clinician / request more info / urgent escalation |
| `matched_pending_confirmation` | Matched pending confirmation | Ops | Clinician/time proposed | Confirmed / reassignment / cancellation |
| `appointment_confirmed` | Appointment confirmed | Ops/Patient | Slot and clinician confirmed | Enters session prep window |
| `session_prep` | Session prep | Patient/Clinical | Within pre-session readiness window | Session started / no-show / cancelled |
| `session_in_progress` | Session in progress | Clinical | Session starts | Session ends / interrupted |
| `post_session_followup` | Post-session follow-up | Clinical/Ops | Session completed | Care plan update / discharge decision |
| `ongoing_care` | Ongoing care | Clinical | Active treatment cadence | Future appointment scheduled / discharge |
| `inactive_or_discharged` | Inactive/discharged | Ops/Clinical | Discharge completed or inactive timeout | Reactivation path starts |

### Transition ownership matrix (minimum)

| From | To | Allowed actor(s) | Rule notes |
|---|---|---|---|
| `discover` -> `pre_screen` | Patient | Start intent captured |
| `pre_screen` -> `account_created` | Patient | Eligibility pass |
| `account_created` -> `intake_draft` | Patient | Intake initiated |
| `intake_draft` -> `intake_submitted` | Patient | Required fields + consents valid |
| `intake_submitted` -> `triage_review` | Ops/system | Queue ingest SLA starts |
| `triage_review` -> `matched_pending_confirmation` | Ops/Clinical | Clinician candidate selected |
| `triage_review` -> `session_prep` | Clinical/Ops | Urgent fast-track path |
| `matched_pending_confirmation` -> `appointment_confirmed` | Patient/Ops | Confirmation accepted |
| `appointment_confirmed` -> `session_prep` | System | T-30 readiness window |
| `session_prep` -> `session_in_progress` | Patient + Clinical | Join flow and checks passed |
| `session_in_progress` -> `post_session_followup` | Clinical | Session complete |
| `post_session_followup` -> `ongoing_care` | Clinical | Care plan active |
| `post_session_followup` -> `inactive_or_discharged` | Clinical/Ops | Discharge criteria met |
| `ongoing_care` -> `session_prep` | Patient/Ops | New appointment confirmed |
| `ongoing_care` -> `inactive_or_discharged` | Clinical/Ops | Treatment closure |

Invalid transitions must return contract error (`409 Conflict`) with machine-readable code and remain unchanged in state.

| ID | Requirement | Owner | Priority | API dependency | Acceptance criteria | Compliance note | Status |
|---|---|---|---|---|---|---|---|
| BR-001 | Define canonical patient lifecycle states end-to-end | Product | P0 | None | Lifecycle states documented and approved by Product + Clinical + Ops | Healthcare workflow traceability | Not started |
| BR-002 | Define state transition rules and who can transition each state | Product/Ops | P0 | `POST /lifecycle/transition` (future) | Transition table exists with role constraints and invalid-transition handling | Access control and auditability | Not started |
| BR-003 | Define SLA timer per lifecycle state | Ops | P1 | Alerting service (future) | SLA targets exist for intake review, booking confirmation, and pre-session readiness | Service quality assurance | Not started |
| BR-004 | Define stuck-state alerts and escalation rules | Ops | P1 | `GET /booking-requests/:id/status` | Escalation matrix documented with trigger thresholds | Patient safety and continuity | Not started |

---

## B) Patient Data Domain Requirements

| ID | Requirement | Owner | Priority | Data fields | Acceptance criteria | Compliance note | Status |
|---|---|---|---|---|---|---|---|
| BR-101 | Identity model includes legal name and preferred name | Product/Frontend | P0 | `legalName`, `preferredName` | UI + schema include both fields and display policy | Identity integrity | Not started |
| BR-102 | Pronouns and language accessibility fields | Product/Frontend | P1 | `pronouns`, `preferredLanguage`, `interpreterNeeded` | Fields available and optionality defined | Inclusive care | Not started |
| BR-103 | Contact channel consent preferences | Product/Frontend | P0 | `contactSmsAllowed`, `contactEmailAllowed`, `contactPhoneAllowed` | Per-channel consent captured and editable | Privacy and consent | Not started |
| BR-104 | Alternate contact and emergency contact separation | Product/Clinical | P1 | `alternateContact*`, `emergencyContact*` | Both modeled with clear intent and validation | Safety planning | Not started |
| BR-105 | AU address normalization policy | Frontend/Backend | P1 | `suburb`, `state`, `postcode` | Validation and normalization rules documented | Data quality | Not started |
| BR-106 | Structured clinical concern taxonomy | Clinical/Product | P0 | `concernCategory[]`, `freeTextContext` | Taxonomy list approved and mapped to free text fallback | Clinical triage support | Not started |
| BR-107 | Structured risk protocol fields | Clinical | P0 | `riskLevel`, `riskFactors[]`, `immediateSupportNeeded` | Risk protocol fields and actions documented | Safety-critical | Not started |
| BR-108 | Clinical history flags | Clinical | P1 | `historyHospitalization`, `historySelfHarm`, `historySubstanceUse` | Flags integrated into intake model with optional notes | Clinical safety | Not started |
| BR-109 | Referral validity and status pipeline | Ops/Backend | P0 | `referralStatus`, `referralValidUntil`, `reviewOutcome` | Status lifecycle defined and usable in UI state | Medicare readiness | Not started |
| BR-110 | Medicare entitlement tracking model | Ops/Backend | P0 | `sessionsUsed`, `sessionsRemaining`, `entitlementYear` | Session counters and rules documented | Rebate integrity | Not started |

---

## C) Dynamic Rules and Conditional Logic

| ID | Rule | Owner | Priority | Trigger condition | Required action | Acceptance criteria | Status |
|---|---|---|---|---|---|---|---|
| BR-201 | Follow-up with no change skips full intake | Product/Frontend | P0 | `bookingType=follow_up` and `changes=no` | Skip non-essential steps and fields | UX path verified end-to-end | In progress |
| BR-202 | Missing referral + Medicare intent shows guidance | Product/Frontend | P0 | `hasReferral=no` and Medicare path selected | Show explicit guidance and downstream expectation warning | Guidance appears in relevant steps and review screen | Not started |
| BR-203 | Urgent risk fast-track behavior | Clinical/Ops | P0 | `riskLevel=urgent` | Trigger fast-track queue and support messaging | Fast-track state and handoff documented | Not started |
| BR-204 | Conditional referral upload step visibility | Frontend | P1 | Initial booking or referral changed | Show referral upload step | Step visibility matches rule matrix | In progress |
| BR-205 | Conditional consent variants by context | Product/Security | P1 | Minor patient or guardian flow (future) | Swap consent set and reviewer requirements | Variant requirements documented | Not started |

---

## D) Telehealth-First and Pre-Session Chat Window

| ID | Requirement | Owner | Priority | Data fields/events | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| BR-301 | Session location confirmation before telehealth join | Clinical/Frontend | P0 | `currentSessionLocation`, `confirmedAt` | Mandatory check before join action | Deferred (Wave 17 alignment decision, 2026-05-04) |
| BR-302 | Device-readiness preflight requirement | Product/Frontend | P1 | `micCheck`, `cameraCheck`, `networkCheck` | Preflight UX and outcomes documented | Deferred (Wave 17 alignment decision, 2026-05-04) |
| BR-303 | Pre-session chat opens at T-30 minutes | Product/Backend | P0 | `chatWindowStatus`, `opensAt`, `appointmentStartAt` | Chat remains locked before T-30 and opens automatically at T-30 | Done (`appointments.service.ts` `chatWindowOpenAt` = start − 30m; `computeWindowStatus`) |
| BR-304 | Pre-session chat auto-close policy | Product/Backend | P0 | `closedReason`, `closedAt` | Auto-close when session joined/cancelled/no-show timeout | Partial (`computeWindowStatus` closes on completed/cancelled/no_show and after `chatWindowCloseAt`) |
| BR-305 | Chat visibility permissions | Security/Ops | P1 | `participantRole`, `appointmentId` | Only patient + assigned clinician (+ approved escalation roles) can access | Partial (JWT + appointment-scoped chat join; ops escalation TBD) |

---

## E) Storage, Security, and Audit Requirements

| ID | Requirement | Owner | Priority | API dependency | Acceptance criteria | Compliance note | Status |
|---|---|---|---|---|---|---|---|
| BR-401 | Canonical entities defined for intake/booking/referrals | Backend | P0 | Core domain APIs | Entity dictionary approved and versioned | Data governance | Not started |
| BR-402 | Append-only event log for sensitive transitions | Backend/Security | P0 | Event service | All sensitive lifecycle transitions produce immutable events | Audit readiness | Not started |
| BR-403 | Field-level audit for sensitive edits | Backend | P1 | `PATCH` endpoints | Actor, old value, new value, reason logged | Compliance traceability | Not started |
| BR-404 | Referral document secure storage policy | Security/Backend | P0 | Document upload API | Storage class, access policy, and retention documented | PHI handling | Partial (`POST /documents/referrals`, `referral_documents` table; policy doc in `RETENTION_AND_DELETION_POLICY_AU.md`) |
| BR-405 | Consent versioning and withdrawal support | Product/Security | P0 | `POST /consents`, `POST /consents/withdraw` | Versioned records and withdrawal workflow defined | Legal defensibility | Partial (`auth/consents/accept`, `auth/consents/withdraw`, `patient_consents` in DB) |
| BR-406 | Data retention and soft-delete policy | Security/Backend | P1 | Data lifecycle jobs | Retention windows and deletion behavior documented | Privacy and records law alignment | Not started |

---

## F) UX, Analytics, and Operational Readiness

| ID | Requirement | Owner | Priority | KPI | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| BR-501 | Unified status timeline for patient | Product/Frontend | P1 | Step completion rate | Timeline states visible and understandable in patient portal | Not started |
| BR-502 | Save/resume across devices | Product/Backend | P1 | Draft completion recovery rate | Resume available on different devices after login | Not started |
| BR-503 | Intake drop-off analytics by step | Data/Product | P1 | Drop-off by step | Event schema and dashboard definitions approved | Not started |
| BR-504 | Time-to-first-appointment metric | Data/Ops | P1 | Median TTFA | Calculation definition and data source documented | Not started |
| BR-505 | Referral completeness rate metric | Data/Ops | P2 | Completeness ratio | Metric definition and threshold alerts documented | Not started |
| BR-506 | No-show and telehealth completion metrics | Data/Ops | P1 | No-show %, completion % | Metrics defined and reporting cadence assigned | Not started |

---

## G) API Contract Readiness (Minimum)

| ID | Endpoint | Owner | Priority | Purpose | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| BR-601 | `GET /clinicians/availability` | Backend | P0 | Dynamic schedule source | Supports date range, clinician filter, slot status | Done (`appointments.controller.ts` `GET clinicians/availability`) |
| BR-602 | `POST /booking-requests` | Backend | P0 | Persist booking request and lifecycle start | Validation and response contract approved | Done (`POST booking-requests`, Prisma + in-memory) |
| BR-603 | `POST /documents/referrals` | Backend | P0 | Secure referral upload and metadata creation | Upload result includes document ID/status | Done (`resources.controller.ts` `POST documents/referrals`) |
| BR-604 | `GET /patients/:id/intake-latest` | Backend | P1 | Follow-up prefill source | Returns latest intake snapshot + version | Not started |
| BR-605 | `POST /patients/:id/intake-delta` | Backend | P1 | Save update-only changes | Delta model and merge policy documented | Not started |
| BR-606 | `GET /patients/:id/medicare-status` | Backend | P1 | Show entitlement/rebate readiness | Returns counters and status flags | Not started |
| BR-607 | `POST /consents` | Backend | P0 | Store consent version records | Contract includes policy version and timestamp | Partial (`POST auth/consents/accept` + `patient_consents`; path differs from spec) |
| BR-608 | `GET /booking-requests/:id/status` | Backend | P1 | Patient-visible progress tracking | Returns state + last updated + next action | Partial (status via booking request APIs — verify contract in `appointments.controller.ts`) |

---

## Final Review Gate

- [ ] Product signs off lifecycle and UX rules
- [ ] Clinical signs off safety/risk and referral pathways
- [ ] Ops signs off queue and SLA model
- [ ] Security signs off consent/privacy/audit requirements
- [ ] Frontend and Backend sign off contract alignment
- [ ] Wave 8 implementation plan can be generated from this checklist

