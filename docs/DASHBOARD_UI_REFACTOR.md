# Dashboard UI Refactor Plan

**Date:** 2026-07-11  
**Mockup:** `/home/ali/.cursor/projects/home-ali-Desktop-projects-rebild/assets/image-6653039a-f6a4-44eb-9857-f234223a90e3.png`

## Design principles

1. **Calm, clinical clarity** — generous whitespace, readable hierarchy, no visual noise.
2. **Brand teal preserved** — sidebar and CTAs use the existing Tailored Psychology teal family; no unrelated palette shifts.
3. **Progressive disclosure** — summary cards up top; journey timeline and current-session hero carry the primary action.
4. **Extend, don't replace** — build on existing tokens, React Query hooks, route-config nav, and Phosphor icons.
5. **Accessible by default** — WCAG AA contrast on dark sidebar, aria labels on progress/timeline, focus rings on interactive elements.
6. **Responsive first** — 4 → 2 → 1 column summary cards; sticky header; floating chat preserved on mobile.

## Typography scale

| Role | Size | Usage |
|------|------|-------|
| H1 | 32px (`text-[2rem]`) | Welcome greeting |
| H2 | 24px (`text-2xl`) | Section titles (Care journey, Current session) |
| Body | 16px (`text-base`) | Card copy, descriptions |
| Helper | 14px (`text-sm`) | Subtitles, muted labels |
| Status | 12px (`text-xs`) | Badges, counters, nav meta |

Use `font-heading` for headings; body stays on the sans stack.

## Spacing system

| Token | Value | Usage |
|-------|-------|-------|
| Section gap | 24–32px (`space-y-6` / `space-y-8`) | Between dashboard sections |
| Card padding | 24px (`p-6`) | Summary cards, hero cards |
| Card radius | 16px (`rounded-2xl` / `--radius-dashboard-card`) | Dashboard cards |
| Nav item gap | 8px (`space-y-2`) | Sidebar navigation |

## Color palette → CSS tokens

| Mockup / spec | Token | Light | Notes |
|---------------|-------|-------|-------|
| Brand teal `#0E8A90` | `--sidebar-patient` | `#0a7378` | Dark sidebar background |
| Sidebar text | `--sidebar-patient-foreground` | `#f4f7f6` | White/light nav labels |
| Active nav highlight | `--sidebar-patient-accent` | `rgb(255 255 255 / 0.14)` | Rounded active item |
| Primary CTA | `--primary` | `#5fa8a6` | Book Appointment, Join session |
| Main canvas | `--dashboard-bg` | `#f8fafc` | Content area behind cards |
| Card surface | `--card` | `#ffffff` | Unchanged |
| Success badge | `--success` | existing | In progress / up to date |

Role-specific sidebar tokens (same teal family, independent overrides):

| Role | Token prefix |
|------|----------------|
| Patient | `--sidebar-patient-*` |
| Psychologist | `--sidebar-psychologist-*` |
| Ops (manager + admin) | `--sidebar-ops-*` |

Dark mode: sidebar and dashboard-bg tokens have `.dark` overrides so contrast is preserved.

## Before / after — major changes

### Sidebar

| Before | After |
|--------|-------|
| Light `surface-2` sidebar | Dark teal sidebar with white text/icons |
| Flat active state (`bg-muted`) | Rounded active item with stronger highlight |
| Book link inline with nav | Pinned CTA above logout in footer |
| Tight nav spacing | Increased vertical rhythm |

### Header

| Before | After |
|--------|-------|
| Narrow search placeholder | Prominent full-width search ("Search appointments, clinicians, or help…") |
| Static header border | Sticky header with scroll elevation |
| Profile avatar only | Profile + notifications + help (unchanged wiring) |

### Dashboard layout

| Before | After |
|--------|-------|
| Static "Hello, {name}" | Time-aware greeting + subtitle |
| No summary row | 4-card row: Care progress, Messages, Documents, Billing |
| Journey rail mid-page | Journey rail after summary cards with improved stepper |
| Generic next-session card | Hero current-session card with illustration + 48px Join CTA |
| Resources + billing side-by-side | Same sections, consistent card styling and spacing |

