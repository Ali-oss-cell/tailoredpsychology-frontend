# Clink Wave Build Playbook

This playbook defines a wave-based implementation plan to convert Stitch exports into production-quality Next.js + shadcn pages with consistent architecture and styling.

## Goal

Build all pages in controlled waves so design quality, reuse, and delivery speed stay high.

Core rules:

- Stitch is a visual/layout reference, not direct production code.
- Use shadcn primitives and shared wrappers.
- Use theme tokens only (`app/globals.css`), no random hex colors in page code.
- Keep content in config objects, not large hardcoded JSX blocks.

## Delivery Model (Wave Style)

Each wave includes:

1. Design extraction from Stitch `code.html`
2. Componentization into reusable sections
3. Route wiring in Next.js
4. QA against checklist
5. Docs update

## Wave 0: Foundations (must finish first)

## Scope

- Shared public shell and role-shell scaffolding
- Shared section/layout primitives
- Token usage alignment
- Common content data patterns

## Required components

- `components/layout/public-header.tsx`
- `components/layout/public-footer.tsx`
- `components/layout/page-section.tsx`
- `components/layout/page-container.tsx`
- `components/ui/page-header.tsx`
- `components/ui/empty-state.tsx`
- `components/ui/status-badge.tsx`

## Done criteria

- Header/footer reusable across all public pages
- No raw color literals in feature page components
- Spacing and container rules aligned with `docs/layout-sizing-system.md`

## Wave 1: Public Marketing Pages

## Stitch sources

- `public_homepage/code.html`
- `public_about_us/code.html`
- `public_services/code.html`
- `public_telehealth_requirements/code.html`
- `public_medicare_rebates/code.html`
- `public_resources_listing/code.html`
- `public_contact_us/code.html`
- `public_get_matched_landing/code.html`

## Target routes

- `/`
- `/about`
- `/services`
- `/telehealth-requirements`
- `/medicare-rebates`
- `/resources`
- `/contact`
- `/get-matched`

## Reusable sections to extract

- hero block
- trust stats/chips row
- card grid section
- CTA band
- split explainer block (text + visual)
- FAQ/legal content section

## Done criteria

- Public pages share one visual rhythm and section system
- No duplicated section JSX across pages (extract common components)
- Lighthouse/perf sanity acceptable for media-heavy sections

## Wave 2: Authentication Pages

## Stitch sources

- `auth_login/code.html`
- `auth_register/code.html`
- `auth_forgot_password/code.html`

