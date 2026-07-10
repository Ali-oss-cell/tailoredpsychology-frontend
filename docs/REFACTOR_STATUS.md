# Frontend Refactor Status (Phases A–D)

**Date:** 2026-07-11  
**Build:** `npm run build` ✅  
**Tests:** `npm test` — 49 suites, 124 tests ✅

## Phase A — Foundation

| Item | Status | Notes |
|------|--------|-------|
| Complete `route-config.ts` (all portal routes) | ✅ Done | Patient, psychologist, manager, admin, auth, public |
| `navLabel`, `navGroup`, `navIcon`, `navKey` on routes | ✅ Done | `src/routes/nav-icons.tsx`, `nav-utils.ts` |
| Shells render nav from route config | ✅ Done | `patient-shell`, `psychologist-shell`, `ops-shell` |
| `proxy.ts` RBAC guards all registered routes | ✅ Done | Unregistered paths pass through (unchanged) |
| Portal Form Kit (`PortalFileUpload`, etc.) | ✅ Done | `portal-form-field.tsx` |
| `AuthField` wraps Portal primitives + password toggle | ✅ Done | |
| Auth forms on Portal kit | ✅ Done | login/register already used AuthField; forgot/reset updated |
| Booking feature folder + step extraction | ✅ Done | `steps/*`, `use-booking-wizard.ts`, `use-wizard-draft.ts` |
| `booking-wizard.tsx` orchestrator slim | ✅ Done | ~150 lines |

## Phase B — Dedupe & fetch

| Item | Status | Notes |
|------|--------|-------|
| Shared ops pages (staff, patients, appointments, billing, privacy) | ✅ Done | `components/ops/pages/` |
| Thin manager/admin `page.tsx` wrappers | ✅ Done | |
| React Query ops hooks | ✅ Done | `src/admin/ops/queries/` |
| Psychologist heavy routes extracted | ✅ Done | `*-workspace.tsx` for notes, profile, patient detail |

## Phase C — Human layer

| Item | Status | Notes |
|------|--------|-------|
| Split `patient-booking` copy vs fixtures | ✅ Done | `content/fixtures/booking-seed.ts` |
| Goal-oriented booking titles | ✅ Partial | New-patient title in wizard; more dashboard/onboarding copy not expanded |
| "What happens next" on booking | ✅ Done | `WhatHappensNext` + `bookingStepWhatsNext` in wizard header |
| Plain-language validation | ✅ Partial | Existing messages; reason step duplicate-field hint added |
| Shared UX components | ✅ Done | `empty-state`, `step-intro`, `what-happens-next` |
| Wire empty-state on dashboards | ✅ Done | Patient dashboard, onboarding, appointments, ops queues, chat, psych patients |

## Phase D — Polish

| Item | Status | Notes |
|------|--------|-------|
| Semantic success/warning tokens | ✅ Done | Utilities in `globals.css`; portal surfaces migrated; legal banners use tokens |
| shadcn Input, Alert | ✅ Done | `components/ui/input.tsx`, `alert.tsx` |
| shadcn Select, Tabs | ⏭ Skipped | Portal kit covers select; tabs not required yet |
| Update `frontend-structure.md` | ✅ Done | |
| `REFACTOR_STATUS.md` | ✅ Done | This file |

## Follow-up items (completed 2026-07-11)

| Item | Status | Notes |
|------|--------|-------|
| F8: `updatedAt` on account settings | ✅ Done | Frontend display + backend `CurrentUserDto.updatedAt` |
| F19: Ops queue cards Portal Form Kit + toasts/retries | ✅ Done | intake, referral, privacy queue cards |
| `useWizardDraft` on get-matched | ✅ Done | Shared hook from booking |
| ops-pages privacy copy | ✅ Done | `managerPrivacyRequests`, `adminPrivacyRequests` wired in `ops-privacy-requests-page` |

## Key files created/moved

- `src/routes/route-config.ts` (expanded)
- `src/routes/nav-utils.ts`, `nav-icons.tsx`
- `components/patient/booking/steps/*.tsx` (9 steps)
- `components/patient/booking/use-booking-wizard.ts`
- `src/patient/booking/use-wizard-draft.ts`, `booking-schedule-utils.ts`
- `components/ops/pages/ops-*.tsx` (5 shared pages)
- `src/admin/ops/queries/*.ts`
- `content/fixtures/booking-seed.ts`
- `components/shared/empty-state.tsx`, `step-intro.tsx`, `what-happens-next.tsx`
- `components/psychologist/*-workspace.tsx` (3)

## Still open (UX review / launch audit)

- Goal-oriented copy expansion on dashboard/onboarding (Phase C partial)
- shadcn Select/Tabs wrappers if ops filters need richer UI
- `confirm-dialog.tsx` still uses hardcoded `text-green-500` / `bg-green-600` (low priority)
- Legal sign-off tracker items (`LEGAL_SIGNOFF_TRACKER.md`)
- Broader UX review backlog in `UX_DESIGN_REVIEW.md` (password hints, email guidance, etc.)

## Commits

Committed and pushed 2026-07-11.
