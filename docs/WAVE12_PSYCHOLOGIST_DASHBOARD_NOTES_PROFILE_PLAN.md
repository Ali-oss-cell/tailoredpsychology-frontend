# Wave 12: Psychologist Dashboard, Notes, and Profile Functionalization

This wave converts the psychologist portal from mixed placeholder/static surfaces to functional workflow tools with role-safe backend contracts.

Retention/deletion policy reference (source of truth before coding):

- `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`

---

## Current State (Observed)

- `frontend/app/psychologist/dashboard/page.tsx` already shows a rich layout, but several cards are content-driven placeholders.
- `frontend/app/psychologist/notes/page.tsx` uses static `psychologistNotesContent` and has no write/sign flow.
- `frontend/app/psychologist/profile/page.tsx` displays static data and an `Edit Profile` button with no persistence.
- `frontend/components/psychologist/dashboard/pre-session-workspace-card.tsx` is functional and calls backend workspace APIs.
- Backend has pre-session workspace contract but no dedicated psychologist note entity/API module yet.

---

## Scope

### In scope

- Functional psychologist notes queue + note editor + sign-off workflow.
- Functional psychologist profile read/update APIs and UI wiring.
- Dashboard card upgrades for live tasking (notes due, session prep, risk/referral checks).
- Psychologist access to patient intake packet + session context bundle before and after sessions.
- Role guards and audit coverage (`psychologist`, `practice_manager`, `admin` where appropriate).

### Out of scope (defer)

- Full medico-legal template library with dynamic schema designer.
- AI-generated notes.
- External EHR interoperability exports.

---

## Wave 12 Tickets

## W12A-01 Psychologist Notes Domain Contract (P0)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/psychologist-notes/*` (new module)
  - `backend/src/modules/appointments/*` (integration hooks)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Endpoints (new):**
  - `GET /api/psychologists/:id/notes?status=&patientId=&from=&to=`
  - `GET /api/psychologists/:id/notes/:noteId`
  - `POST /api/psychologists/:id/notes`
  - `PATCH /api/psychologists/:id/notes/:noteId`
  - `POST /api/psychologists/:id/notes/:noteId/sign`
- **Output:**
  - canonical statuses: `draft`, `ready_for_signoff`, `signed`.
  - ownership constraints: psychologist can only access own note set.
  - immutable signed notes (except append-only amendment endpoint if required later).
- **Tests required:**
  - backend e2e role/ownership/signing transition tests.

## W12A-03 Psychologist Patient Context Packet API (P0)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/appointments/*`
  - `backend/src/modules/users/*`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Endpoints (new):**
  - `GET /api/psychologists/:id/patients/:patientId/context`
- **Output:**
  - clinician-facing packet includes: latest intake summary, referral metadata status, risk flags, recent session timeline, active care notes summary.
  - explicitly excludes non-clinical/admin-only fields.
  - supports session prep and ongoing care continuity.
- **Tests required:**
  - backend assignment/ownership guard tests (`psychologist`, `practice_manager`, `admin` policy).
  - response-shape tests for required packet sections.

## W12A-02 Notes Persistence + Audit Trail (P0)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/migrations/*` (new table/indexes)
  - `backend/src/modules/audit/*`
- **Output:**
  - `psychologist_notes` table with signed metadata (`signedAt`, `signedBy`).
  - append-only audit events for create/edit/sign actions.
  - list query indexes for `psychologist_id`, `status`, `updated_at`.
- **Tests required:**
  - migration + query path correctness tests.

