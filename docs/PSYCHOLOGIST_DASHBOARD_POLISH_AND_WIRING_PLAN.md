# Psychologist Dashboard Polish and Full API Wiring Plan

This document captures what is currently incomplete and the exact implementation plan to make the psychologist (doctor) experience production-ready.

## What Is Missing Right Now

## 1) Psychologist route registration is incomplete

Current route config includes only:

- `/psychologist/dashboard`
- `/psychologist/patients`
- `/psychologist/recordings`

Missing from route registry:

- `/psychologist/schedule`
- `/psychologist/notes`
- `/psychologist/profile`
- `/psychologist/patients/:patientId`

Impact:

- Some tabs appear in the shell but are not fully governed by `route-config` access/permission rules.
- Documentation and access checks can drift from actual UI.

## 2) Patients and patient profile pages are still mostly static

- `frontend/app/psychologist/patients/page.tsx` uses content from static file (`psychologistPatientsContent`), not live API.
- `frontend/app/psychologist/patients/[patientId]/page.tsx` uses `mockPatientProfileContent` only.

Impact:

- Doctor caseload, patient status, and profile details are not trustworthy/live.

## 3) Profile page is minimal and not optimized for clinician identity/trust

- `frontend/app/psychologist/profile/page.tsx` fetches real profile, but layout is basic and editing is placeholder-style (`bio + "(updated)"`).
- No proper AHPRA-focused identity card UX (registration/provider visibility hierarchy and verification style).
- No proper clinician image/avatar workflow beyond generic initials in shell.

## 4) Notes workflow is functional but shallow UX

- `frontend/app/psychologist/notes/page.tsx` is wired to API and sign flow exists.
- Missing richer note editor behavior and better list/detail split.
- Missing quick context alongside note authoring (patient context, referral context, prior note highlights).

## 5) Psychologist referral visibility is not directly exposed in psychologist portal

Backend referral queue exists for ops (`/api/ops/referrals`), but there is no dedicated psychologist-facing referral read surface that is role-appropriate.

Needed:

- read-only or scoped referral context for assigned patients in psychologist area.

## 6) Psychologist cannot download patient full data export PDF via dedicated clinician flow

Current export API is patient-self path:

- `/api/patients/me/data-export/*`

Missing:

- clinician-allowed endpoint(s) with strict assignment + audit controls for patient PDF export access.

## 7) Dashboard cards are partially live and partially static

- Dashboard includes live cards (`notes queue`, `pre-session workspace`, etc.)
- At least one card still injects static content (`TodayScheduleCard` currently receives static entries from content file).

## 8) UI polish gaps across psychologist tabs

- Inconsistent table/list interaction patterns.
- Missing consistent filter bars and actionable empty states.
- Limited visual hierarchy for high-risk clinical data.

---

## Target State (What “Done” Looks Like)

- All psychologist tabs are route-config governed and permission-validated.
- Every tab is API-backed with no static mock as source of truth.
- Profile has premium clinician card (AHPRA-focused details + professional avatar/image).
- Notes are workflow-grade (queue + detail/editor + signoff guardrails + context packet).
- Psychologists can view relevant referrals for their patients.
- Psychologists can request/download patient export PDF only when assignment and policy allow.
- All critical clinician actions are audited.

---

## Implementation Plan

## Phase P1 - Foundation and Routing

- Add missing psychologist routes in `frontend/src/routes/route-config.ts`:
  - `/psychologist/schedule`
  - `/psychologist/notes`
  - `/psychologist/profile`
  - `/psychologist/patients/:patientId`
- Add/update route tests in `frontend/src/routes/route-config.test.ts`.
- Update docs:
  - `frontend/docs/routes-overview.md`
  - `frontend/docs/role-matrix.md`

## Phase P2 - Live Caseload and Patient Profile

- Replace static caseload list in `frontend/app/psychologist/patients/page.tsx` with API.
- Extend psychologist workspace/caseload API (or add dedicated endpoint) to return:
  - patient display name
  - next session
  - risk flags
  - referral state
  - intake completion state
