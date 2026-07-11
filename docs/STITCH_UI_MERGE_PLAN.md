# Stitch UI Merge Plan

**Date:** 2026-07-11
**Source:** `stitch_tailored_psychology_ui_system/` (Google Stitch export — 12 screens + `serene_clinical_systems/DESIGN.md`)
**Scope:** Reconcile the Stitch "Serene Clinical Systems" design system with the shipped Tailored Psychology frontend (Next.js 16 + Tailwind v4 CSS-first) and adopt its visual polish **without** regressing existing logic, routes, or accessibility fixes documented in `refactor.md`, `DASHBOARD_UI_REFACTOR.md`, `LANDING_PAGE_UI_REFACTOR.md`, and `NAVBAR_FOOTER_UI_REFACTOR.md`.

This is a **visual reconciliation**, not a rebuild — Stitch is a static-HTML/CDN-Tailwind mockup; we translate its spec into our existing token/component architecture.

---

## 1. Token reconciliation

### Colour

| Stitch (Material Design 3) | Hex | Our token | Our hex | Decision |
|---|---|---|---|---|
| `primary-container` | `#5fa8a6` | `--primary` | `#5fa8a6` | **Exact match.** No change — this is our brand teal, already the single source of truth. |
| `primary` (M3 "on-container" darker teal) | `#156968` | *(new)* `--primary-strong` | — | **Added.** Used for icon/text-on-light contexts where Stitch wants a darker, higher-contrast teal (e.g. card icon glyphs, small text links on white) without touching the brand `--primary` used for CTAs/focus rings. |
| `secondary` | `#2d676a` | `--secondary` (repurposed as neutral sage `#9eaa9f`) | `#9eaa9f` | **Not aligned — intentionally.** Our `--secondary` is a neutral UI tone, not a teal variant. Kept as-is; Stitch's teal secondary has no direct use in our system since `--accent`/`--primary-strong` cover that need. |
| Sidebar `#0E4F52 → #134E4A` gradient | — | `--sidebar-patient` / `-psychologist` / `-ops` | `#0a7378` (light) / `#0d4f52` (dark mode) | **Close, not identical.** Our flat `#0a7378` is a slightly brighter teal than Stitch's darker `#0E4F52`. Kept our existing hue (already contrast-checked, already shipped, already the "brand sidebar" in three portals) rather than re-tuning three role palettes for a ~4% hue delta. Documented as an intentional delta, not a bug. |
| `error` / `error-container` | `#ba1a1a` / `#ffdad6` | `--destructive` | `#c05656` | Kept ours — softer, already tuned per the "don't alarm sensitive users" brief that both systems share. |
| Surface / background | `#faf8ff` (violet-tinted) | `--background` / `--dashboard-bg` | `#f4f7f6` / `#f8fafc` | Kept ours (green/grey-tinted, matches teal brand family better than Stitch's violet-tinted M3 default, which is a generic Material seed colour, not a deliberate brand choice). |

**Net colour change:** one additive token (`--primary-strong: #156968`, light and dark variants), zero regressions to existing contrast-passing pairs (`--primary-foreground` fix from the earlier audit is untouched).

### Typography

| Stitch role | Size | Our equivalent | Decision |
|---|---|---|---|
| `display-lg` | 48px / 700 | Marketing `.marketing-h1` (56–64px clamp) | **Kept ours, larger.** Our hero is intentionally bigger for marketing impact; Stitch's 48px is a generic dashboard-first scale. No change. |
| `headline-lg` | 32px / 600 | Portal H1 (dashboard greeting, page titles) | **Exact match** — already 32px (`DASHBOARD_UI_REFACTOR.md`). |
| `headline-lg-mobile` | 24px / 600 | Portal H1 mobile | Already responsive via Tailwind text scale; no dedicated mobile override needed since our portal H1 uses `text-[2rem]` fixed — **left as-is** (portal chrome is desktop-first-usage but mobile-safe at 32px; not worth a breakpoint override for 8px of difference). |
| `headline-md` | 24px / 600 | Card section H2/H3 | Matches our `text-2xl`/`text-xl` card headings. No change. |
| `headline-sm` | 20px / 600 | Card titles (`CardTitle` `text-lg`→ upgraded where noted below) | Close enough (18px vs 20px) — no blanket change to avoid touching 50+ `CardTitle` call sites; flagged as a Phase-2 follow-up if desired. |
| `body-lg` / `body-md` / `body-sm` | 18 / 16 / 14px | `.marketing-body` (18px), default body (16px), `text-sm` (14px) | **Exact match.** |
| `label-md` / `label-sm` | 14px/600, 12px/500 | Badge / eyebrow text | **Exact match** (`.card-eyebrow` is 12px/500 uppercase; badges are 12–14px/600). |

**Decision:** keep our existing dual scale (marketing 56–64px hero / portal 32px dashboard H1) rather than compressing marketing down to Stitch's 48px — Stitch's spec is dashboard-first and undersells a marketing hero. Portal typography already matches Stitch almost exactly. No token changes required for type; this section documents alignment, not action.

### Shadows / elevation

| Stitch | Value | Our token (before) | Our token (after) |
|---|---|---|---|
| Level 1 (cards) | `0px 4px 20px rgba(15,23,42,0.05)` | `--shadow-e1: 0 1px 2px rgb(16 24 24/.04), 0 1px 3px rgb(16 24 24/.06)` | **Updated** to `0 2px 4px rgb(15 23 42/.04), 0 4px 20px rgb(15 23 42/.05)` — adopts Stitch's diffused long-throw ambient shadow while keeping a tight contact shadow for crisp edges at small sizes. |
| Level 2 (dropdowns/modals) | `0px 10px 30px rgba(15,23,42,0.1)` | `--shadow-e2: 0 2px 4px…, 0 6px 16px rgb(16 24 24/.07)` | **Updated** to `0 4px 8px rgb(15 23 42/.06), 0 10px 30px rgb(15 23 42/.1)` — matches Stitch's Level 2 almost exactly. |
| — (we have a 3rd tier) | — | `--shadow-e3` | **Kept**, retuned to the same `rgb(15 23 42/…)` colour family for consistency (Stitch has no Level 3; ours covers hero/floating elements Stitch doesn't spec). |

Net effect: shadows read softer and more "diffused ambient," matching Stitch's calmer depth language, with zero markup changes (all consumers reference the CSS variables, not literal values).

### Shape / radius

| Stitch | Our token | Decision |
|---|---|---|
| Card radius 16px | `--radius-dashboard-card: 1rem` (16px) | **Exact match.** No change. |
| Input radius `rounded-xl` (Stitch says 16px in prose, `rounded-xl` = 24px in Tailwind v3 utility naming) | Our inputs use `rounded-xl` → `calc(var(--radius)*1.4)` ≈ 14px | **Kept ours** — 24px inputs would look overly pill-like next to our 16px cards; our 14px keeps inputs and cards visually related. Documented as intentional, not a miss. |
| Buttons `rounded-4xl` (pill) | Our `Button` component, pill by default | **Exact match.** |
| Sidebar CTA pill | `border-radius: 9999px` | Already implemented (`[data-patient-sidebar-cta] { border-radius: 9999px }`) | **Exact match.** |

### Component deltas

| Component | Stitch spec | Ours (before) | Decision |
|---|---|---|---|
| Buttons | 48px height | `h-12` on primary CTAs | **Exact match**, already shipped. |
| Cards | 16px radius, soft shadow, optional 1px `#E5E7EB` border | `--radius-dashboard-card`, `--shadow-e1`, `border-border/50` (`#d5dfdd`-family) | **Match** — border hue differs slightly (green-grey vs Stitch's blue-grey `#E5E7EB`) but both are near-invisible hairlines at this lightness; kept ours for palette consistency. |
| Inputs | `rounded-xl`, 1px `#E5E7EB` border, teal 2px focus glow | `Input` component: `rounded-md`→ **upgraded to `rounded-xl`**, existing `focus-visible:ring-2 ring-ring` (teal) | **Updated** input radius to match Stitch's more tactile rounding; focus glow already teal, now confirmed 2px. |
| Badges/pills | Low-saturation tint backgrounds per status | Semantic tokens existed (`success`/`warning`/`info`/`destructive`) but not all pill contexts used tinted backgrounds consistently | **Added** `.pill-success` / `.pill-warning` / `.pill-info` / `.pill-neutral` utilities (low-saturation tint bg + matching text) for status pills across appointments/invoices/documents. |
| Sidebar | 260px desktop width, pill active state, CTA above settings/support | We had `w-64` (256px) | **Updated** to `--sidebar-width: 16.25rem` (260px) via shared chrome; pill active state already shipped; added Settings/Support links below the Book Appointment CTA (previously only Logout existed in the footer — logout moved to be the last item, matching Stitch's bottom-anchored utility links). |

---

## 2. Screen-by-screen delta table

| Screen | Stitch shows | We have | MERGE decision |
|---|---|---|---|
| **Marketing home (desktop+mobile)** | Hero w/ 2 CTAs + Medicare trust line; 4-badge cert strip (AAPi/Medicare/AHPRA/ISO 27001); "Your Path to Better Mental Health" Match/Meet/Manage 3-step; asymmetric services grid (1 large + 3 small); soft-red emergency card in footer | Hero w/ 3 CTAs + 5 trust indicators; 6-icon trust bar; "How it works" 3-step (Answer/Match/Book); symmetric services grid; soft-red emergency card already in footer | **Hybrid.** Kept our 3-CTA hero (richer than Stitch's 2) and added the Medicare trust line. Added a **new** "Your Path to Better Mental Health" Match/Meet/Manage section (coexists with, doesn't replace, "How it works" — that section explains the *pre-booking* funnel; Match/Meet/Manage explains the *ongoing relationship*, a genuinely different framing worth keeping both). Restyled trust bar into a compact 4-badge certification strip **plus** kept the richer 6-item descriptive trust bar below it (AHPRA/Medicare claims already legally reviewed; ISO 27001 marked **"Certification pending legal/compliance review"** — not yet a verifiable claim, so it renders as a greyed placeholder chip per existing `LEGAL_SIGNOFF_TRACKER.md` convention). Restyled services grid to Stitch's asymmetric bento (1 large "Depression & Mood" tile + smaller tiles) using existing condition content — no new copy. |
| **Patient dashboard (desktop+mobile)** | Simple 4-icon horizontal journey row (no dates); current session hero card; 4 compact stat tiles; mood check-in emoji row; quick actions icon+label vertical list | Rich `JourneyRail` timeline (dates, per-step icons, colour states, current-step card with Join/View/Add-to-calendar CTAs, first-time/returning logic); 4 `DashboardSummaryCard` tiles (icon+number+label, already close to Stitch); `MoodCheckinCard` (emoji row + sparkline history); `QuickActionsCard` (icon+label rows) | **Keep our richer timeline — restyle only.** Our journey already has dates, CTAs, and first-time/returning logic that Stitch's simplified 4-icon row doesn't attempt; ripping that out would be a regression, not an upgrade. Applied Stitch's *visual* polish: larger, calmer icon nodes, refined connecting-line colour, tighter card padding, softer shadows (via token change). Mood check-in and quick actions were already present (contrary to the outdated "orphaned card" note in `refactor.md` history — both are mounted); style-aligned spacing/sizing to match Stitch's tighter, denser card rhythm. |
| **Booking wizard (desktop)** | Numbered-circle stepper (1-2-3-4) with connecting line, teal fill for current/done | `BookingStepper` — already numbered circles + connecting line + linear progress bar | **Kept ours (already matches).** Polished node sizing/spacing and colour states to align exactly with Stitch's teal-fill-on-done + primary-ring-on-current treatment; no structural change needed since we already independently converged on the same pattern. |
| **Patient appointments (desktop)** | Upcoming/past session cards + right column "Your Care Team" card + "Cancellation Policy" info card | Upcoming/past cards only, no sidebar column | **Adopt Stitch's sidebar column.** Added `AppointmentsCareTeamCard` (pulls from existing `usePatientMyClinician`-style data already used on `/patient/my-clinician`) and a static `CancellationPolicyCard` info panel, in a new two-column layout (`lg:grid-cols-[1fr_320px]`) that doesn't touch the existing appointment list/manage logic. |
| **Patient messages (desktop)** | Dedicated 3-pane messages screen (list + thread) w/ clinical safety reminder banner | Floating chat widget (`FloatingChatWidget`), no dedicated `/patient/messages` route | **Kept ours — deferred.** Building a full dedicated messages route is a net-new page/route, out of scope for a *visual* refactor that must not add new routes without explicit ask. Documented as a **future feature gap**, not a regression — our floating widget already contains the same `ChatConversationView` component Stitch's mockup implies, just accessed differently. |
| **Patient documents (desktop)** | Single "Documents" page merging clinical forms + letters + resources/worksheets, with an "action required" consent banner | Split across `/patient/resources` (worksheets) and `/patient/recordings` (session recordings); no consent/e-sign flow | **Kept our route split — nav label updated.** Consolidating resources+recordings+consent into one page is a functional/route change beyond this visual pass's remit (Stitch's consent "Review & Sign" flow doesn't exist in our backend). Renamed the sidebar nav label from "Resources" to **"Documents"** (clearer, matches Stitch's mental model) without moving or merging the underlying pages. |
| **Patient billing (desktop)** | Next scheduled payment card + Medicare rebate summary card (progress bar) + past invoices table w/ per-row "Claim Medicare" action | `BillingSnapshotCard` (dashboard) + `PatientInvoicesSection` (list) — no dedicated Medicare-rebate-progress card, no "Claim Medicare" row action | **Hybrid.** Restyled `PatientInvoicesSection` cards/table to Stitch's tighter card chrome and added distinct paid/pending/overdue pill tints (already flagged as a gap in the earlier UX audit — now closed). Did **not** add a "Claim Medicare" action button since that implies a real Medicare-claiming integration we don't have — would be a false affordance. |
| **Onboarding (desktop)** | Single-card multi-step wizard (Personal Details → Health History → Intake → Payment) with top progress bar | `PatientOnboardingChecklist` — a checklist-style page, not a step wizard | **Kept ours.** Onboarding is a checklist of *tasks* (some optional, order-independent) in our data model, not a linear wizard — converting to Stitch's linear stepper would misrepresent the underlying flow. Applied card/typography/spacing polish only. |
| **Clinician (psychologist) dashboard (desktop)** | "Today's Schedule" list w/ Join Now button; Session Hrs + Satisfaction stat tiles; "New Referrals" card (avatar + review link) | `TodayScheduleCard` (list, "Next up"/"Open" links only, no Join Now); `PsychologistDashboardSummaryCards` (sessions/caseload/messages/notes); no referrals card on dashboard (referrals live under Manager) | **Hybrid.** Added a **Join Now** button on `TodayScheduleCard` when a session's join window is open (reusing `joinSessionHref` + the same window-open logic as the patient hero — no new backend). Kept our existing stat-card set (sessions/caseload/messages/notes) rather than swapping to Stitch's Session-Hrs/Satisfaction — those metrics (weekly hours, patient satisfaction rating) don't exist in our current API and would be fabricated data; **deferred**, flagged for backend follow-up. Did not add "New Referrals" to the clinician dashboard — referrals are an ops/manager workflow in our RBAC model, not psychologist-facing; adding it would blur role boundaries. |
| **Video session (desktop)** | Full-bleed video + right-side "Session Notes" panel (shared chat/file notes) | `TwilioVideoRoom` full-bleed, no side panel during an active call (chat panel only exists pre-call) | **Adopted.** Added a collapsible **Session Notes** panel (`SessionNotesPanel`, wraps the existing `ChatConversationView` used pre-call) beside the video grid on `lg+` screens during an active call, toggled via the existing chat control button. Zero changes to `TwilioVideoRoom` internals/Twilio SDK wiring — purely an additive layout wrapper in `JoinSessionGate`. |

---

## 3. New elements adopted from Stitch

| Element | Status |
|---|---|
| Mood check-in "How are you feeling today?" emoji row | **Already existed** (`MoodCheckinCard`) — style-aligned sizing/spacing to Stitch's tighter card. |
| Quick Actions icon+label vertical list | **Already existed** (`QuickActionsCard`) — style-aligned row height/icon treatment. |
| Booking wizard numbered-circle stepper | **Already existed** (`BookingStepper`) — polished colours/sizing only. |
| "Your Care Team" + "Cancellation Policy" cards on Appointments | **New** — added. |
| Video session "Session Notes" side panel | **New** — added (reuses existing chat infrastructure). |
| Trust bar with 4 certification badges | **New** — added, with ISO 27001 marked pending counsel review. |
| "Match / Meet / Manage" 3-step framing | **New** — added as a second, complementary section (does not replace "How it works"). |
| Asymmetric services grid (1 large + smaller tiles) | **New** — restyled existing grid. |

---

## 4. Constraints honoured

- No unapproved AHPRA/ISO claims — ISO 27001 renders as a "counsel review pending" placeholder chip, consistent with `LEGAL_SIGNOFF_TRACKER.md`.
- No regression to: mobile nav drawer/sheet, `--primary-foreground` contrast fix, `app/patient/loading.tsx` / `error.tsx`, skip-to-content link, journey CTA logic (no dashboard self-links), first-time/returning user context, socket resilience/network banner, React Query cache tuning.
- No Stitch static HTML/CDN Tailwind copied verbatim — every screen translated into existing component/token architecture.
- Brand teal (`--primary: #5fa8a6`) unchanged as source of truth.
- en-AU copy conventions preserved throughout new copy.

## 5. Implementation status

See per-screen status column above (all rows marked with a MERGE decision are implemented as described). Build and test status recorded in `REFACTOR_STATUS.md` → "Stitch Design Alignment" section.
