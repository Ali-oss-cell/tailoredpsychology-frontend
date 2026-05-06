# Wave 8 Execution Tickets

This document breaks `WAVE8_IMPLEMENTATION_PLAN.md` into implementation-ready tickets with file targets, DTO names, endpoint signatures, and test expectations.

## Ticket Status Legend

- `Backlog`
- `In progress`
- `Blocked`
- `Done`

---

## W8A: Foundation Tickets (P0)

### W8A-01 Lifecycle State Dictionary and Transition Matrix

- **Priority:** P0
- **Owner:** Product/Ops + Backend
- **Status:** Done
- **Files:**
  - `frontend/docs/WAVE7_REQUIREMENTS_CHECKLIST.md`
  - `frontend/docs/WAVE7_REVIEW_NOTES.md`
  - `backend/docs/WAVE7_BACKEND_REQUIREMENTS_CHECKLIST.md`
  - `backend/docs/API_CONTRACT.md` (create/update)
- **Output:**
  - Canonical lifecycle states and transitions table
  - Role transition ownership map
  - Transition denial behavior
- **Tests required:**
  - N/A (documentation ticket)

### W8A-02 Backend Core Contract Skeleton (Auth/Users baseline)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/auth/*` (create services/controllers/dto as needed)
  - `backend/src/modules/users/*` (create services/controllers/dto as needed)
  - `backend/src/modules/core/core.module.ts`
  - `backend/src/modules/auth/auth.module.ts`
  - `backend/src/modules/users/users.module.ts`
- **DTO names:**
  - `LoginRequestDto`
  - `AuthSessionDto`
  - `CurrentUserDto`
  - `UserProfileDto`
- **Endpoints:**
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`
- **Tests required:**
  - `backend/test/auth.e2e-spec.ts`
    - login success/failure
    - me requires auth
    - logout invalidates session/token contract
  - Unit tests for auth service token/session logic

### W8A-03 API Contract Matrix Initialization

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/docs/API_CONTRACT.md` (create)
  - `backend/docs/API_CONTRACT_MATRIX.md` (create)
- **Output:**
  - Canonical/compat/deprecated tags for each endpoint
  - Retryability notes for write endpoints
  - Shared error envelope schema
- **Tests required:**
  - N/A (documentation ticket)

---

## W8B: Core Build Tickets (P0)