## W12B-01 Notes UI: Queue + Detail + Sign (P0)

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/app/psychologist/notes/page.tsx`
  - `frontend/components/psychologist/notes/*` (new)
  - `frontend/src/psychologist/notes/api.ts` (new)
- **Output:**
  - replace static queue with API-backed list.
  - detail/editor surface with structured sections (session summary, risk, plan, follow-up).
  - explicit sign action and status chips.
- **Tests required:**
  - frontend tests for empty/loading/error/edit/sign states.

## W12C-01 Psychologist Profile API Contract (P0)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/users/*` or dedicated clinician profile module
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Endpoints (new):**
  - `GET /api/psychologists/me/profile`
  - `PATCH /api/psychologists/me/profile`
- **Output:**
  - persisted fields: display name, credentials, registration number, specialties, pronouns, session modes, bio.
  - profile completeness flags for workforce ops.
- **Tests required:**
  - backend validation and role-guard tests.

## W12C-02 Profile UI Wiring (P0)

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/app/psychologist/profile/page.tsx`
  - `frontend/src/psychologist/profile/api.ts` (new)
  - `frontend/content/psychologist-profile.ts` (copy only; no hardcoded source-of-truth values)
- **Output:**
  - profile page loads live profile.
  - edit flow persists to backend.
  - optimistic save/success/error UX and validation messaging.
- **Tests required:**
  - frontend rendering and submit tests.

## W12D-01 Dashboard Functional Cards Upgrade (P1)

- **Priority:** P1
- **Owner:** Frontend + Backend
- **Status:** Done
- **Files:**
  - `frontend/components/psychologist/dashboard/*`
  - `frontend/app/psychologist/dashboard/page.tsx`
  - supporting backend query endpoints if needed
- **Output:**
  - `NotesQueueCard` reads live counts (`draft`, `ready_for_signoff`, `signed_today`).
  - session prep card includes quick actions to open note templates and patient context packet for upcoming appointments.
  - risk/referral signals surfaced with actionable links.
- **Tests required:**
  - card-level UI state tests with mocked APIs.

## W12D-02 Session Video Library Surfaces (Patient + Psychologist) (P0)

- **Priority:** P0
- **Owner:** Frontend + Backend
- **Status:** Done
- **Files:**
  - `frontend/app/psychologist/recordings/page.tsx`
  - `frontend/app/patient/resources/page.tsx` (or dedicated patient recordings route)
  - `frontend/components/session/*`
  - `backend/src/modules/appointments/*` (recording metadata contracts)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Endpoints (new/expanded):**
  - `GET /api/psychologists/:id/session-videos`
  - `GET /api/patients/:id/session-videos`
  - `GET /api/session-videos/:videoId/access` (time-limited access token/url)
- **Output:**
  - Psychologist has a recordings library to review session videos for assigned patients.
  - Patient has a recordings library to view own session videos.
  - Access links are short-lived and authorization-bound.
- **Security requirements:**
  - strict ownership/assignment checks per video.
  - no direct long-lived public URLs.
  - access/download audit events emitted.
- **Tests required:**
  - backend ownership tests for patient and psychologist access.
  - frontend list/playback/error state tests.

## W12E-01 Quality, Docs, and Role Matrix Update (P0)

- **Priority:** P0
- **Owner:** Frontend + Backend
- **Status:** Backlog
- **Files:**
  - `frontend/docs/routes-overview.md`
  - `frontend/docs/role-matrix.md`
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Output:**
  - complete note/profile workflow contract documentation.
  - route and permission mapping updated for psychologist actions.
- **Tests required:**
  - backend + frontend lint/tests/typecheck green.

---

## Additional Suggestions (from current portal gaps)

1. **Template-assisted note sections (P1):** quick-start templates for intake review, follow-up, and risk check-in.
2. **Late-sign reminders (P1):** dashboard indicator for notes not signed within SLA window.
3. **Profile operational fields (P1):** language support, telehealth modality, and availability preferences.
4. **Session-note linkage (P0):** every scheduled/completed appointment maps to one note slot, preventing missing documentation.
5. **Manager/admin oversight view (P1):** read-only KPI view for unsigned notes backlog by clinician (no content exposure by default).

---

## Strict Execution Order (Wave 12)

1. `W12A-01` notes contracts.
2. `W12A-02` notes persistence + audit.
3. `W12A-03` psychologist patient context packet API.
4. `W12B-01` notes UI wiring.
5. `W12C-01` profile contracts.
6. `W12C-02` profile UI wiring.
7. `W12D-01` dashboard card functional upgrades.
8. `W12D-02` session video library surfaces.
9. `W12E-01` docs + QA closure.

---

## Definition of Done (Wave 12)

- Psychologist notes page is API-backed and supports draft/edit/sign workflow.
- Psychologist profile page is API-backed and editable with validation.
- Dashboard notes/profile/context cards are live and actionable.
- Psychologist and patient both have secure session video library access.
- Role guards, audits, and docs are complete and consistent.
- Backend + frontend lint/tests/typecheck are green.

