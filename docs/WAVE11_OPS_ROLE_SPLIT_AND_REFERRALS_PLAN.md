# Wave 11: Ops Role Split + Referral Approval Workflow

This wave defines the next implementation lane after Wave 10 to:

1. Separate manager and admin navigation/surfaces clearly.
2. Remove manager tabs from admin dashboard shell.
3. Add manager referral approval flow (with admin oversight).
4. Make referral operations functional (not placeholder-only).

Retention/deletion policy reference (source of truth before coding):

- `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`

---

## Scope

### In scope

- Role-specific ops shell navigation behavior.
- Manager-visible referral queue and actions.
- Admin-visible referral oversight and governance views.
- Referral workflow states and transitions (review, approve, reject, request info).
- API contracts, matrix docs, and e2e/frontend tests for role guards and workflow correctness.

### Out of scope (defer)

- External GP portal integrations.
- OCR and advanced referral document parsing.
- Billing claim automation based on referral approval.

---

## Wave 11 Tickets

## W11A-01 Role-Separated Ops Navigation (P0)

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/components/ops/ops-shell.tsx`
  - `frontend/components/ops/ops-page-template.tsx`
  - `frontend/app/admin/*`
  - `frontend/app/manager/*`
- **Output:**
  - `OpsShell` supports role-aware nav rendering.
  - Admin shell only shows admin nav items.
  - Manager shell only shows manager nav items (plus shared items if explicitly allowed).
  - Remove manager tabs from admin experience.
- **Tests required:**
  - frontend tests for nav visibility per role.
  - route smoke checks for admin and manager dashboards.

## W11A-02 Manager Referral Entry Route (P0)

- **Priority:** P0
- **Owner:** Frontend + Backend contract alignment
- **Status:** Done
- **Files:**
  - `frontend/app/manager/referrals/page.tsx` (new)
  - `frontend/content/ops-pages.ts`
  - `frontend/src/routes/route-config.ts`
  - `frontend/src/auth/access-control.ts`
- **Output:**
  - Manager gets explicit referral queue route and nav tab.
  - Existing admin referrals page remains for oversight.
  - Route permissions consistently include `referrals.verify` for manager + admin.
- **Tests required:**
  - route permission tests (`practice_manager`, `admin`, negative roles).

## W11B-01 Referral Review API Contracts (P0)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/resources/*`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Endpoints (new):**
  - `GET /api/ops/referrals`
  - `POST /api/ops/referrals/:id/approve`
  - `POST /api/ops/referrals/:id/reject`
  - `POST /api/ops/referrals/:id/request-info`
- **Output:**
  - Functional referral workflow with role checks.
  - Structured action metadata (`reason`, `notes`, actor, timestamp).
  - Audit events emitted for each transition.
- **Tests required:**
  - backend e2e role guards and state transition correctness.
  - invalid transition tests return stable `409` errors.

## W11B-02 Referral State Model + SLA Fields (P1)

- **Priority:** P1
- **Owner:** Backend
- **Status:** Backlog
- **Files:**
  - `backend/src/modules/resources/*`
  - `backend/migrations/*` (if persistence mode enabled for referrals)
- **Output:**
  - canonical statuses: `received`, `review_needed`, `approved`, `rejected`, `info_requested`.
  - queue fields for `assignedTo`, `dueAt`, `overdue`.
  - assignment/update endpoints support manager workload balancing.
- **Tests required:**
  - SLA classification tests (`due_soon`, `overdue`, `on_track`).

## W11C-01 Manager/Admin Referral Queue UI (P0)

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/components/ops/*` (new referral queue card/table)
  - `frontend/src/ops/*` (referrals API client)
  - `frontend/app/manager/referrals/page.tsx`
  - `frontend/app/admin/referrals/page.tsx`
- **Output:**
  - Real queue list wired to backend.
  - Filters: status, assigned owner, overdue.
  - Actions: approve/reject/request-info with confirm modals.
- **Tests required:**
  - frontend render/action tests for success/error/loading states.

## W11D-01 Dashboard Functionalization (P1)

- **Priority:** P1
- **Owner:** Frontend + Backend
- **Status:** Done
- **Files:**
  - `frontend/app/manager/dashboard/page.tsx`
  - `frontend/app/admin/dashboard/page.tsx`
  - `frontend/components/ops/ops-insights-card.tsx`
- **Output:**
  - Manager dashboard focuses on clinic operations + actionable referral approvals.
  - Admin dashboard focuses on system-wide oversight and governance.
  - Remove placeholder-only KPI rows where live contracts exist.
- **Tests required:**
  - role-specific dashboard card assertions.

## W11E-01 Documentation + QA Closure (P0)

- **Priority:** P0
- **Owner:** Frontend + Backend
- **Status:** In Progress
- **Files:**
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `frontend/docs/routes-overview.md`
  - `frontend/docs/role-matrix.md`
- **Output:**
  - role matrix and routes reflect manager/admin split.
  - referral workflow documented end-to-end.
- **Tests required:**
  - green lint/tests/typecheck on both frontend and backend.

## W11F-01 Patient Full Data Export PDF (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend + Compliance
- **Status:** Done
- **Files:**
  - `backend/src/modules/exports/*` (new module)
  - `backend/src/modules/appointments/*` (data aggregation sources)
  - `backend/src/modules/users/*` (profile fields)
  - `backend/src/modules/resources/*` (referral metadata references)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `frontend/app/patient/account/page.tsx` (export trigger UX)
  - `frontend/src/patient/account/api.ts`
- **Endpoints (new):**
  - `POST /api/patients/me/data-export` (request export job)
  - `GET /api/patients/me/data-export/:jobId` (job status)
  - `GET /api/patients/me/data-export/:jobId/download` (signed/authorized download)
- **Output:**
  - Patient can download all their data in one PDF package (identity/profile, intake snapshots, booking/appointment timeline, mood check-ins, notifications summary, referral document metadata, consent summary).
  - Export is asynchronous job-based (prevents request timeouts).
  - Download is authorization-bound and time-limited.
  - Audit events emitted for request, generation, and download.
- **Security/Compliance requirements:**
  - Strict owner-only access (`patient` self export; admin/manager not auto-authorized to patient export download links).
  - PII-safe logging (no raw payload logs).
  - Export watermark/footer with generation timestamp and legal disclaimer.
  - Retention policy for generated export files and cleanup job.
- **Tests required:**
  - backend e2e owner-only and unauthorized access tests.
  - export completeness assertions for canonical sections.
  - frontend UX tests for request/status/download states.

## W11F-02 Session Data Visibility Contracts (Patient + Psychologist) (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/appointments/*`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `frontend/src/patient/*`
  - `frontend/src/psychologist/*`
- **Endpoints (new/expanded):**
  - `GET /api/patients/:id/sessions` (patient self history/detail view)
  - `GET /api/psychologists/:id/sessions` (clinician roster/history view)
  - optional detail endpoint for normalized session payload:
    - `GET /api/sessions/:sessionId`
- **Output:**
  - Patient can view session timeline and core session metadata.
  - Psychologist can view assigned session history and prep context.
  - Contract defines shared fields and role-specific fields (minimum-necessary disclosure).
- **Security requirements:**
  - patient only sees own session data.
  - psychologist only sees sessions they are assigned to (or explicitly scoped by manager/admin policy).
  - no cross-patient leakage in list/detail responses.
- **Tests required:**
  - backend role/ownership tests for patient and psychologist read paths.
  - frontend rendering tests for empty/loading/error/session detail states.

## W11G-01 Admin Create Psychologist Account Flow (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/users/*`
  - `backend/src/modules/auth/*`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `frontend/app/admin/users/page.tsx`
  - `frontend/src/admin/users/api.ts` (new)
- **Endpoints (new):**
  - `POST /api/admin/users/psychologists`
  - `GET /api/admin/users/psychologists`
  - `PATCH /api/admin/users/psychologists/:id`
- **Output:**
  - Admin can create psychologist accounts with required operational fields (name, email, registration/provider number, specialties, role, status).
  - New clinician receives secure onboarding/login path.
  - Account creation is audited with actor and payload summary.
- **Security requirements:**
  - Admin-only write access; manager optional read-only per policy.
  - Email uniqueness and validation enforced server-side.
  - No raw password handling in admin form; invite/reset-token flow preferred.
- **Tests required:**
  - backend role guard + validation + uniqueness tests.
  - frontend create/edit/list workflow tests.
- **Implementation evidence (current):**
  - Added admin-only endpoints: `GET/POST/PATCH /api/admin/users/psychologists` with JWT + role guard.
  - Added repository + service support for psychologist list/create/update contracts.
  - Added admin users UI workflow in `frontend/app/admin/users/page.tsx` using `frontend/components/ops/admin-psychologist-users-card.tsx`.
  - Added backend e2e coverage in `backend/test/admin-users.e2e-spec.ts`.

## W11H-01 Patient Soft Delete + 7-Year Retention Policy (P0)

- **Priority:** P0
- **Owner:** Backend + Compliance
- **Status:** Done
- **Files:**
  - `backend/src/modules/users/*`
  - `backend/src/modules/appointments/*`
  - `backend/src/modules/resources/*`
  - `backend/migrations/*`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Output:**
  - soft-delete contract for patient account (`deletedAt`, `deletionReason`, `deletedBy`).
  - patient data excluded from active app surfaces but preserved for retention window.
  - retention scheduler/policy enforcing minimum 7 years before purge eligibility.
- **Compliance note (AU):**
  - baseline rule in NSW/ACT/VIC commonly references **7 years for adults** and **until age 25 for minors**; keep policy configurable by jurisdiction and legal advice sign-off before hard deletion automation.
- **Tests required:**
  - soft-delete visibility tests (active vs deleted).
  - retention eligibility date computation tests.
  - legal-hold override tests (complaint/litigation blocks purge).
- **Implementation evidence (current):**
  - Added migration `1714214400000_patient-retention-soft-delete.js` with deletion/legal-hold/retention fields + indexes.
  - Added admin retention endpoints: `POST /api/admin/patients/:id/soft-delete`, `POST /api/admin/patients/:id/restore`, `POST /api/admin/patients/:id/legal-hold`, `POST /api/admin/patients/:id/legal-hold/remove`, `GET /api/admin/patients/:id/retention-status`, `GET /api/admin/patients/purge-eligible`, `POST /api/admin/patients/:id/purge`.
  - Added retention policy enforcement in auth login: soft-deleted patients receive `401`.
  - Added backend e2e coverage in `backend/test/patient-retention.e2e-spec.ts`.

## W11I-01 Non-Functional Button and Action Audit (P0)

- **Priority:** P0
- **Owner:** Frontend + Product
- **Status:** Backlog
- **Files:**
  - `frontend/app/admin/*`
  - `frontend/components/ops/*`
  - `frontend/content/ops-pages.ts`
  - `frontend/docs/PROJECT_CLOSURE_CHECKLIST.md`
- **Output:**
  - complete inventory of all admin/ops actions that currently render as static labels/buttons (`Open`, placeholder actions, non-wired controls).
  - each action mapped to one of: `implement now`, `hide`, `disable with message`, `defer with ticket`.
  - no ambiguous clickable UI without backend behavior.
- **Tests required:**
  - UI tests ensuring removed/deferred actions are not misleadingly interactive.
  - smoke checks for implemented actions.

## W11J-01 Admin Functional Coverage Pass (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend + Ops
- **Status:** Backlog
- **Files:**
  - `frontend/app/admin/*`
  - `frontend/components/ops/*`
  - `backend/src/modules/*` (admin-used domains)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Output:**
  - page-by-page admin capability matrix: Dashboard, Users, Appointments, Patients, Staff, Billing, Settings, Analytics, Audit Logs, Data Deletion, Referrals, Resources.
  - each page classified as `functional`, `partially functional`, or `placeholder`.
  - remediation tickets added for every non-functional admin surface.
- **Tests required:**
  - admin e2e smoke for all pages/routes.
  - role and authorization tests per admin function.

---

## Strict Execution Order (Wave 11)

1. `W11A-01` role-separated ops navigation.
2. `W11A-02` manager referral route and permissions.
3. `W11B-01` referral workflow backend endpoints/contracts.
4. `W11C-01` manager/admin referral queue UI wiring.
5. `W11D-01` dashboard functionalization.
6. `W11F-01` patient full data export PDF.
7. `W11F-02` session data visibility contracts (patient + psychologist).
8. `W11G-01` admin create psychologist account flow.
9. `W11H-01` patient soft delete + retention policy.
10. `W11I-01` non-functional button/action audit.
11. `W11J-01` admin functional coverage pass.
12. `W11E-01` docs + QA closure.

---

## Definition of Done (Wave 11)

- Admin dashboard/shell has no manager tabs.
- Manager has explicit referral approval queue with working actions.
- Admin keeps referral governance/oversight capability.
- Referral workflow is stateful, audited, and role-guarded.
- Patient can request and download full personal data export PDF via secure flow.
- Patient and psychologist both have functional session data visibility with strict ownership guards.
- Admin can create and manage psychologist accounts safely.
- Patient soft delete + retention policy is implemented and auditable.
- All admin/ops actions are either functional or explicitly non-interactive with clear status.
- Admin portal has full functional coverage map and no hidden placeholder workflows.
- API contract docs and route/role docs are updated.
- Backend + frontend lint/tests/typecheck are green.

---

## Implementation Evidence (Current)

- `W11A-01`
  - `frontend/components/ops/ops-shell.tsx` now renders role-separated nav sets.
  - Nav visibility tests in `frontend/components/ops/ops-shell.test.tsx`.
- `W11A-02`
  - New manager referral route in `frontend/app/manager/referrals/page.tsx`.
  - Route config/permission mapping in `frontend/src/routes/route-config.ts` with `referrals.verify`.
  - Route test in `frontend/src/routes/route-config.test.ts`.
- `W11B-01`
  - Referral review endpoints in `backend/src/modules/resources/resources.controller.ts`.
  - Review workflow/state transitions + audits in `backend/src/modules/resources/resources.service.ts`.
  - e2e coverage in `backend/test/referrals.e2e-spec.ts`.
- `W11C-01`
  - API client in `frontend/src/ops/referrals/api.ts`.
  - Queue UI in `frontend/components/ops/referral-queue-card.tsx` (filters + actions + retry).
  - Wired pages: `frontend/app/admin/referrals/page.tsx`, `frontend/app/manager/referrals/page.tsx`.
- `W11D-01`
  - Referral action dashboard card in `frontend/components/ops/referral-action-card.tsx`.
  - Admin/manager dashboards now use live referral action card (placeholder KPI list removed).
- `W11F-01`
  - Export module/endpoints in `backend/src/modules/exports/*`.
  - UI trigger/status/download wiring in `frontend/components/patient/account/patient-account-settings.tsx` and `frontend/src/patient/account/api.ts`.
  - e2e coverage in `backend/test/exports.e2e-spec.ts`.
- `W11F-02`
  - Session endpoints in `backend/src/modules/appointments/appointments.controller.ts`:
    - `GET /api/patients/:id/sessions`
    - `GET /api/psychologists/:id/sessions`
    - `GET /api/sessions/:id`
  - Session DTOs and role-guard logic in appointments module.
  - Backend e2e in `backend/test/session-visibility.e2e-spec.ts`.
  - Frontend wiring in `frontend/src/sessions/api.ts`, patient appointments surface, and psychologist dashboard session metrics.

