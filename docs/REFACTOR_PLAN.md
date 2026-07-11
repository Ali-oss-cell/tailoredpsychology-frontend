# Tailored Psychology (Clink) — Patient Experience Audit & Refactor Plan

**Scope of this report:** narrowed to the **Patient Dashboard and the other patient-facing screens**, per your latest request. The original brief covered Patient/Doctor/Admin — I audited the whole app first, then this document filters to the patient side. Two things worth knowing before you read further:

1. **The roles in the real app are Patient, Psychologist, Admin, and Manager** — there's no "Doctor" and no "Prescriptions" workflow anywhere in the frontend *or* the backend's Prisma schema. That's correct, not a gap: this is an Australian telehealth **psychology** platform (`tailoredpsychology.com.au`), and psychologists in Australia don't prescribe. The clinician-facing equivalent of "medical history" is `psychologist_notes` + `referral_documents` (GP referrals, tied to Medicare rebates).
2. Everything here is grounded in the actual cloned repos (`tailoredpsychology-frontend`, `tailoredpsychology-backend`) — file paths, line numbers, and measured contrast ratios are cited throughout so this can be handed directly to an engineer.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 (CSS-first `@theme`) · shadcn/ui + Radix (`radix-ui` umbrella package) · TanStack Query · Phosphor Icons · driver.js (product tours) · Twilio Video · Socket.IO · NestJS + Prisma backend.

---

## Executive Summary

| Dimension | Score | Why |
|---|:-:|---|
| **UI** | **7/10** | Sophisticated token system (semantic colors, 3-tier elevation shadows, systematic radius scale, a real motion system) and genuinely polished flagship moments (booking wizard, dashboard hero). Pulled down by one specific, measurable bug: the primary brand color fails contrast in its most common uses. |
| **UX** | **6/10** | The desktop patient journey (dashboard → book → manage → join) is thoughtfully sequenced with real craft (live countdown, join-window awareness, autosave). But **patient navigation is unreachable below 1024px width**, which for a telehealth product used from phones is close to a top-line usability failure, not a polish issue. |
| **Accessibility** | **5/10** | Two things are true at once: form fields have textbook `aria-invalid`/`aria-describedby`/`role="alert"` wiring, and reduced-motion is handled correctly in both directions. At the same time, the primary color fails WCAG AA everywhere it's used as button/badge/link content, there's no skip link, and the persistent nav — the app's main wayfinding device — disappears entirely on mobile with no substitute. |
| **Consistency** | **6.5/10** | Strong shared primitives (`PortalFormField`, `PatientPortalPage`, `DashboardStateBlock`) are used almost everywhere, but there are specific, fixable defections: one hand-rolled `<textarea>` that duplicates existing styling instead of reusing it, two parallel empty-state components, and one route that skips the standard page wrapper. |
| **Maintainability** | **8/10** | This is the strongest dimension. 47 test files, zero `console.log`, zero `@ts-ignore`/`as any`, near-zero TODO debt, clean domain-driven `src/` organization, and well-reused shared components (`admin-data-table`, role-parameterized ops pages). Two fully-built, tested dashboard features are wired to nothing, which is the main deduction. |

**The one-sentence version:** the patient experience has real product craft in its core flows, sitting on top of a design-token bug and a navigation gap that are both small, specific, and fast to fix — this is a codebase in good health that needs a short, targeted pass, not a rebuild.

---

## Critical Issues

Ranked by how many patients they affect and how badly.

### 1. Patient navigation does not exist below 1024px (P0)
`components/ui/sidebar.tsx:122` hardcodes the sidebar to `hidden ... lg:flex` — it renders on screens ≥1024px and nowhere else. The toggle button that would open it is *also* hidden below `lg` (`components/patient/patient-shell.tsx:104`, `className="hidden lg:inline-flex"`). The only other header element on mobile is the avatar in `patient-header-profile.tsx`, which is a single `<Link>` to onboarding/account — not a menu, not a drawer trigger, nothing.

Net effect: on a phone or a tablet in portrait mode, a signed-in patient can see the dashboard's own content (it correctly reflows to one column) but has **no way to reach** Appointments, Book Appointment, My Clinician, Resources, Invoices, Data Requests, Recordings, or Account. For a telehealth product, this is the single highest-leverage fix in this report.

