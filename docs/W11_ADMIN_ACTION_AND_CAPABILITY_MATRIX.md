# W11I-01 + W11J-01 Admin Action and Capability Matrix

This document is the audit artifact for:

- `W11I-01` Non-Functional Button and Action Audit
- `W11J-01` Admin Functional Coverage Pass

Status labels used in this matrix:

- `Functional` - UI action is wired and backend capability exists.
- `Partial` - some behavior exists but core workflow is incomplete.
- `Placeholder/Non-functional` - static label/button or no supporting backend contract.

---

## Section A: Admin Route Matrix (Frontend Actions)

## `/admin/dashboard`

- **Sidebar navigation links**: `Functional`
- **Logout**: `Functional`
- **Compliance Mode button**: `Placeholder/Non-functional`
- **Top search input**: `Placeholder/Non-functional`
- **OpsInsightsCard + Retry**: `Functional`
- **TelehealthInsightsCard filters (`All time`, `Last 24h`, `Last 7d`)**: `Partial` (local filter only; no backend query parameter contract)
- **TelehealthInsightsCard Retry**: `Functional`
- **IntakeQueueCard Assign button**: `Functional`
- **IntakeQueueCard Retry**: `Functional`
- **`System KPIs` row action (`Open`)**: `Placeholder/Non-functional`

## `/admin/users`

- **Route shell + nav/logout**: `Functional`
- **Psychologist account list/create/toggle status**: `Functional`
- **Legacy `Open` labels in shared card content**: `Disabled with explicit non-interactive UX`

## `/admin/appointments`

- **Route shell + nav/logout**: `Functional`
- **Page governance snapshot cards (live admin ops endpoint)**: `Functional`

## `/admin/patients`

- **Route shell + nav/logout**: `Functional`
- **Page governance snapshot cards (live admin ops endpoint)**: `Functional`

## `/admin/staff`

- **Route shell + nav/logout**: `Functional`
- **Page governance snapshot cards (live admin ops endpoint)**: `Functional`

## `/admin/billing`

- **Route shell + nav/logout**: `Functional`
- **Page governance snapshot cards (live admin ops endpoint)**: `Functional`

## `/admin/settings`

- **Route shell + nav/logout**: `Functional`
- **Page governance snapshot cards (live admin ops endpoint)**: `Functional`

## `/admin/analytics`

- **Route shell + nav/logout**: `Functional`
- **Page analytics aggregate snapshot**: `Functional`

## `/admin/audit-logs`

- **Route shell + nav/logout**: `Functional`
- **Live audit events list rendering**: `Functional`

## `/admin/data-deletion`

- **Route shell + nav/logout**: `Functional`
- **Current page card rows**: `Functional` (live retention status + purge eligibility surfaces)
- **Data deletion governance endpoints (soft delete/restore/legal hold/retention/purge checks)**: `Functional` (backend contract complete)

## `/admin/referrals`

- **Route shell + nav/logout**: `Functional`
- **Referral queue fetch/filter/action workflow (approve/reject/request-info)**: `Functional`

## `/admin/resources`

- **Route shell + nav/logout**: `Functional`
- **Page governance snapshot cards (live admin ops endpoint)**: `Functional`

---

## Section B: Non-Functional Action Inventory

Cross-route or shared non-functional items:

1. `Open` action labels from `frontend/content/ops-pages.ts` are text-only.
2. `OpsListCard` renders row values as plain `<p>` tags (no action binding).
3. `OpsPageTemplate` provides no route-specific action handlers.
4. `Compliance Mode` button in `OpsShell` has no target behavior.
5. Topbar admin search input has no handler/query behavior.

Disposition for each:

- `Open` action labels -> `Implement now` on target routes or `Disable with message` until endpoint exists.
- `OpsListCard` generic text rendering -> `Implement now` (action schema support) or replace with feature-specific cards.
- `OpsPageTemplate` generic-only composition -> `Partial keep`; move action routes to dedicated components.
- `Compliance Mode` button -> **Resolved (2026-07-05):** sidebar links to compliance tools (`/admin/audit-logs` or `/manager/privacy-requests`) instead of disabled placeholder.
- Admin search input -> **Resolved (2026-07-05):** context-aware shell search routes to patients, staff, appointments, resources, or users with `?q=` filtering on list pages.

---

## Section C: Backend Coverage Matrix (Admin Capability vs Endpoints)

## Dashboard / Ops insights

