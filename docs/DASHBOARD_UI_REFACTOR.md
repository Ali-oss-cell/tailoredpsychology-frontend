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
| **Phase 1** | Patient portal dashboard + shell chrome | ✅ This session |
| **Phase 2** | Psychologist dashboard + shell | Planned |
| **Phase 3** | Ops / Admin dashboards | Planned |
| **Phase 4** | Forms polish (booking, intake, account) | Planned |

## Phase 1 implementation notes

- Nav items remain sourced from `getShellNavItems("patient")` — not hardcoded.
- Data from `usePatientDashboard`, `usePatientJourney`, `useNotificationUnreadCount`.
- Messages card uses notification unread count; opens chat via existing floating widget event.
- Documents card links to `/patient/recordings` with sensible count fallback.
- Journey rail hidden when complete (existing `isJourneyComplete` behaviour).
- Collapsed sidebar (`collapsible="icon"`) preserved.

## Key files

- `app/globals.css` — dashboard + patient sidebar tokens
- `components/patient/patient-shell.tsx` — sidebar + header chrome
- `components/patient/dashboard/patient-dashboard-view.tsx` — layout orchestration
- `components/patient/dashboard/dashboard-summary-cards.tsx` — 4-card summary row
- `components/patient/dashboard/dashboard-welcome-section.tsx` — greeting + next appointment chip
- `components/patient/dashboard/next-session-hero.tsx` — current session hero
- `components/patient/journey/journey-rail.tsx` — timeline stepper polish
- `content/patient-dashboard.ts` — en-AU copy