*What makes this a confident finding rather than a guess:* the dashboard's own content grid uses the identical `lg` breakpoint to correctly collapse to one column (`patient-dashboard-view.tsx:67`). The team clearly designed for mobile — they just never gave the nav itself a mobile mode.

### 2. The primary brand color fails WCAG AA almost everywhere it's used as text/button content
Measured directly from `app/globals.css`, not estimated:

| Pair | Ratio | AA text (4.5:1) | AA large/UI (3:1) |
|---|:-:|:-:|:-:|
| `text-primary-foreground` on `bg-primary` (default Button — the CTA style) | **2.55:1** | Fail | Fail |
| `text-primary` on `bg-primary/15` (default Badge) | **2.41:1** | Fail | Fail |
| `text-primary` on background/card (link-style text) | **2.55–2.75:1** | Fail | Fail |

This isn't cosmetic — `variant: default` is what `<Button>` renders with no props, so it's the CTA style used across the whole patient journey (Book New Appointment, Join Video Session's outline elements, etc. — 74 `bg-primary` + 107 `text-primary` occurrences across 65+ files). Low-vision patients reading a teal button with near-white text is a real barrier, not a nitpick.

**The fix costs nothing to the brand:** swapping `--primary-foreground` from `#f4f7f6` to the existing `--foreground` (`#1a1f1f`) — a color already in the palette — gets you **6.06:1**, a comfortable pass, with zero change to the teal hue itself. This satisfies your "keep the existing primary brand color" constraint exactly.

### 3. No route-level error or not-found boundaries anywhere
0 of 64 routes have `error.tsx`, 0 have `not-found.tsx`. The `patient/` section is also the *only* role missing even a `loading.tsx` (psychologist, admin, and manager each have one). To be fair to the team: many components self-manage loading/error state well via a shared `DashboardStateBlock`, so this isn't "nothing is handled" — but that component-level pattern only activates *after* a component has already mounted and started its own fetch. A render-time exception, a bad deploy, or a mistyped patient URL currently falls through to Next.js's bare default screens instead of anything on-brand.

### 4. Two fully-built, tested patient features are wired into nothing
`components/patient/dashboard/mood-checkin-card.tsx` (141 lines, its own test file, emoji mood picker, 14-day history, save/retry states) and `quick-actions-card.tsx` (84 lines, its own test file, shortcuts to Book/Message/Invoices) are both complete, accessible (`aria-pressed`, `aria-label`), and even still carry `data-tutorial` hooks from the onboarding tour system — but neither is imported by `patient-dashboard-view.tsx` or anywhere else. This reads like a regression (something dropped them from the dashboard composition during a later pass) rather than an intentional removal, given the leftover tutorial wiring. Cheapest possible win in this whole report: two `import` lines and a decision on the dashboard grid.

### 5. No skip-to-content link
Not present anywhere in the codebase. Once fix #1 lands and mobile users can actually reach the sidebar, keyboard users on *any* viewport will need to tab through the full nav on every page load to reach content. One `<a href="#main">` fixes this app-wide.

---

## Screen-by-Screen Review

**Shared chrome (applies to all 11 patient screens below):** `PatientShell` (`components/patient/patient-shell.tsx`) — sidebar nav with persisted open/closed state, header search, notification bell, driver.js tutorial system, floating chat widget. Genuinely well built (see Critical Issues #1 for the one serious gap). Active-route highlighting is computed correctly via `usePathname()` in `patient-shell-layout.tsx`, not hardcoded — no issue there.

### `/patient/dashboard`
**Component:** `patient-dashboard-view.tsx` → `NextSessionHero`, `ResourceRecommendationsCard`, `BillingSnapshotCard`, `JourneyRail`.
- **Strengths:** Personalized greeting with a properly `aria-label`led skeleton; `JourneyRail` auto-hides once onboarding is complete instead of nagging; the two-column resource/billing layout uses a `lg:sticky` billing card, a nice touch. `NextSessionHero` is the standout piece of the whole app — live countdown ("Starts in 3h 24m", ticks every 30s), a join button that only appears inside the actual join window with plain-language copy explaining *why* it's hidden otherwise ("Join opens 15 minutes before your session starts"), a pulse animation timed to when the window opens, and a properly `aria-expanded`-driven "Manage" disclosure panel.
- **Issues:** Mood Check-in and Quick Actions cards exist but aren't rendered (Critical #4). Status chips and the countdown text both use `text-primary`/semantic colors subject to Critical #2's contrast fix.
- **Accessibility:** Loading state correctly uses `aria-busy` + `aria-label`. Section labels throughout (`card-eyebrow` class) are styled as headings but are `<p>` tags, not `<h*>` — see Component Audit.
- **Effort to address open items:** Low (re-mounting the two orphaned cards is trivial; everything else here is covered by the systemic fixes).

### `/patient/book-appointment` (+ `/payment-success`)
**Component:** `booking-wizard.tsx` orchestrating 9 steps (`booking/steps/*`, 2,451 lines total) — this is the patient-facing analogue of an "intake form" and the most complex flow in the product.
- **Strengths:** This is the best-executed screen in the app. "Step X of Y" plus a per-step time estimate: sets expectations up front, which is exactly what reduces drop-off in long forms. A "what happens next" contextual helper per step answers the unspoken "why are you asking me this" question a low-tech-literacy user has. Autosave draft status is visible and has a manual refresh. Validation errors surface as a labeled, icon-marked summary block linked via `aria-labelledby` to the step title. Copy branches for new vs. returning patients. A dedicated crisis-support panel (`booking-crisis-panel.tsx`) is present in a mental-health booking flow, which is the right call. Motion transitions respect `motion-safe`/`motion-reduce`.
- **Issues:** `compact-date-picker.tsx` (265 lines) and `reschedule-datetime-field.tsx` (231 lines, used from the Appointments screen) implement date/time selection independently — a strong duplication candidate. Both use native `<select>` internally, which is actually the *right* accessibility/mobile call, not a bug — no need to swap these for a custom Radix Select.
- **Effort:** Medium (the date-picker consolidation is real refactor work; nothing here is urgent).

### `/patient/appointments`
**Component:** `patient-appointments-section.tsx` (215 lines) — "Upcoming appointments" / "Recent sessions" cards.
- **Strengths:** Clear two-card split by time horizon, consistent with the dashboard's upcoming/past framing elsewhere in the app.
- **Issues:** Uses `reschedule-datetime-field.tsx` for rescheduling — same duplication note as above. Worth auditing for the same raw-status-string issue flagged on Recordings below.
- **Effort:** Low–Medium.

### `/patient/my-clinician`
**Component:** `patient-my-clinician-section.tsx` (295 lines) — one card per assigned clinician.
- **Issues:** Zero heading elements in the whole file (verified directly — no `<h1-6>`, no `font-heading`/`font-semibold`). It relies entirely on the `card-eyebrow` label ("Clinician") for section identity, which is the same non-semantic-heading pattern flagged app-wide. For a 295-line page this matters more than average — a screen-reader user jumping by heading will find nothing to jump to here.
- **Effort:** Low (this is a targeted markup fix, not a redesign).

### `/patient/account`
**Component:** `patient-account-settings.tsx` (457 lines — the largest patient component) — Profile and Security & Privacy sections.
- **Strengths:** Uses proper `CardTitle` sectioning (unlike My Clinician), so this one *is* screen-reader-navigable by heading.
- **Issues:** Given its size, worth a follow-up pass specifically checking whether every field here routes through `PortalFormField`/`PortalTextInput` (the well-built shared wrapper) versus any hand-rolled inputs, since we found at least one hand-rolled field elsewhere (Data Requests, below) that skipped it.
- **Effort:** Low (audit) → Medium if hand-rolled fields are found and need migrating.

### `/patient/invoices`
**Component:** `patient-invoices-section.tsx` (126 lines).
- **Strengths:** Genuinely nice details: a formatted invoice ID with the raw ID preserved in a `title` tooltip, per-row "Downloading…" loading state on the download button, and an `aria-label` that disambiguates which invoice a generic "Download" button refers to.
- **Issues:** The status badge only visually distinguishes "paid" from "everything else" (`InvoiceStatusBadge`, uses one primary-tinted style vs. one neutral style) — pending, overdue, and failed invoices all render identically. For a billing screen, an overdue invoice arguably deserves its own (accessible) warning treatment.
- **Effort:** Low.

### `/patient/resources`
**Component:** `patient-resources-section.tsx` (42 lines) — the smallest patient screen, likely a simple list/grid.
- **Effort:** Low — nothing flagged beyond the systemic issues (contrast, eyebrow-as-heading if used).

### `/patient/recordings`
**Unusual for this codebase: logic and markup live directly in `app/patient/recordings/page.tsx`** rather than delegating to a `components/patient/...` section like every other patient route does — a real, if minor, architectural inconsistency worth normalizing.
- **Strengths:** Clean loading → error (with retry) → empty → data sequence via `DashboardStateBlock`.
- **Issues (the most concrete content/UX problems found in this audit):**
  - The primary label shown for each recording is `recording.videoId` — a raw system identifier, not "Session with [clinician] — [date]." A patient with "little technical knowledge" (your brief's own framing) has no reason to know what a video ID is.
  - `policyStatus` is rendered as `{recording.policyStatus.replace("_", " ")}` in bare uppercase text — a backend enum leaking into patient-facing copy with no human relabeling and no badge styling.
  - The "Request access" button has no busy/disabled state while the request is in flight (unlike Invoices' download button, which does this correctly) — a patient could double-click or assume nothing happened.
  - Access-granted and access-denied messages render in the same neutral gray, with no visual distinction between "good news" and "bad news."
- **Effort:** Low–Medium — this is mostly copy/labeling and reusing patterns that already exist elsewhere in the same codebase (Invoices' per-row loading state, the app's existing success/destructive tokens).

### `/patient/video-setup`
**Component:** `PatientVideoSetupCard`, thin wrapper.
- **Strengths:** The page description is a small but real UX win: *"This does not start a session with your clinician"* — proactively defusing an obvious anxiety a first-time telehealth patient would have. Follows the standard thin-page pattern correctly.
- **Effort:** Low — nothing flagged.

### `/patient/data-requests`
**Component:** inlined in `app/patient/data-requests/page.tsx` (same pattern deviation as Recordings).
- **Strengths:** Clear "Access" vs. "Correction" request cards with icon, label, and hint — good scannability for an Australian Privacy Act–style workflow. Reuses `ConfirmDialog` and `toast.success`/`toast.error` correctly.
- **Issues:** The `<textarea>` inside the confirmation dialog is hand-styled with a class string that closely duplicates `portalInputClassName()` from `components/shared/portal-form-field.tsx`, instead of using the `PortalTextarea` component that already exists for exactly this. Practical consequence, not just a style nit: by not reusing the wrapper, this field lost the `aria-invalid`/`aria-describedby`/`role="alert"` wiring that every other form field in the app gets for free.
- **Effort:** Low (this is a find-and-replace with the existing primitive).

### `/patient/onboarding`
**Component:** `PatientOnboardingChecklist` (334 lines) — good internal heading hierarchy (`h2` → `h3` → `CardTitle`), better structured internally than most patient screens.
- **Issues:** The page does **not** use the shared `PatientPortalPage` wrapper that every other patient route uses (it's a bare `<div data-tutorial="...">` in `app/patient/onboarding/page.tsx`) — worth confirming this is intentional, since it means this route doesn't get the same title/eyebrow/journey-rail treatment as its siblings.
- **Effort:** Low.

---

## Component Audit

| Component | Current State | Recommended Changes | Priority |
|---|---|---|---|
| **Button** (`ui/button.tsx`) | Single well-built CVA component, 7 sizes, 6 variants, pill-shaped (`rounded-4xl`). Default variant fails contrast (2.55:1). | Swap `--primary-foreground` to `--foreground`. No structural changes needed. | **High** |
| **Badge** (`ui/badge.tsx`) | Clean 3-variant CVA component. Default variant fails contrast (2.41:1). | Same token fix as Button resolves this automatically (they share `--primary-foreground`). | **High** |
| **Sidebar / Navigation** (`ui/sidebar.tsx`, 3 role shells) | Solid shared primitive (persisted state, icon-collapse, active-route via `usePathname`) — but `hidden ... lg:flex` with zero mobile substitute. | Add a `Sheet`/drawer mode below `lg`, matching what shadcn's own Sidebar recipe normally includes. This is the single highest-priority fix in the report. | **Critical** |
| **Form fields** (`portal-form-field.tsx`: `PortalFormField`, `PortalTextInput`, `PortalSelect`, `PortalTextarea`, `PortalCheckboxField`, `PortalFileUpload`) | Excellent accessibility wiring by default — `aria-invalid`, `aria-describedby` linking both hint and error, `role="alert"` on errors. Native `<select>` used (good — better mobile/OS integration than a custom listbox). `required` prop is accepted and shown visually but never propagated to the child input's `required`/`aria-required`. | Wire `required` through the existing `cloneElement` call. Audit remaining forms (Account, Data Requests) for consumers that bypass this wrapper. | **Medium** |
| **Cards** (`ui/card.tsx` + `interactive-lift` utility) | Consistent, used everywhere, nice hover/press micro-interactions. | No changes needed. | — |
| **Dialogs/Modals** | Only two exist: `confirm-dialog.tsx` (purpose-built yes/no) and a one-off `tutorial-welcome-dialog.tsx`. No generic composable Dialog. | If richer modals are ever needed (quick-view of a note, inline edit), there's currently no reusable base — worth adding a generic `ui/dialog.tsx` from the already-installed `radix-ui` package before the next feature needs one. | Low (build ahead of need, not urgent today) |
| **Tabs** | Not used anywhere in the codebase. Where tab-like filtering exists (e.g., Upcoming/Past sessions), it's a manually-built segmented button group with `role="group"`/`aria-label` — a legitimate, simpler alternative to full ARIA tabs for binary toggles. | No action needed — this is a reasonable pattern choice, not a gap. | — |
| **Date/time pickers** | Two independent implementations: `compact-date-picker.tsx` (booking) and `reschedule-datetime-field.tsx` (appointments/reschedule), both using native `<select>` internally. | Extract one shared date/time-selection primitive; keep the native-select approach. | **Medium** |
| **Empty states** | Two parallel patterns: `DashboardStateBlock variant="empty"` (plain text, used in list contexts) and `EmptyState`/`EmptyStateAction` (icon + title + description + CTA, used in `NextSessionHero`). Both are well-built individually. | Either standardize on the richer `EmptyState` pattern for anything patient-facing, or explicitly document when each is appropriate (compact list row vs. primary hero moment). | **Low–Medium** |
| **Loading states** | `Skeleton` component + `skeleton-shimmer` animation, used consistently, `aria-busy`/`aria-label` present on the dashboard hero. Only 3/64 routes have route-level `loading.tsx`. | Add `app/patient/loading.tsx` at minimum (the one role currently missing it entirely). | **Medium** |
| **Error states** | `DashboardStateBlock variant="error"` with retry, used consistently at the component level. Zero route-level `error.tsx` anywhere. | Add `error.tsx` under `app/patient/`. | **Medium** |
| **"Eyebrow" section labels** (`.card-eyebrow` utility) | Used 51 times as a de facto section-heading system — always on `<p>`, never on a heading tag. Functions visually as a heading but is invisible to screen-reader heading navigation. | Either promote to a real (visually-restyled) `<h2>`/`<h3>`, or pair each with a visually-hidden semantic heading. | **Medium** |
| **List rows / tables** (`PortalListRow`, `admin-data-table.tsx`) | `PortalListRow` used consistently across Recordings/Invoices/Data Requests/Referrals. `overflow-x-auto` present on only 3 of ~8 table-bearing files. | Audit remaining table-bearing components for horizontal-scroll safety on narrow viewports. | **Low–Medium** |
| **Toasts** (`sonner` via `AppSonner`) | Mounted once at root, used correctly (`toast.success`/`toast.error` in Data Requests). | No changes needed. | — |

---

## Design System Recommendations

**Typography.** `Noto Sans` (body) + `Inter` (headings) + `Geist Mono`, loaded via `next/font/google`. Functional and safe, but the two sans faces are similar enough in personality that headings don't read as a distinct register from body text at a glance — there's room for more typographic contrast (weight, size, or a face with more character for headings) without touching the brand color at all. Not urgent; a Phase 4 polish item.

**Colors.** The semantic token system itself (`background`/`foreground`/`card`/`popover`/`primary`/`secondary`/`muted`/`accent`/`destructive`/`success`/`warning`/`info`, each with a paired `-foreground`, plus a full parallel dark-mode set) is genuinely well-designed and should be kept as-is structurally. The one required change: **`--primary-foreground: #f4f7f6` → `#1a1f1f`** (reuses the existing `--foreground` token, takes primary-on-primary text from 2.55:1 to 6.06:1). Secondary recommendation: audit `--warning`/`--success`/`--destructive` used as standalone text colors (`text-warning`, `text-success`) — these land at 3.1–4.1:1, which passes for large text/icons but not small body text; use them at larger sizes or paired with an icon rather than as small inline text.

**Spacing.** Tailwind's default scale, used consistently — no evidence of one-off pixel values (only 2 hardcoded widths in the entire frontend). No changes needed.

**Grid.** `lg` (1024px) is the app's one meaningful breakpoint for major layout shifts (237 `md:` and 53 `lg:` usages). This is a reasonable choice for content, but it's the same breakpoint at which navigation currently disappears (Critical #1) — once nav gets its own mobile mode, it doesn't need to share the same breakpoint as content reflow.

**Component standards.** `components/ui/` currently holds 9 primitives (Button, Sidebar, Sonner wrapper, Confirm Dialog, Badge, Alert, Input, Card, Skeleton). That's thin relative to what the product actually needs — Dialog, Select, Table, and Tooltip all get reinvented or hand-rolled per feature when needed. Recommend growing this folder opportunistically (build the primitive the next time a feature needs it, rather than a big upfront push).

**Icons.** Phosphor Icons throughout, `aria-hidden` used 93 times on decorative icons — genuinely good discipline. No changes needed.

**Shadows.** A real 3-tier elevation system (`--shadow-e1/e2/e3` + a primary glow variant), explicitly documented in code as replacing flat borders as the primary separator. This is more sophisticated than most audits find in a codebase this size — keep it, don't touch it.

**Border radius.** Single `--radius` base (0.625rem) driving a full `sm→4xl` scale via `calc()`. Properly systematic, single source of truth. No changes needed.

**States.** Hover/active/focus-visible states are present on interactive elements (`focus-visible:ring-ring`, `.press`/`.interactive-lift` utilities). Reduced-motion is respected in both directions (animations gated behind `prefers-reduced-motion: no-preference`, with an explicit reset for `reduce`) — genuinely rare to see done this correctly.

**Interaction patterns.** A deliberate motion system exists (`--ease-out-quint`, duration tokens from "micro" to "reveal"). The recommendation here isn't to change it — it's to make sure the two new nav-related interactions (mobile drawer open/close, skip link focus) adopt the same tokens rather than introducing new one-off transitions.

---

## UX Improvements

### High Impact
- Ship a mobile nav pattern (Critical #1) — unlocks the entire product below 1024px.
- Fix the primary-color contrast chain (Critical #2) — one token change, fixes Button, Badge, and link-style text simultaneously.
- Re-mount Mood Check-in and Quick Actions on the dashboard, or explicitly retire them (Critical #4).
- Replace raw `videoId`/`policyStatus` strings on Recordings with human labels (clinician name + date; friendly status + badge styling).

### Medium Impact
- Add `app/patient/loading.tsx` and `app/patient/error.tsx`.
- Consolidate the two date-picker implementations (`compact-date-picker` / `reschedule-datetime-field`).
- Reuse `PortalTextarea` in the Data Requests confirmation dialog instead of the hand-rolled duplicate.
- Wire `required` → `aria-required`/`required` in `PortalFormField`.
- Differentiate invoice status badges beyond paid/not-paid.
- Add a busy state to the Recordings "Request access" button.

### Low Impact
- Promote `.card-eyebrow` to a real heading element (or pair with a visually-hidden one) — 51 instances, mechanical fix.
- Give the Onboarding route the standard `PatientPortalPage` wrapper.
- Consolidate `DashboardStateBlock`'s empty variant with the richer `EmptyState` component.
- Add a skip-to-content link.
- Audit remaining tables for `overflow-x-auto` coverage.

---

## Refactor Roadmap

### Phase 1 — Critical UX Fixes
Mobile nav drawer for the patient shell; the `--primary-foreground` token fix; `app/patient/loading.tsx` + `error.tsx`; skip-to-content link.
**Effort: Medium–High** (the drawer is genuine new-component work and needs testing across the 3 role shells that share `ui/sidebar.tsx`; everything else in this phase is small and mechanical).

### Phase 2 — Layout Refactor
Re-mount or retire Mood Check-in and Quick Actions; give Onboarding the standard page wrapper; normalize Recordings/Data Requests onto the same "thin page → dedicated section component" pattern used everywhere else.
**Effort: Medium.**

### Phase 3 — Component Standardization
Consolidate the two date pickers into one shared primitive; replace the hand-rolled Data Requests textarea with `PortalTextarea`; wire `required` through `PortalFormField`; start growing `components/ui/` (Dialog, Table, Select) as real needs arise.
**Effort: Medium–High** (the date-picker consolidation is the biggest single item here — it touches both Booking and Appointments).

### Phase 4 — Visual Polish
Promote `.card-eyebrow` to semantic headings; friendlier copy/labels on Recordings; differentiated invoice status badges; typography contrast between heading/body registers if desired.
**Effort: Low–Medium.**

### Phase 5 — Accessibility & Responsive Improvements
Consolidate empty-state components; audit remaining tables for horizontal-scroll safety; broaden `aria-describedby`/`aria-invalid` coverage to any fields still outside the `Portal*` family; full keyboard-navigation pass now that mobile nav exists.
**Effort: Medium.**

---

## Final Verdict

**What's currently stopping this from feeling like a fully modern healthcare product isn't a lack of design sophistication — it's two specific, narrow bugs sitting on top of genuinely good work.** The token system, the shadow/radius/motion architecture, and flagship flows like the booking wizard and the dashboard's next-session hero are built with real craft and are already comparable to well-regarded consumer healthcare products. What undercuts that impression: a brand color that fails contrast in its most visible uses, and a navigation system that simply isn't there on a phone. Neither requires a redesign — both are targeted, well-understood fixes.

### Top 20 changes, ranked by impact
1. Add a mobile drawer/sheet mode to `ui/sidebar.tsx` (Critical #1)
2. Change `--primary-foreground` to `--foreground` in `globals.css` (Critical #2)
3. Re-mount `MoodCheckinCard` and `QuickActionsCard` on the dashboard, or remove them deliberately
4. Add `app/patient/loading.tsx`
5. Add `app/patient/error.tsx` (and ideally a root `global-error.tsx`)
6. Add a skip-to-content link
7. Replace `recording.videoId` with a human-readable session label on `/patient/recordings`
8. Replace raw `policyStatus` enum text with a styled, human-labeled badge
9. Add a busy/disabled state to Recordings' "Request access" button
10. Reuse `PortalTextarea`/`portalInputClassName` in the Data Requests dialog textarea
11. Wire the `required` prop through `PortalFormField`'s `cloneElement`
12. Consolidate `compact-date-picker.tsx` and `reschedule-datetime-field.tsx`
13. Differentiate invoice status badges (paid / pending / overdue / failed)
14. Promote `.card-eyebrow` labels to real headings (or pair with visually-hidden ones) — 51 instances
15. Give `/patient/onboarding` the standard `PatientPortalPage` wrapper
16. Consolidate `DashboardStateBlock`'s empty variant with `EmptyState`/`EmptyStateAction`
17. Add `app/not-found.tsx` for the whole app
18. Normalize Recordings and Data Requests onto dedicated section components (matching every other patient route)
19. Audit remaining data tables for `overflow-x-auto` on narrow viewports
20. Add a generic `ui/dialog.tsx` ahead of the next feature that needs a real modal

### For developers: none of this requires unnecessary redesign
Every item above is additive or a targeted swap inside files that already exist and already follow good patterns elsewhere in the same codebase — the fixes are mostly "do here what you already did well over there." Items 1–6 are the ones worth doing before anything else; together they take the product from "beautiful on desktop, broken on phones, with one contrast bug" to "solid everywhere," which is the single biggest jump in perceived quality available in this codebase today.

---

## Implementation Status

**Completed:** 2026-07-11  
**Build:** `npm run build` ✅  
**Tests:** `npm test` — 52 suites, 135 tests ✅  
**Migrations:** Not required (frontend-only)

### Phase completion

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Critical UX Fixes | ✅ Complete | Mobile drawer, contrast, patient loading/error, skip link, not-found, global-error |
| Phase 2 — Layout Refactor | ✅ Complete | Mood/Quick Actions remounted; onboarding uses `PatientPortalPage`; Recordings/Data Requests section components |
| Phase 3 — Component Standardization | ✅ Complete | `native-datetime-picker.tsx` shared primitive; `PortalTextarea` in data requests; `PortalFormField` required wiring; `ui/dialog.tsx` + `ui/sheet.tsx` |
| Phase 4 — Visual Polish | ✅ Mostly complete | Recordings labels/badges; invoice status badges; patient portal `CardSectionHeading` (not all 51 app-wide) |
| Phase 5 — Accessibility & Responsive | ✅ Mostly complete | `EmptyState` on patient empty moments; `overflow-x-auto` on patient list tables; keyboard focus in mobile sheet + skip link |

### Top 20 checklist

| # | Item | Status | Date |
|---|------|--------|------|
| 1 | Mobile drawer/sheet in `ui/sidebar.tsx` | ✅ | 2026-07-11 |
| 2 | `--primary-foreground` → `#1a1f1f` | ✅ | 2026-07-11 |
| 3 | Re-mount `MoodCheckinCard` + `QuickActionsCard` | ✅ | 2026-07-11 |
| 4 | `app/patient/loading.tsx` | ✅ | 2026-07-11 |
| 5 | `app/patient/error.tsx` + `app/global-error.tsx` | ✅ | 2026-07-11 |
| 6 | Skip-to-content link | ✅ | 2026-07-11 |
| 7 | Human-readable recording session labels | ✅ | 2026-07-11 |
| 8 | Friendly `policyStatus` badges | ✅ | 2026-07-11 |
| 9 | Recordings request busy/disabled state | ✅ | 2026-07-11 |
| 10 | `PortalTextarea` in Data Requests dialog | ✅ | 2026-07-11 |
| 11 | `PortalFormField` `required` → input | ✅ | 2026-07-11 |
| 12 | Date picker consolidation (`native-datetime-picker.tsx`) | ✅ | 2026-07-11 |
| 13 | Distinct invoice status badges | ✅ | 2026-07-11 |
| 14 | `.card-eyebrow` → semantic headings | ⚠️ Partial | 2026-07-11 — all patient portal screens; booking wizard eyebrows deferred |
| 15 | Onboarding `PatientPortalPage` wrapper | ✅ | 2026-07-11 — via `PatientOnboardingChecklist` |
| 16 | `EmptyState` vs `DashboardStateBlock` empty | ⚠️ Partial | 2026-07-11 — patient list empty moments migrated |
| 17 | `app/not-found.tsx` | ✅ | 2026-07-11 |
| 18 | Recordings + Data Requests section components | ✅ | 2026-07-11 |
| 19 | Table `overflow-x-auto` audit | ⚠️ Partial | 2026-07-11 — patient invoices/recordings/data-requests; ops tables already covered |
| 20 | Generic `ui/dialog.tsx` | ✅ | 2026-07-11 |

### Verified no regression

- Journey CTAs and first-time user state (`a75b367` / `usePatientPortalContext`) — unchanged
- Account settings — all fields use `PortalFormField` / `PortalTextInput` / `PortalSelect` / `PortalTextarea`

### Deferred (with reason)

| Item | Reason |
|------|--------|
| All 51 `.card-eyebrow` instances app-wide | Patient portal screens completed; psychologist/ops/booking eyebrows left for a follow-up pass |
| Full keyboard nav audit beyond nav drawer | Mobile sheet + skip link + existing dialog focus traps cover highest-risk paths; broader tab-order audit deferred |
| Clinician name on recordings without care-team match | Falls back to "Session · [date]" when clinician not in care team API response |