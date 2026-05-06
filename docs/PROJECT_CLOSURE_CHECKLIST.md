# Project Closure Checklist (Wave-Aligned)

This checklist is the single operational tracker to close the project end-to-end.

Use it with:

- `frontend/docs/WAVE11_OPS_ROLE_SPLIT_AND_REFERRALS_PLAN.md`
- `frontend/docs/WAVE12_PSYCHOLOGIST_DASHBOARD_NOTES_PROFILE_PLAN.md`
- `frontend/docs/WAVE13_COMPLIANCE_AND_CLINICAL_GOVERNANCE_PLAN.md`
- `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`

Mark each item complete only when all acceptance criteria under it are satisfied.

---

## Global Exit Criteria (must all be true)

- [x] Frontend lint/typecheck/tests are green.
- [x] Backend lint/typecheck/tests are green.
- [x] API contracts and matrix are updated for all delivered endpoints/events.
- [x] Role/permission tests cover patient, psychologist, manager, and admin boundaries.
- [x] No placeholder-only core workflow remains in production-critical routes.

**Execution evidence (latest full sweep)**

- Backend: `npm run --prefix backend lint && npm run --prefix backend build && DATABASE_URL= npm run --prefix backend test` (25 suites, 126 tests passed)
- Frontend: `npm run --prefix frontend lint && npm run --prefix frontend typecheck && npm run --prefix frontend test` (28 suites, 47 tests passed)

---

## Wave 11 Closure (Ops + Referrals + Governance)

## W11A-01 Role-Separated Ops Navigation (P0)

- [x] Admin shell shows admin-only tabs.
- [x] Manager shell shows manager-only tabs (and approved shared tabs only).
- [x] Manager tabs are removed from admin dashboard shell.
- [x] Nav visibility is tested by role.

**Acceptance criteria**

- Admin cannot see manager routes in sidebar.
- Manager cannot see admin-only routes in sidebar.
- Route access remains correctly enforced server-side.

## W11A-02 Manager Referral Entry Route (P0)

- [x] Manager referrals route exists and is linked in manager nav.
- [x] Route permissions enforce `referrals.verify`.
- [x] Admin referrals oversight route remains available.

**Acceptance criteria**

- `practice_manager` and `admin` can open referral queue route(s).
- `patient` and `psychologist` are forbidden.

## W11B-01 Referral Review API Contracts (P0)

- [x] `GET /api/ops/referrals` implemented.
- [x] `POST /api/ops/referrals/:id/approve` implemented.
- [x] `POST /api/ops/referrals/:id/reject` implemented.
- [x] `POST /api/ops/referrals/:id/request-info` implemented.
- [x] Stable conflict/validation errors documented.

**Acceptance criteria**

- Invalid state transitions return deterministic `409`.
- Every action emits audit events with actor/timestamp/reason.

## W11B-02 Referral State Model + SLA Fields (P1)

- [x] Referral lifecycle states persisted.
- [x] SLA fields (`dueAt`, `overdue`, assignment) available.
- [x] Queue filters support status/owner/overdue.

**Acceptance criteria**

- SLA badges/filters match backend truth.
- Assignment updates are role-guarded and audited.

**Execution evidence**

- `DATABASE_URL= npm run --prefix backend test -- referrals.e2e-spec.ts` (7 tests passed; includes status/owner/overdue filter coverage)
- `npm run --prefix frontend test -- components/ops/referral-queue-card.test.tsx` (1 test passed)
- `npm run --prefix backend build` (passed)

## W11C-01 Manager/Admin Referral Queue UI (P0)

- [x] Real API-backed queue replaces static placeholder rows.
- [x] Approve/reject/request-info actions wired.
- [x] Loading/empty/error states implemented.

**Acceptance criteria**

- UI state updates correctly after each action.
- Unauthorized actions are blocked and surfaced with clear errors.

## W11D-01 Dashboard Functionalization (P1)