### W8B-01 Availability API

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/appointments/*` (controller/service/dto files)
  - `backend/src/modules/appointments/appointments.module.ts`
- **DTO names:**
  - `GetClinicianAvailabilityQueryDto`
  - `AvailabilitySlotDto`
  - `ClinicianAvailabilityResponseDto`
- **Endpoint signature:**
  - `GET /clinicians/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&clinicianId=optional`
- **Tests required:**
  - e2e: valid window, invalid date range, clinician filter behavior
  - unit: slot filtering and timezone normalization helpers

### W8B-02 Frontend Availability Integration

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/components/patient/booking/booking-wizard.tsx`
  - `frontend/content/patient-booking.ts` (fallback mocks only)
  - `frontend/src/patient/booking/types.ts`
  - `frontend/src/patient/booking/api.ts` (create)
- **Contract types:**
  - `ClinicianAvailabilityResponse`
  - `AvailabilitySlot`
- **Behavior:**
  - Replace static `scheduleByDate` as primary source
  - Keep fallback static schedule if API unavailable in dev
- **Tests required:**
  - component behavior test: loading/error/empty states
  - integration test: select clinician/date/slot from API response

### W8B-03 Booking Request API

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/appointments/*`
  - `backend/src/modules/users/*` (ownership checks if needed)
- **DTO names:**
  - `CreateBookingRequestDto`
  - `BookingRequestStatusDto`
  - `BookingRequestCreatedResponseDto`
- **Endpoint signature:**
  - `POST /booking-requests`
  - `GET /booking-requests/:id/status`
- **Tests required:**
  - e2e: create success
  - e2e: unauthorized/forbidden
  - e2e: invalid slot conflict
  - concurrency/idempotency test for duplicate submit protection

### W8B-04 Frontend Booking Submit Integration

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/components/patient/booking/booking-wizard.tsx`
  - `frontend/src/patient/booking/api.ts`
- **Behavior:**
  - Submit to `POST /booking-requests`
  - Poll/fetch status via `GET /booking-requests/:id/status`
  - Show robust error states and retry path
- **Tests required:**
  - submit success path
  - validation + server error path
  - retry behavior

### W8B-05 Referral Upload API

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/resources/*` or dedicated `documents` module
  - `backend/src/modules/audit/*` (event hooks)
- **DTO names:**
  - `UploadReferralMetadataDto`
  - `ReferralDocumentDto`
- **Endpoint signature:**
  - `POST /documents/referrals` (multipart/form-data)
- **Tests required:**
  - e2e: PDF accepted
  - e2e: MIME mismatch rejected
  - e2e: oversized file rejected
  - unit: status lifecycle mapping

### W8B-06 Frontend Referral Upload Integration

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/components/patient/booking/referral-upload.tsx`
  - `frontend/components/patient/booking/booking-wizard.tsx`
  - `frontend/src/patient/booking/api.ts`
- **Behavior:**
  - Upload file + metadata
  - Store returned `documentId` and status in draft state
- **Tests required:**
  - upload success/error flow
  - replace/remove file behavior

---

## W8C: Telehealth Chat Window Tickets (P0)

### W8C-01 Pre-Session Window State API

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/services/*` or `appointments/*` (domain choice)
- **DTO names:**
  - `TelehealthSessionWindowDto`
- **Endpoint signature:**
  - `GET /appointments/:id/pre-session-window`
- **Tests required:**
  - before-open locked state
  - T-30 open state
  - post-close state

### W8C-02 Chat Access and Close Rules

- **Priority:** P0
- **Owner:** Backend/Security
- **Status:** Done
- **Files:**
  - `backend/src/modules/services/*` (or chat module)
  - `backend/src/modules/audit/*`
- **Endpoint signatures (minimum):**
  - `GET /appointments/:id/chat-window`
  - `POST /appointments/:id/chat/messages`
- **Realtime transport (implemented):**
  - Socket.IO namespace: `/chat`
  - events: `chat:join`, `chat:send`, `chat:message`, `chat:presence`, `chat:window`
- **Rules:**
  - locked before T-30
  - closes on join/cancel/no-show timeout
  - strict role access
- **Tests required:**
  - permission matrix tests
  - open/close boundary tests
  - audit event emission tests

### W8C-03 Frontend Chat Window UX

- **Priority:** P0
- **Owner:** Frontend
- **Status:** Done
- **Files:**
  - `frontend/app/video-session/[appointmentId]/page.tsx` (create/update if missing)
  - `frontend/components/patient/*` and `frontend/components/psychologist/*` chat surfaces
  - `frontend/src/session/chat-api.ts` (create)
- **Behavior:**
  - Show `locked`, `open`, `closed` states with clear reason
  - show countdown to open when locked
  - realtime sync of messages + presence + window updates over Socket.IO
  - fallback mode to REST read/send when websocket fails
- **Tests required:**
  - state rendering by response
  - countdown edge transition tests

---

## W8D: Reliability and Governance Tickets (P1)

### W8D-01 Audit and Transition Logging

- **Priority:** P1
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/audit/audit.module.ts`
  - `backend/src/modules/audit/audit.service.ts`
  - `backend/src/modules/audit/dto/audit-event.dto.ts`
  - `backend/src/modules/audit/entities/audit-event.record.ts`
  - transition points in `backend/src/modules/appointments/*`, `backend/src/modules/auth/*`, `backend/src/modules/resources/*`
- **DTO names:**
  - `AuditEventDto`
  - `CreateAuditEventDto`
- **Event contract (minimum):**
  - `eventId`
  - `actorUserId`
  - `actorRole`
  - `action`
  - `targetType`
  - `targetId`
  - `metadata` (flat object)
  - `occurredAt`
- **Endpoint signatures (minimum internal read API):**
  - `GET /audit/events?targetType=&targetId=&actorUserId=&action=&from=&to=`
- **Tests required:**
  - event persistence test
  - mandatory metadata test (actor, timestamp, action, target)
  - endpoint filter tests (`target`, `actor`, date range)
  - verify chat and booking transitions emit expected action names

### W8D-02 Cross-Device Resume Contracts

- **Priority:** P1
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - backend: `appointments/users` modules
  - frontend: `booking-wizard.tsx`, `src/patient/booking/api.ts`
- **DTO names:**
  - `IntakeDraftDto`
  - `SaveIntakeDraftDto`
  - `IntakeDraftSavedResponseDto`
  - `IntakeDraftConflictDto`
- **Endpoint signatures:**
  - `GET /patients/:id/intake-latest`
  - `POST /patients/:id/intake-delta`
  - `POST /patients/:id/intake-draft/commit`
- **Rules:**
  - optimistic concurrency with `draftVersion`
  - role-safe ownership checks (patient owner, privileged roles read-only unless explicit policy)
  - merge strategy documented for nested sections (contact, clinical, referral, booking prefs)
- **Tests required:**
  - delta merge logic tests
  - stale update conflict handling tests
  - cross-device resume test (save on device A, load on device B)

### W8D-03 Notification and Reminder Engine (Foundational)

- **Priority:** P1
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/notifications/*` (new module)
  - `backend/src/modules/appointments/*` (event trigger points)
  - `frontend/src/notifications/*` (client fetch + badge state)
  - `frontend/components/*` portal header notification surfaces
- **DTO names:**
  - `NotificationDto`
  - `CreateNotificationDto`
  - `NotificationPreferenceDto`
- **Endpoint signatures (minimum):**
  - `GET /notifications`
  - `POST /notifications/preferences`
  - `PATCH /notifications/:id/read`
- **Initial reminder events:**
  - booking submitted
  - booking confirmed
  - chat window open (T-30)
  - session starting soon
- **Tests required:**
  - unread/read lifecycle tests
  - duplicate suppression for idempotent upstream events
  - preference opt-out behavior tests

### W8D-04 Ops Queue and Triage Surfaces

- **Priority:** P1
- **Owner:** Backend + Frontend (Ops)
- **Status:** Done
- **Files:**
  - backend: `appointments`, `resources`, `users` (queue projection endpoint)
  - frontend: `app/manager/*`, `app/admin/*`, `components/ops/*`
- **DTO names:**
  - `IntakeQueueItemDto`
  - `GetIntakeQueueQueryDto`
- **Endpoint signatures:**
  - `GET /ops/intake-queue?state=&risk=&referralStatus=&staleHours=&assignedClinicianId=`
  - `PATCH /ops/intake-queue/:id/assign`
- **Queue filters (minimum):**
  - urgent risk
  - missing referral
  - medicare uncertain
  - stale drafts (time threshold)
- **Tests required:**
  - queue filter correctness tests
  - assignment auth/permission tests
  - stale threshold edge tests

---

## W8E: Analytics Tickets (P1)

### W8E-01 Funnel and Outcome Events

- **Priority:** P1
- **Owner:** Data + Backend + Frontend
- **Status:** Done
- **Files:**
  - `frontend/src/analytics/*` (create)
  - backend event emitters in lifecycle transitions
- **Events (minimum):**
  - `intake_started`
  - `intake_submitted`
  - `booking_requested`
  - `booking_confirmed`
  - `session_started`
  - `session_completed`
  - `session_no_show`
- **Tests required:**
  - event schema validation
  - no-duplicate event emission for idempotent paths

---

## Wave 9: Persistence and Runtime Hardening (Post-W8)

### W9-01 PostgreSQL + Docker Baseline

- **Priority:** P0
- **Owner:** Backend/Platform
- **Status:** Done
- **Files:**
  - `docker-compose.yml`
  - `backend/.env.example`
  - `backend/src/modules/core/database.service.ts`
  - `backend/src/modules/core/core.module.ts`
  - `backend/README.md`
- **Output:**
  - Docker Postgres local runtime
  - shared DB service for query execution
  - backend persistence mode switch by `DATABASE_URL`

### W9-02 Domain Persistence Migration (In-Memory -> PostgreSQL)

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/audit/*`
  - `backend/src/modules/notifications/*`
  - `backend/src/modules/analytics/*`
  - `backend/src/modules/appointments/*`
- **Output:**
  - DB-backed audit/notifications/analytics stores
  - DB-backed booking requests, appointments, intake drafts, chat messages, chat presence, intake queue assignments
  - in-memory fallback preserved for no-DB dev mode

### W9-03 Migration Framework + Baseline Schema

- **Priority:** P0
- **Owner:** Backend/Platform
- **Status:** Done
- **Files:**
  - `backend/package.json`
  - `backend/migrations/1714210000000_baseline-schema.js`
  - `backend/src/modules/core/database.service.ts`
  - `backend/README.md`
- **Output:**
  - `node-pg-migrate` scripts (`db:migrate`, `db:rollback`, `db:create`)
  - baseline schema under migration control
  - runtime warns if migrations were not applied

### W9-04 Index and Constraint Hardening

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/migrations/1714211000000_indexes-and-constraints.js`
  - `backend/migrations/1714212000000_booking-slot-guard.js`
- **Output:**
  - query-path indexes for audit/notifications/analytics/booking/chat queue tables
  - state/status check constraints
  - partial unique slot guard for active booking requests

### W9-05 Booking Transaction and Conflict Mapping

- **Priority:** P0
- **Owner:** Backend
- **Status:** Done
- **Files:**
  - `backend/src/modules/core/database.service.ts`
  - `backend/src/modules/appointments/appointments.service.ts`
  - `backend/test/booking-requests.e2e-spec.ts`
- **Output:**
  - atomic booking write bundle (booking + idempotency + appointment)
  - DB unique conflicts mapped to API `409` with stable message
  - concurrent same-slot e2e protection test

### W9-06 Immediate Next Tickets (Recommended)

- **Priority:** P1
- **Owner:** Backend + Platform
- **Status:** Done
- **Files:**
  - `backend/src/*` (health endpoint and startup integration)
  - `backend/test/*` (DB-backed startup/migration smoke)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
- **Next outputs:**
  - `GET /health` readiness includes DB connectivity + migration state (**Done**)
  - startup policy for migration execution in dev/CI/prod documented and tested (**Done**)
  - contract docs updated with persistence/idempotency/concurrency guarantees (**Done**)
  - optional data backfill migration strategy for moving dev in-memory snapshots (**Done**)

---

## Wave 10: Experience and Workflow Expansion (Post-W9)

### W10A-01 Notification Realtime Contract and Transport

- **Priority:** P0
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/notifications/*`
  - `frontend/src/notifications/*`
  - `frontend/components/notifications/notification-bell.tsx`
- **Output:**
  - realtime-first notification transport (`/notifications` Socket.IO namespace)
  - client fallback to polling when websocket is unavailable
  - unread badge and list updates without manual refresh
- **Tests required:**
  - backend e2e for authenticated connect + subscribe + event delivery
  - frontend behavior tests for fallback polling and live update merge

### W10B-01 Patient Journey Timeline Projection

- **Priority:** P0
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/appointments/*`
  - `frontend/app/patient/dashboard/page.tsx`
  - `frontend/components/patient/dashboard/*`
  - `frontend/src/patient/*`
- **Output:**
  - endpoint for timeline projection from intake/booking/session state
  - dashboard timeline card with stage, timestamp, and status metadata
- **Tests required:**
  - backend e2e for patient ownership and role visibility rules
  - frontend rendering tests for empty/loading/completed states

### W10C-01 Psychologist Pre-Session Summary Workspace

- **Priority:** P1
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/appointments/*`
  - `frontend/app/psychologist/dashboard/page.tsx`
  - `frontend/components/psychologist/dashboard/*`
- **Output:**
  - endpoint with clinician-facing pre-session summaries (risk/referral/intake completeness)
  - dashboard card with actionable prep queue
- **Tests required:**
  - backend access guard tests (`psychologist`, `practice_manager`, `admin`)
  - frontend card state tests

### W10D-01 Ops Insight Aggregates

- **Priority:** P1
- **Owner:** Backend + Frontend (Ops)
- **Status:** Done
- **Files:**
  - `backend/src/modules/analytics/*`
  - `backend/src/modules/appointments/*`
  - `frontend/app/manager/dashboard/page.tsx`
  - `frontend/app/admin/dashboard/page.tsx`
  - `frontend/components/ops/*`
- **Output:**
  - aggregate endpoint for queue aging, funnel conversion, and no-show trend indicators
  - manager/admin dashboard insight widgets
- **Tests required:**
  - backend role and aggregate correctness tests
  - frontend widget rendering tests for empty/data/error states

### W10 Strict Execution Order

1. `W10A-01` realtime transport and fallback first
2. `W10B-01` patient timeline delivery second
3. `W10C-01` psychologist workspace third
4. `W10D-01` ops insight aggregates and widgets fourth

### W10 Done Criteria

- Notification bell updates live in websocket mode and safely degrades to polling.
- Patient dashboard includes timeline sourced from backend projection contract.
- Psychologist dashboard includes pre-session summary with risk/referral visibility.
- Manager/admin dashboards include insight widgets driven by backend aggregates.
- Contracts and matrix docs updated for all new endpoints/events.
- Backend + frontend lint/tests/typecheck green.

---

## Sprint 2 Strict Execution Order (Reliability + Ops)

Scope: Sprint 2 focuses on hardening and operations after Sprint 1 core booking + pre-session chat release.

### 0) Hard prerequisite

1. Sprint 1 lane (`W8A-01` -> `W8C-03`) must be done and green in lint/tests/typecheck.

### 1) Reliability backbone first

2. `W8D-01` Audit and Transition Logging (must land first; all downstream tickets consume this stream)

### 2) Resume and continuity

3. `W8D-02` Cross-Device Resume Contracts (blocked by W8D-01 baseline event naming and actor metadata)

### 3) Engagement and operations

4. `W8D-03` Notification and Reminder Engine (can start once W8D-01 is in place; may run parallel with late W8D-02 frontend work)
5. `W8D-04` Ops Queue and Triage Surfaces (blocked by W8D-01; benefits from W8D-02 and W8D-03 outputs)

### 4) Sprint 2 done criteria

- Audit events are queryable, consistent, and emitted for booking/referral/chat transitions.
- Patients can resume intake draft across devices with conflict-safe save semantics.
- Notification center shows booking/session reminders with read state and preferences.
- Ops queue supports triage filters and assignment flow.
- `API_CONTRACT.md` and `API_CONTRACT_MATRIX.md` include all new endpoints/event semantics.
- Backend + frontend lint/tests/typecheck are green.

## Sprint 1 Strict Execution Order (Do-Not-Start Rules)

Scope: Sprint 1 is limited to P0 foundations + core booking path needed for real patient booking and referral submission.

### 0) Hard prerequisites (must be complete first)

1. `W8A-01` Lifecycle State Dictionary and Transition Matrix
2. `W8A-03` API Contract Matrix Initialization

`W8A-02` can start in parallel with `W8A-01` and `W8A-03`, but no downstream feature ticket may merge before all three W8A tickets are done.

### 1) Backend-first critical path

3. `W8B-01` Availability API (blocked by W8A hard prerequisites)
4. `W8B-03` Booking Request API (blocked by W8A hard prerequisites; should align response envelopes from W8B-01)
5. `W8B-05` Referral Upload API (blocked by W8A hard prerequisites; audit hooks required at implementation time)

These three backend APIs may run in parallel after W8A, but each must reach passing e2e tests before its paired frontend integration starts.

### 2) Frontend integrations (strictly after corresponding backend API)

6. `W8B-02` Frontend Availability Integration (blocked by W8B-01)
7. `W8B-04` Frontend Booking Submit Integration (blocked by W8B-03)
8. `W8B-06` Frontend Referral Upload Integration (blocked by W8B-05)

### 3) Telehealth T-30 chat window (end of Sprint 1 lane)

9. `W8C-01` Pre-Session Window State API (blocked by W8A hard prerequisites)
10. `W8C-02` Chat Access and Close Rules (blocked by W8C-01)
11. `W8C-03` Frontend Chat Window UX (blocked by W8C-01 and W8C-02)

### 4) Definition of done for Sprint 1

- All tickets `W8A-01` to `W8C-03` marked `Done` except optional carry-over explicitly flagged by owner.
- Cross-ticket quality gate items all checked for implemented Sprint 1 endpoints/flows.
- Booking flow works end-to-end with:
  - API-based availability
  - booking request creation + status retrieval
  - referral PDF upload + status persistence
  - pre-session chat lock/open behavior at T-30

### 5) Explicit non-goals (defer to Sprint 2+)

- `W8D-01` Audit and Transition Logging as a broad platform stream (only minimum hooks needed by Sprint 1 tickets are in scope now)
- `W8D-02` Cross-device resume contracts
- `W8E-01` Funnel and outcome analytics

---

## Cross-Ticket Quality Gate

- [ ] Swagger annotations complete for all new endpoints
- [ ] `API_CONTRACT.md` and `API_CONTRACT_MATRIX.md` updated
- [ ] Role access matrix aligned with endpoint guards
- [ ] Retryability/idempotency documented for all writes
- [ ] e2e suite includes auth failure and permission failure cases
- [ ] Critical transition flows covered by concurrent request tests