## Target routes

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password` (style-match from existing auth screens)

## Reusable auth building blocks

- `auth-shell`
- `auth-card`
- `auth-form-field-row`
- `auth-page-footer-links`

## Done criteria

- All auth pages visually and behaviorally consistent
- Shared form styles, validation states, and call-to-action hierarchy
- Role-aware redirect behavior preserved

## Wave 3: Patient Core

## Stitch sources

- `patient_portal_dashboard_dark/code.html`

## Target routes (phase start)

- `/patient/dashboard` first
- then `/patient/appointments`, `/patient/account`, `/patient/resources`, `/patient/invoices`

## Reusable patient components

- patient sidebar shell
- portal top bar
- quick actions panel
- appointment highlight card
- resource recommendation card
- wellness/mood panel

## Done criteria

- Shell and navigation reusable across all patient pages
- Dashboard sections modularized and data-driven
- Dark mode and token usage consistent

## Wave 4: Clinical and Ops Portals

## Target routes

- Psychologist pages (`/psychologist/*`)
- Manager pages (`/manager/*`)
- Admin pages (`/admin/*`)
- Shared pages (`/recordings`, `/video-session/:appointmentId`)

## Strategy

- Reuse patient portal shell patterns where possible
- Introduce role-specific nav config, not separate layout logic forks
- Build table/filter/form workflows with shared wrappers

## Done criteria

- All role portals follow same design language and component library
- Role-specific differences are config-driven where possible
- Data-heavy pages use consistent table/filter/error/loading patterns

## Stitch-to-Implementation Mapping Template

Use this format per page while building:

```md
## Page: <route>
- Stitch source: <path/to/code.html>
- New components:
  - components/...
  - components/...
- Data config:
  - content/<page>.ts
- Shadcn primitives:
  - Button, Card, Badge, Input, Tabs, ...
- Notes:
  - token replacements
  - behavior hooks
```

## Quality Gates (apply every wave)

- Architecture:
  - route metadata and docs updated (`routes-overview.md`, `role-matrix.md`)
  - no copy-paste page blocks when reusable extraction is possible
- Styling:
  - semantic token classes only
  - no per-page ad hoc color systems
- Accessibility:
  - heading order, keyboard focus, contrast checks
- Reliability:
  - loading/empty/error states for all async UI surfaces
- Maintainability:
  - small config objects for page content
  - component props typed and documented

## Definition of Done (per page)

- Layout matches approved Stitch intent
- Implemented using reusable components + shadcn primitives
- Uses global tokens and layout standards
- Route wired and tested in app shell
- Docs/checklist updated

## Tracking Suggestion

Track waves in a simple board:

- Backlog -> In Wave -> In Build -> QA -> Done

Columns can be grouped by wave number and route family to keep delivery visible and predictable.

## Current Status

- Wave 1 homepage foundation delivered:
  - shared public shell primitives
  - reusable marketing sections
  - content-config driven homepage composition
  - public route stubs for `/about`, `/services`, `/telehealth-requirements`, `/medicare-rebates`, `/resources`, `/contact`, `/get-matched`
- Plan 1 complete:
  - all Wave 1 public routes now use distinct stitched compositions with shared reusable sections
- Plan 2 complete:
  - placeholder visuals replaced with local assets in `public/assets`
- Plan 3 complete:
  - page content moved into typed per-page modules under `content/pages`
- Plan 4 complete:
  - homepage Observer motion hardened with reduced-motion handling and cleanup
- Plan 5 complete:
  - `typecheck`, `lint`, and `build` pass
- Wave 2 auth implementation in progress:
  - shared auth primitives created
  - `/login`, `/register`, `/forgot-password`, `/reset-password` routes added
  - auth QA matrix added at `docs/WAVE2_AUTH_QA_MATRIX.md`
- Wave 3 patient core started:
  - `/patient/dashboard` implemented with reusable `PatientShell`
  - modular dashboard cards extracted under `components/patient/dashboard`
  - route QA matrix added at `docs/WAVE3_PATIENT_QA_MATRIX.md`
- Wave 3 core routes expanded:
  - `/patient/appointments`, `/patient/account`, `/patient/resources`, `/patient/invoices` implemented
  - shared patient header + typed content modules added for each route
- Wave 4 started:
  - `/psychologist/dashboard` implemented with reusable `PsychologistShell`
  - modular psychologist dashboard cards extracted under `components/psychologist/dashboard`
  - route QA matrix added at `docs/WAVE4_PSYCHOLOGIST_QA_MATRIX.md`
- Wave 4 psychologist routes expanded:
  - `/psychologist/schedule`, `/psychologist/patients`, `/psychologist/patients/:patientId`
  - `/psychologist/notes`, `/psychologist/profile`, `/psychologist/recordings`
  - typed psychologist content modules added for each route
- Wave 4 manager/admin ops routes implemented:
  - manager routes: `/manager/dashboard`, `/manager/staff`, `/manager/patients`, `/manager/appointments`, `/manager/billing`, `/manager/resources`
  - admin routes: `/admin/dashboard`, `/admin/users`, `/admin/appointments`, `/admin/patients`, `/admin/staff`, `/admin/billing`, `/admin/settings`, `/admin/analytics`, `/admin/audit-logs`, `/admin/data-deletion`, `/admin/referrals`, `/admin/resources`
  - shared ops shell + template + config-driven content added
  - ops QA matrix added at `docs/WAVE4_OPS_QA_MATRIX.md`
- Wave 5 booking intake implemented:
  - `/appointments/book-appointment` now ships as a 7-step telehealth-first AU intake flow
  - booking primitives added under `components/patient/booking`
  - typed booking contract added under `src/patient/booking/types.ts`
  - content/config added under `content/patient-booking.ts`
  - referral PDF upload added as upload/store-only (PDF + size validation + metadata)
  - wave QA matrix added at `docs/WAVE5_BOOKING_QA_MATRIX.md`
- Wave 6 scheduling-first booking redesign implemented:
  - booking mode split into `initial` and `follow_up` with reduced repeat burden for follow-up paths
  - schedule step now requires clinician + date + slot selection (replacing morning/afternoon/evening windows)
  - clinician list includes "no preference" auto-match option
  - review screen now includes clinician/date/time summary
  - wave plan added at `docs/WAVE6_SCHEDULING_REDESIGN_PLAN.md`
  - wave QA matrix added at `docs/WAVE6_BOOKING_SCHEDULER_QA_MATRIX.md`
- Wave 7 business requirements and patient data planning added:
  - detailed lifecycle/data/rules/storage requirements documented in wave style
  - includes telehealth pre-session chat requirement (opens 30 minutes before video session)
  - completeness checklist section added to verify whether coverage is end-to-end
  - wave plan added at `docs/WAVE7_BUSINESS_REQUIREMENTS_DATA_MASTER.md`
  - frontend execution checklist added at `docs/WAVE7_REQUIREMENTS_CHECKLIST.md`
  - frontend review log template added at `docs/WAVE7_REVIEW_NOTES.md`
  - backend execution checklist added at `../backend/docs/WAVE7_BACKEND_REQUIREMENTS_CHECKLIST.md`
- Wave 8 implementation sequencing added:
  - P0/P1 ordered implementation plan generated from Wave 7 checklists
  - effort estimates and dependency ordering included across FE/BE workstreams
  - telehealth pre-session chat T-30 implementation stream included
  - wave plan added at `docs/WAVE8_IMPLEMENTATION_PLAN.md`
  - execution ticket breakdown added at `docs/WAVE8_EXECUTION_TICKETS.md`
  - completed in current execution cycle:
    - W8A-01 lifecycle dictionary and transition matrix documentation
    - W8A-02 auth/users JWT skeleton (`/auth/login`, `/auth/logout`, `/auth/me`) + tests
    - W8A-03 API contract matrix baseline
    - W8B-01 availability API with timezone normalization and clinician edge-case handling
    - W8B-02 frontend live availability integration with local fallback
    - W8B-03 booking request API (`POST /booking-requests`, `GET /booking-requests/:id/status`) + idempotency
    - W8B-04 frontend booking submit + status confirmation integration
    - W8B-05 referral upload API (`POST /documents/referrals`) + validation
    - W8B-06 frontend referral upload integration + booking linkage via `referralDocumentId`
    - W8C-01 pre-session window state API (`GET /appointments/:id/pre-session-window`)
    - W8C-02 realtime chat transport + rules over Socket.IO (`/chat`, join/send/message/presence/window events)
    - W8C-03 frontend video-session pre-session chat UI with countdown and REST degraded fallback
- Wave 8 Sprint 2 execution lane prepared:
  - W8D-01 to W8D-04 tickets expanded into implementation-ready format
  - strict Sprint 2 execution order added (reliability backbone -> resume -> notifications -> ops queue)
  - W8D-01 implemented with centralized audit service, events endpoint, and tests
  - W8D-02 implemented with cross-device intake draft APIs (`intake-latest`, `intake-delta`, `commit`) and frontend booking draft cloud sync
  - W8D-03 implemented with backend notifications module (list/read/preferences), booking/chat trigger events, and unread badge integration in patient/psychologist portal headers
  - W8D-04 implemented with ops intake queue APIs (`GET /ops/intake-queue`, `POST /ops/intake-queue/:id/assign`), role-safe assignment flow, filters, e2e tests, and live queue cards in manager/admin dashboards
  - W8E-01 implemented with canonical analytics event schema/endpoints, idempotent event recording, backend lifecycle emitters (intake/booking/session), frontend analytics helper, and e2e coverage for schema + dedupe
- Wave 9 persistence hardening started and advanced:
  - Docker PostgreSQL runtime added with backend `DATABASE_URL` contract
  - in-memory stores migrated to PostgreSQL-backed services across audit/notifications/analytics/appointments
  - migration framework added via `node-pg-migrate` with baseline schema migration
  - follow-up hardening migrations added for indexes, integrity constraints, and active-slot uniqueness guard
  - booking creation made transaction-safe with DB conflict mapping to stable API `409`
  - concurrent same-slot e2e test added to protect race-condition behavior

## Clear Next Build Order (Current)

1. **W10A-01 (P0):** Notification realtime upgrade with websocket-first + polling fallback.
2. **W10B-01 (P0):** Patient journey timeline projection API + dashboard card integration.
3. **W10C-01 (P1):** Psychologist pre-session workspace summary API + UI integration.
4. **W10D-01 (P1):** Ops aggregate insight endpoints + manager/admin dashboard widgets.

## Wave 10 launch note

Wave 9 runtime hardening is complete and Wave 10 is the active execution lane for product-facing workflow improvements across patient, clinician, and operations experiences.

- Wave 10 initial delivery completed:
  - realtime notification transport added (`/notifications` Socket.IO namespace + stream token endpoint + frontend fallback polling)
  - patient journey timeline API + dashboard timeline card integrated
  - psychologist pre-session workspace API + dashboard card integrated
  - ops insights aggregate API + manager/admin dashboard insight card integrated