- [x] Manager dashboard uses live ops/referral metrics.
- [x] Admin dashboard uses live governance/system metrics.
- [x] Placeholder KPI sections removed where live data exists.

**Acceptance criteria**

- Dashboard cards are role-appropriate and API-backed.

## W11F-01 Patient Full Data Export PDF (P0)

- [x] Export request/status/download endpoints implemented.
- [x] Async export job pipeline implemented.
- [x] PDF includes defined sections (identity, intake, bookings/appointments, mood, notifications summary, referral metadata, consent summary).
- [x] Download links are auth-bound and time-limited.

**Acceptance criteria**

- Only owning patient can request/download own export.
- Export generation and download are audited.

## W11F-02 Session Data Visibility (Patient + Psychologist) (P0)

- [x] Patient session history/detail contracts implemented.
- [x] Psychologist assigned-session history/detail contracts implemented.
- [x] Role-specific field visibility documented and enforced.

**Acceptance criteria**

- No cross-patient leakage.
- Ownership and assignment checks pass e2e tests.

## W11G-01 Admin Creates Psychologist Accounts (P0)

- [x] Admin user-management API for psychologist creation implemented.
- [x] UI form supports required clinician onboarding fields.
- [x] Invite/reset onboarding flow implemented (no raw admin password entry).

**Acceptance criteria**

- Email uniqueness, validation, and audit logs verified.
- Non-admin write access denied.

## W11H-01 Soft Delete + Retention Enforcement (P0)

- [x] Soft delete endpoint and restore endpoint implemented.
- [x] Legal hold controls implemented.
- [x] Retention clock and `retentionUntil` computed.
- [x] Purge eligibility logic implemented.
- [x] Purge execution flow feature-flagged and audited.

**Acceptance criteria**

- Deleted patient cannot authenticate normally.
- Purge blocked before retention date and when legal hold active.
- Policy behavior aligns with `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`.

## W11I-01 Non-Functional Button and Action Audit (P0)

- [x] Admin/ops UI action inventory completed.
- [x] Every placeholder action (`Open`/static action labels) is classified.
- [x] Classified actions are either implemented, hidden, or explicitly disabled with clear UX.
- [x] Audit artifact published at `frontend/docs/W11_ADMIN_ACTION_AND_CAPABILITY_MATRIX.md`.

**Acceptance criteria**

- No clickable control in admin/ops appears functional when it is not.
- Deferred actions are captured in wave tickets with owners and status.
- W11I evidence section in `frontend/docs/W11_ADMIN_ACTION_AND_CAPABILITY_MATRIX.md` is current.

## W11J-01 Admin Functional Coverage Pass (P0)

- [x] Full admin capability matrix completed across all admin pages.
- [x] Each admin page marked as functional/partial/placeholder.
- [x] Remediation tickets exist for all non-functional areas.
- [x] Backend coverage dispositions are documented with endpoint evidence in `frontend/docs/W11_ADMIN_ACTION_AND_CAPABILITY_MATRIX.md`.

**Acceptance criteria**

- Admin smoke tests pass for all admin routes.
- Coverage matrix is reviewed and signed by product/ops owners.
- No unresolved `unknown` entries remain in `frontend/docs/W11_ADMIN_ACTION_AND_CAPABILITY_MATRIX.md`.

## W11E-01 Wave 11 Docs + QA Closure (P0)

- [x] API docs updated.
- [x] Route/role docs updated.
- [x] Wave 11 e2e/frontend tests complete and passing.

**Execution evidence**

- Backend sweep: `npm run --prefix backend test -- referrals.e2e-spec.ts exports.e2e-spec.ts session-visibility.e2e-spec.ts admin-users.e2e-spec.ts patient-retention.e2e-spec.ts` (5 suites, 15 tests passed)
- Frontend sweep: `npm run --prefix frontend test -- components/ops/ops-shell.test.tsx src/routes/route-config.test.ts components/ops/referral-queue-card.test.tsx components/ops/referral-action-card.test.tsx app/admin/dashboard/page.test.tsx app/manager/dashboard/page.test.tsx src/sessions/api.test.ts components/psychologist/dashboard/sessions-overview-card.test.tsx components/patient/appointments/patient-appointments-section.test.tsx` (9 suites, 12 tests passed)

