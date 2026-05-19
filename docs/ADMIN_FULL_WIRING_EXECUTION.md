# Admin Full Wiring Execution Plan

This is the execution tracker to finish all admin tabs with real API-backed functionality.

## Goal

- Every admin tab must load real backend data.
- Every admin action button must call a real endpoint.
- No placeholder-only admin workflow remains on production-critical routes.

## Frontend API Standard (keep this)

- Use native `fetch` via typed domain modules in `frontend/src/**/api.ts`.
- Keep `ensureBackendAccessToken()` auth handling.
- Keep consistent loading/error/empty states using `DashboardStateBlock`.
- Add route-level and feature-level tests for each newly wired tab.

## Current Admin Tab Status

*Reconciled 2026-05-09 (Wave 19): backend `GET /api/admin/ops/*` exists; frontend pages call `src/admin/ops/api.ts`.*

- `admin/dashboard`: `functional` (ops insights, telehealth insights, referrals queue, intake queue)
- `admin/users`: `functional` (psychologist management card with API)
- `admin/referrals`: `functional` (referral queue and actions)
- `admin/privacy-requests`: `functional` (patient data request queue card)
- `admin/security-incidents`: `functional` (incident register + transitions)
- `admin/audit-logs`: `functional` (audit event list)
- `admin/data-deletion`: `functional` (`GET admin/ops/deletion-queue` with filters)
- `admin/appointments`: `functional` (`GET admin/ops/appointments`)
- `admin/patients`: `functional` (`GET admin/ops/patients`)
- `admin/staff`: `functional` (`GET admin/ops/staff`)
- `admin/settings`: `functional` (`GET admin/ops/settings` — domain snapshot)
- `admin/resources`: `functional` (`GET admin/ops/resources` — referral governance list)
- `admin/billing`: `functional` (`GET admin/ops/billing` summary)
- `admin/analytics`: `functional` (`GET admin/ops/analytics-summary`)

## One-by-One Wiring Order

### Phase A: Finish Existing Partial Tabs (highest value first)

- [ ] `A1 admin/appointments`
  - Backend: implement `GET /api/admin/ops/appointments`
  - Frontend: replace generic snapshot with typed appointment ops list
  - Actions: reschedule/cancel/escalate where policy allows
  - Tests: backend e2e + frontend page tests

- [ ] `A2 admin/patients`
  - Backend: implement `GET /api/admin/ops/patients`
  - Frontend: typed patient ops table (risk, intake state, retention flags)
  - Actions: open profile, legal-hold jump, privacy request jump
  - Tests: role guard + render + state tests

- [ ] `A3 admin/staff`
  - Backend: implement `GET /api/admin/ops/staff`
  - Frontend: typed staff roster (role, status, clinician credentials)
  - Actions: open staff detail, enable/disable where allowed
  - Tests: backend contract + frontend interaction tests

- [ ] `A4 admin/resources`
  - Backend: implement `GET /api/admin/ops/resources`
  - Frontend: typed governance queue (draft/published/archive state)
  - Actions: publish/archive/flag with audit
  - Tests: transition and role tests

### Phase B: Upgrade Partial Compliance/Ops Pages

- [ ] `B1 admin/data-deletion`
  - Remove hardcoded patient IDs (`user_patient_001`, `user_patient_002`)
  - Backend: add queue endpoint for retention/deletion triage list if needed
  - Frontend: paginate/filter queue by state (`legal_hold`, `purge_eligible`, `deleted`)
  - Tests: real queue rendering + filters

- [ ] `B2 admin/billing`
  - Backend: harden `GET /api/admin/ops/billing` shape (typed DTO)
  - Frontend: show revenue, failed payments, pending claims with drilldown links
  - Tests: DTO and page rendering tests

- [ ] `B3 admin/analytics`
  - Backend: harden `GET /api/admin/ops/analytics-summary` shape (typed DTO)
  - Frontend: split module cards (throughput, referral conversion, no-show trend)
  - Tests: backend summary contract + frontend render tests

- [ ] `B4 admin/settings`
  - Backend: implement `GET /api/admin/ops/settings` with real domain statuses
  - Frontend: config domains with read-only operational health and owner
  - Tests: permission and rendering tests

## Functional Additions Required (not cosmetic)

- [ ] Add typed DTOs for all `admin/ops/*` endpoints (no `Record<string, unknown>` responses).
- [ ] Add stable error payload mapping in frontend API modules.
- [ ] Add pagination/filter query params for heavy admin lists.
- [ ] Add audit events for any write action introduced during wiring.
- [ ] Add route smoke tests for all admin tabs after wiring.
- [ ] Update `backend/docs/API_CONTRACT.md` and `backend/docs/API_CONTRACT_MATRIX.md` per endpoint.
- [ ] Update `frontend/docs/routes-overview.md` and `frontend/docs/role-matrix.md` as behavior changes.

## Definition of Done (per tab)

- [ ] Uses real backend endpoint(s) only.
- [ ] Has loading, error, empty, and success states.
- [ ] No dead/placeholder action buttons.
- [ ] Role/permission behavior tested.
- [ ] API contract and docs updated.

## Execution Notes

- Keep compatibility with DB-first workflow.
- Prefer shipping each tab fully (backend + frontend + tests + docs) before moving to next tab.
- Do not introduce Axios migration during this pass; focus on wiring and correctness.