- **Endpoints present**
  - `GET /api/ops/insights`
  - `GET /api/ops/telehealth-insights`
  - `GET /api/ops/intake-queue`
  - `POST /api/ops/intake-queue/:id/assign`
- **Coverage**: `Functional` (for current dashboard cards)

## Users management

- **Endpoints present**
  - `POST /api/admin/users/psychologists`
  - `GET /api/admin/users/psychologists`
  - `PATCH /api/admin/users/psychologists/:id`
- **Coverage**: `Functional`

## Appointments oversight

- **Endpoints present**
  - appointment and booking endpoints exist (mostly patient/ops flow oriented)
- **Admin-specific page actions**
  - currently placeholder-only in UI
- **Coverage**: `Partial`

## Patients oversight

- **Endpoints present**
  - patient journey, appointments, mood, intake endpoints (ownership-guarded)
- **Admin page actions**
  - placeholder-only in UI
- **Coverage**: `Partial`

## Staff oversight

- **Endpoints present**
  - none dedicated for admin staff management
- **Coverage**: `Missing`

## Billing (admin page)

- **Endpoints present**
  - `GET /api/billing/invoices`
  - `GET /api/billing/invoices/:invoiceId/download`
- **Constraint**
  - current billing service is patient-scoped; admin governance behavior not supported
- **Coverage**: `Partial`

## Settings

- **Endpoints present**
  - none for admin configuration areas
- **Coverage**: `Missing`

## Analytics (admin page)

- **Endpoints present**
  - `POST /api/analytics/events`
  - `GET /api/analytics/events` (admin/practice_manager read)
- **Gap**
  - no dedicated admin analytics module endpoints behind page actions
- **Coverage**: `Partial`

## Audit logs

- **Endpoints present**
  - `GET /api/audit/events` (admin/practice_manager)
- **Coverage**: `Functional`

## Data deletion

- **Endpoints present**
  - `POST /api/admin/patients/:id/soft-delete`
  - `POST /api/admin/patients/:id/restore`
  - `POST /api/admin/patients/:id/legal-hold`
  - `POST /api/admin/patients/:id/legal-hold/remove`
  - `GET /api/admin/patients/:id/retention-status`
  - `GET /api/admin/patients/purge-eligible`
  - `POST /api/admin/patients/:id/purge` (feature-flagged)
- **Coverage**: `Functional`

## Referrals

- **Endpoints present**
  - `POST /api/documents/referrals` (patient upload)
  - `GET /api/ops/referrals`
  - `POST /api/ops/referrals/:id/approve`
  - `POST /api/ops/referrals/:id/reject`
  - `POST /api/ops/referrals/:id/request-info`
- **Coverage**: `Functional`

## Resources governance

- **Endpoints present**
  - referral upload endpoint only
- **Gap**
  - no admin resource governance endpoints for page actions
- **Coverage**: `Missing`

---

## Section D: Immediate P0 Remediation Queue (W11-aligned)

1. **W11I-01** Ensure remaining placeholder list cards continue using explicit non-interactive labels (`Planned`) only.
2. **W11J-01** Track and close route-level placeholders (`appointments`, `patients`, `staff`, `billing`, `settings`, `analytics`, `audit-logs`, `resources`) by replacing `OpsPageTemplate` cards with feature-backed modules.
3. **P1** Introduce cross-domain admin search API before re-enabling topbar search.
4. **P1** Reassess compliance mode requirement and either implement backend policy controls or remove permanently.

---

## Section E: Deferred / P1 Queue

1. Admin analytics dedicated aggregate/dashboard actions.
2. Admin billing governance endpoints (or scope adjustment if billing remains patient-only).
3. Admin settings module endpoints and controlled configuration edits.
4. Cross-domain admin search capability for topbar input.

---

## Evidence Sources

- Frontend routes/components:
  - `frontend/app/admin/*`
  - `frontend/components/ops/ops-shell.tsx`
  - `frontend/components/ops/ops-page-template.tsx`
  - `frontend/components/ops/ops-list-card.tsx`
  - `frontend/components/ops/ops-insights-card.tsx`
  - `frontend/components/ops/telehealth-insights-card.tsx`
  - `frontend/components/ops/intake-queue-card.tsx`
  - `frontend/content/ops-pages.ts`
- Backend/controllers/contracts:
  - `backend/src/modules/appointments/appointments.controller.ts`
  - `backend/src/modules/audit/audit.controller.ts`
  - `backend/src/modules/analytics/analytics.controller.ts`
  - `backend/src/modules/billing/billing.controller.ts`
  - `backend/src/modules/resources/resources.controller.ts`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`