**Acceptance criteria**

- All Wave 11 checklist items above are complete or formally deferred with sign-off.

---

## Wave 12 Closure (Psychologist Notes + Profile + Context + Videos)

## W12A-01 Psychologist Notes Domain Contract (P0)

- [x] Notes list/detail/create/update/sign endpoints implemented.
- [x] Note statuses (`draft`, `ready_for_signoff`, `signed`) enforced.
- [x] Signed note immutability enforced.

**Acceptance criteria**

- Psychologist can only access own note set.
- Signing transition rules validated by tests.

## W12A-02 Notes Persistence + Audit (P0)

- [x] Notes schema/migration added.
- [x] Query indexes for list paths added.
- [x] Audit events emitted for create/edit/sign.

**Acceptance criteria**

- Notes are queryable with expected performance and traceability.

## W12A-03 Psychologist Patient Context Packet (P0)

- [x] `GET /api/psychologists/:id/patients/:patientId/context` implemented.
- [x] Packet includes intake summary, referral status, risk flags, recent sessions, active care notes summary.
- [x] Non-clinical admin-only fields excluded.

**Acceptance criteria**

- Assignment/ownership guards enforced.
- Response shape stable and documented.

## W12B-01 Notes UI (Queue + Detail + Sign) (P0)

- [x] Notes page switched from static content to API-backed queue.
- [x] Note editor/detail view implemented.
- [x] Sign action implemented with confirmation flow.

**Acceptance criteria**

- UI supports loading/empty/error and optimistic refresh paths.

## W12C-01/02 Psychologist Profile Backend + UI (P0)

- [x] `GET /api/psychologists/me/profile` implemented.
- [x] `PATCH /api/psychologists/me/profile` implemented.
- [x] Profile page reads/writes live data (no static source-of-truth values).

**Acceptance criteria**

- Validation errors surfaced clearly in UI.
- Profile updates are audited.

## W12D-01 Dashboard Functional Card Upgrade (P1)

- [x] Notes queue counts are live.
- [x] Session prep card links to context and note actions.
- [x] Risk/referral signals are actionable.

**Acceptance criteria**

- Dashboard is functional task hub, not static summary.

## W12D-02 Session Video Library (Patient + Psychologist) (P0)

- [x] Psychologist recordings page is API-backed.
- [x] Patient recordings page/surface is API-backed.
- [x] Secure video access endpoint implemented (short-lived token/url).
- [x] Access/download events audited.

**Acceptance criteria**

- Strict ownership/assignment checks pass for all video access paths.

## W12E-01 Wave 12 Docs + QA Closure (P0)

- [x] API docs + route/role docs updated for notes/profile/context/video.
- [x] Frontend/backend tests for Wave 12 pass.

**Acceptance criteria**

- All Wave 12 checklist items above are complete or formally deferred with sign-off.

**Execution evidence**

- `npm run --prefix backend build`
- `npm run --prefix backend test -- psychologist-notes.e2e-spec.ts admin-ops.e2e-spec.ts admin-users.e2e-spec.ts patient-retention.e2e-spec.ts` (4 suites, 8 tests passed)
- `npm run --prefix frontend typecheck`
- `npm run --prefix frontend test -- app/admin/audit-logs/page.test.tsx app/admin/data-deletion/page.test.tsx app/admin/dashboard/page.test.tsx app/psychologist/notes/page.test.tsx app/psychologist/profile/page.test.tsx` (5 suites, 5 tests passed)

---

## Wave 13 Closure (Compliance + Clinical Governance)