- Replace mock patient profile page (`[patientId]`) with real context API:
  - leverage `/api/psychologists/:id/patients/:patientId/context`
  - include clinical snapshot, referral summary, recent notes, recent sessions.

## Phase P3 - Profile Card Polish (AHPRA + Image)

- Upgrade `frontend/app/psychologist/profile/page.tsx` UI:
  - top “Clinician Identity Card” with:
    - display name
    - AHPRA/registration number
    - provider number
    - status badge
    - specialties chips
  - add profile image/avatar block:
    - Phase 1: generated initials avatar fallback
    - Phase 2: upload URL/image field if backend supports it
- Replace placeholder edit flow with real form state and save/cancel behavior.
- Keep audit logging on profile updates.

## Phase P4 - Notes Experience Upgrade (High Priority)

- Keep existing API integration and improve UX:
  - queue/list + selected note detail panel
  - inline edit for draft/ready_for_signoff only
  - clear signoff confirmation and immutable signed state
  - show minimum dataset completeness indicators before sign
- On note detail, show context panel from patient context endpoint.

## Phase P5 - Psychologist Referral Visibility

- Add clinician-safe referral endpoint(s), e.g.:
  - `GET /api/psychologists/:id/referrals` (scoped to assigned patients)
  - or include referral summary in patient context and workspace responses
- Build psychologist referral card/page:
  - referral status
  - due dates / SLA state where clinically relevant
  - source/type metadata
  - no ops-only admin actions exposed to psychologists

## Phase P6 - Patient Data Export PDF for Clinicians

- Add backend clinician export access flow:
  - create job for patient (assignment-checked)
  - status endpoint
  - download endpoint
- Strict controls:
  - psychologist must be assigned to patient
  - break-glass/legal-hold policy respected
  - full audit trail for request and download
- Add UI action in patient profile:
  - “Request patient PDF export”
  - status chip + download when ready

## Phase P7 - Dashboard Card Completion and Consistency

- Replace static schedule card feed with live API.
- Ensure all cards use consistent loading/error/empty patterns.
- Add consistent filters and actions across tabs using shared components.

---

## UX Polish Standards for Doctor Portal

- High-signal clinical hierarchy (risk/referral flags visually prioritized).
- Consistent top-level filter bars and sortable tables.
- Premium card styling for clinician identity.
- Reusable modal patterns (already started) across all critical actions.
- Strong empty states with next-step actions.
- Accessibility:
  - keyboard navigation
  - focus states
  - modal focus trap and escape handling

---

## API and Security Requirements

- Every new clinician-facing endpoint must enforce:
  - role check (`psychologist`)
  - assignment/ownership check per patient resource
  - legal-hold and retention constraints where relevant
- Audit events required for:
  - profile updates
  - note signoff
  - referral access (if sensitive fields)
  - export request/download

---

## Testing and QA Requirements

- Backend e2e:
  - role guard checks
  - assignment boundary checks
  - legal hold/export policy checks
- Frontend:
  - route presence tests
  - page rendering tests for each psychologist tab
  - action flow tests (notes sign, export request, referral view filters)

---

## Suggested Execution Order

1. Route-config and docs completeness (P1)
2. Live patients list + patient profile context (P2)
3. Profile card polish (AHPRA + image) (P3)
4. Notes UX upgrade (P4)
5. Referral visibility in psychologist portal (P5)
6. Patient export PDF clinician flow (P6)
7. Dashboard card consistency and final polish (P7)

---

## Final Closure Checklist

- [ ] All psychologist tabs are in route-config and tested.
- [ ] No static mock data in psychologist pages.
- [ ] AHPRA/provider details shown in polished clinician identity card.
- [ ] Clinician image/avatar displayed properly with fallback.
- [ ] Notes flow fully usable and clinically safe.
- [ ] Psychologist can view relevant referral data.
- [ ] Psychologist can request/download patient PDF export with policy controls.
- [ ] Docs and API contract updated.
- [ ] Focused frontend/backend test sweeps pass.