## Phased rollout

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Patient portal dashboard + shell chrome | ✅ Complete (`c58f5cb`) |
| **Phase 2** | Psychologist dashboard + shell + top pages | ✅ Complete |
| **Phase 3** | Ops / Admin dashboards + list pages | ✅ Complete |
| **Phase 4** | Remaining patient pages (chrome + cards) | ✅ Complete |

### Deferred (out of scope)

- Marketing / public pages
- Auth pages (login, register, password reset)
- Video session room UI
- Deep booking-wizard step redesign (outer chrome only in Phase 4)

## Phase 1 implementation notes

- Nav items remain sourced from `getShellNavItems("patient")` — not hardcoded.
- Data from `usePatientDashboard`, `usePatientJourney`, `useNotificationUnreadCount`.
- Messages card uses notification unread count; opens chat via existing floating widget event.
- Documents card links to `/patient/recordings` with sensible count fallback.
- Journey rail hidden when complete (existing `isJourneyComplete` behaviour).
- Collapsed sidebar (`collapsible="icon"`) preserved.

## Phase 2 implementation notes

- `psychologist-shell.tsx` — dark sidebar (`data-psychologist-sidebar`), pinned "View schedule" CTA, conditional "Join next session" when a room is available.
- `psychologist-dashboard-view.tsx` — time-aware greeting, `PsychologistDashboardSummaryCards` (today's sessions, caseload, messages, pending notes).
- Portal pages (schedule, patients, notes, messages, profile, recordings) use `DashboardPageHeader` + `.dashboard-card` wrappers.
- Data from `usePsychologistDashboard`, `useNotificationUnreadCount`.

## Phase 3 implementation notes

- `ops-shell.tsx` — dark sidebar (`data-ops-sidebar`), pinned "Compliance tools" CTA; manager and admin share shell.
- `OpsDashboardSummaryCards` on manager + admin dashboards (staff, patients, appointments today, pending queues).
- List pages: `AdminFilterBar` and `AdminDataTable` use dashboard card chrome; ops queue/insight cards unified.
- Data from `getAdminOpsStaff`, `getAdminOpsPatients`, `getAdminOpsAppointments`, `getOpsInsights`.

## Phase 4 implementation notes

- `PatientPortalPage` migrated to `DashboardPageHeader` with `space-y-8` section rhythm.
- Patient sub-pages updated: appointments, my-clinician, account, onboarding, book-appointment (wizard shell), resources, invoices, data-requests.
- Booking wizard steps unchanged internally; outer page header + card wrappers only.
- `EmptyState` uses dashboard card border/radius tokens.

## Shared infrastructure

| Component / token | Path |
|-------------------|------|
| `DashboardPageHeader` | `components/shared/dashboard-page-header.tsx` |
| `DashboardSummaryCard` + row | `components/shared/dashboard-summary-card.tsx` |
| `PortalHeaderScrollFx` | `components/shared/portal-header-scroll-fx.tsx` |
| `.dashboard-card`, `.dashboard-section`, `.bg-dashboard` | `app/globals.css` |
| Shell chrome class names | `components/shared/portal-shell-chrome.tsx` |

## Key files

- `app/globals.css` — dashboard + role sidebar tokens
- `components/patient/patient-shell.tsx` — patient sidebar + header chrome
- `components/psychologist/psychologist-shell.tsx` — psychologist sidebar + header chrome
- `components/ops/ops-shell.tsx` — ops sidebar + header chrome
- `components/patient/dashboard/patient-dashboard-view.tsx` — patient layout orchestration
- `components/psychologist/dashboard/psychologist-dashboard-view.tsx` — psychologist layout orchestration
- `components/ops/ops-dashboard-summary-cards.tsx` — ops summary row
- `components/patient/patient-portal-page.tsx` — patient page chrome
- `components/psychologist/psychologist-portal-page.tsx` — psychologist page chrome
- `components/ops/ops-portal-page.tsx` — ops page chrome