## W13A-01 Consent Lifecycle Contract (P0)

- [x] Versioned consent endpoints implemented.
- [x] Consent withdrawal endpoint implemented.
- [x] Re-consent trigger behavior defined and enforced.

**Acceptance criteria**

- Consent records include actor/version/time.
- Withdrawal is auditable and reflected in downstream behavior.

**Execution evidence**

- `npm run --prefix backend build`
- `DATABASE_URL= npm run --prefix backend test -- auth.e2e-spec.ts` (15 tests passed)

## W13A-02 Clinical Notes Minimum Dataset Enforcement (P0)

- [x] Required clinical fields are enforced at note sign-off.
- [x] Sign-off blocked until minimum dataset is complete.
- [x] Signed-note immutability/amendment behavior enforced.

**Acceptance criteria**

- Missing required fields return stable validation errors.
- Sign-off path is clinically safe and auditable.

**Execution evidence**

- `npm run --prefix backend build`
- `DATABASE_URL= npm run --prefix backend test -- psychologist-notes.e2e-spec.ts` (3 tests passed)

## W13B-01 Legal Hold + Break-Glass Access (P0)

- [x] Legal hold controls integrated with delete/export/purge flows.
- [x] Break-glass access flow exists with mandatory justification.
- [x] Break-glass events fully audited.

**Acceptance criteria**

- Purge/export restrictions honor legal hold.
- Break-glass cannot be used silently.

**Execution evidence**

- `DATABASE_URL= npm run --prefix backend test -- patient-retention.e2e-spec.ts exports.e2e-spec.ts` (2 suites, 6 tests passed)

## W13D-01 Session Video Governance Hardening (P0)

- [x] Video access is short-lived tokenized only.
- [x] Optional watermark metadata policy implemented.
- [x] Video retention classes align with patient lifecycle (`active`, `hold`, `purge_pending`).
- [x] Download policy controls by role are implemented.

**Acceptance criteria**

- Expired/revoked links are rejected.
- Access and download attempts are audited.

**Execution evidence**

- `DATABASE_URL= npm run --prefix backend test -- psychologist-notes.e2e-spec.ts` (session-video governance scenarios added)
- `npm run --prefix frontend test -- app/patient/recordings/page.test.tsx app/psychologist/recordings/page.test.tsx`

## W13C-01 Patient Access and Correction Requests (P1)

- [x] Patient request endpoints for access/correction are implemented.
- [x] Admin/compliance triage view exists.
- [x] Request status lifecycle is tracked.

**Acceptance criteria**

- Patient can track own request state.
- Ownership and SLA timestamps are enforced.

**Execution evidence**

- `DATABASE_URL= npm run --prefix backend test -- patient-data-requests.e2e-spec.ts`
- `npm run --prefix frontend test -- app/patient/data-requests/page.test.tsx app/admin/privacy-requests/page.test.tsx src/routes/route-config.test.ts`

## W13B-02 Data Breach + NDB Workflow Foundation (P1)

- [x] Security incident register endpoints implemented.
- [x] Incident state machine supports triage/investigation/notification readiness.
- [x] Admin-only controls enforced.

**Acceptance criteria**

- Incident transitions are validated and auditable.
- Workflow supports NDB process operations.

**Execution evidence**

- `DATABASE_URL= npm run --prefix backend test -- security-incidents.e2e-spec.ts`
- `npm run --prefix frontend test -- app/admin/security-incidents/page.test.tsx src/routes/route-config.test.ts`

## W13E-01 Wave 13 Docs + QA Closure (P0)

- [x] API docs and matrix updated for consent/governance features.
- [x] Retention policy cross-links and implementation notes updated.
- [x] Frontend/backend tests for Wave 13 pass.

**Acceptance criteria**

- All Wave 13 checklist items above are complete or formally deferred with sign-off.

**Execution evidence**

- `DATABASE_URL= npm run --prefix backend test -- auth.e2e-spec.ts psychologist-notes.e2e-spec.ts patient-retention.e2e-spec.ts exports.e2e-spec.ts patient-data-requests.e2e-spec.ts security-incidents.e2e-spec.ts` (6 suites, 29 tests passed)
- `npm run --prefix frontend test -- app/patient/recordings/page.test.tsx app/psychologist/recordings/page.test.tsx app/patient/data-requests/page.test.tsx app/admin/privacy-requests/page.test.tsx app/admin/security-incidents/page.test.tsx src/routes/route-config.test.ts` (6 suites, 9 tests passed)

---

## Wave 14 Closure (Public Growth + Trust + Conversion)

## W14A-01/02 Public Comparison + Pricing Transparency (P0)

- [x] Public comparison landing page implemented (`/why-clink`).
- [x] Canonical pricing + Medicare gap examples implemented (`/pricing`).
- [x] Booking flow pricing guidance reuses centralized pricing content.

**Acceptance criteria**

- Comparison messaging clearly covers compliance, safety, and continuity themes.
- Pricing assumptions and Medicare disclaimers are explicit.

## W14B-01/02 Next Available + Trust Surface (P0/P1)

- [x] Booking funnel shows live next-available indicators from availability payload.
- [x] Trust metrics/privacy-controls page implemented (`/trust`).
- [x] UTM/source/condition carry-through wired into booking start metadata.

**Acceptance criteria**

- “No preference” path shows earliest available slot.
- Trust metrics include source/update provenance labels.

## W14C-01 Condition-Specific Conversion Pages (P0)

- [x] Conditions index page implemented (`/conditions`).
- [x] 10 condition detail pages implemented via dynamic route (`/conditions/:slug`).
- [x] Condition pages deep-link to booking/matching with condition context.

**Acceptance criteria**

- Invalid condition slugs are rejected (not found behavior).
- Condition CTAs preserve attribution context.

## W14D-01/W14E-01 Analytics + Docs + QA Closure (P1/P0)

- [x] Public CTA analytics events added (`compare_cta_click`, `pricing_cta_click`, `condition_cta_click`).
- [x] Route and role docs updated for new public pages.
- [x] Wave 14 focused tests and typecheck pass.

**Execution evidence**

- `npm run --prefix frontend test -- src/routes/route-config.test.ts app/pricing/page.test.tsx content/conditions/index.test.ts components/patient/booking/booking-wizard.test.ts`
- `npm run --prefix frontend typecheck`
- `npm run --prefix frontend lint && npm run --prefix frontend typecheck && npm run --prefix frontend test` (31 suites, 53 tests passed)

---

## Final Project Sign-Off

- [ ] Product sign-off (workflow completeness).
- [ ] Clinical sign-off (safety, notes, context packet usability).
- [ ] Security/compliance sign-off (retention/deletion/export/video access).
- [ ] Engineering sign-off (tests, observability, rollback readiness).
- [ ] Release readiness checklist complete.

**Sign-off handoff template**

- Product sign-off
  - Owner:
  - Decision: `Approved` / `Approved with conditions` / `Rejected`
  - Date:
  - Notes:
  - Blocking follow-ups (if any):
- Clinical sign-off
  - Owner:
  - Decision: `Approved` / `Approved with conditions` / `Rejected`
  - Date:
  - Notes:
  - Blocking follow-ups (if any):
- Security/compliance sign-off
  - Owner:
  - Decision: `Approved` / `Approved with conditions` / `Rejected`
  - Date:
  - Notes:
  - Blocking follow-ups (if any):
- Engineering sign-off
  - Owner:
  - Decision: `Approved` / `Approved with conditions` / `Rejected`
  - Date:
  - Notes:
  - Blocking follow-ups (if any):
- Release readiness
  - Owner:
  - Decision: `Ready to release` / `Not ready`
  - Date:
  - Go/no-go notes:
  - Rollback contact + channel:

