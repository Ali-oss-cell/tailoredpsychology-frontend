# Brand Alignment Refactor — Cursor-Ready Spec

**Date:** 2026-07-11  
**Scope:** In-place visual and UX refactor — **not a rebuild**. Preserve routes, booking logic, journey state machine, tests, and accessibility wiring.  
**Audience:** Engineers and AI agents implementing phased UI work in `tailoredpsychology-frontend`.

---

## Executive summary

The live frontend was tuned against the **Stitch “Serene Clinical Systems”** mockup (`stitch_tailored_psychology_ui_system/`, `#5fa8a6` teal, Inter + Noto Sans). The **official Tailored Psychology brand guide** (provided by product; **not committed to this repo**) specifies a softer, warmer palette and **Gabriola** for display type. Those two sources conflict on primary colour and typography.

This spec:

1. Standardizes **one button system** first (Phase 0) so later token changes do not multiply inconsistencies.
2. Migrates **CSS semantic tokens** with two documented colour tracks (Phase 1).
3. Redesigns the **first-time patient dashboard** around a single next action (Phase 2).
4. Passes **shell + marketing** and **remaining portal pages** (Phases 3–4).

**Do not** rewrite booking wizard logic, journey API contracts, or `PortalFormField` a11y patterns. Change presentation and token consumption only.

---

## Animation placement rules

Motion should reinforce **page-level narrative** on marketing surfaces and **state feedback** on interactive controls — never compete with data entry, cards, or forms inside the portal.

### Do — appropriate motion

| Context | Pattern | Example |
|---------|---------|---------|
| Marketing hero | One-shot enter, word stagger | `.hero-word`, `.hero-media-settle` on `hero-section.tsx` |
| Marketing page load | Subtle page fade | `PublicPageEnter` (GSAP fade+rise on `<main>`) |
| Marketing section headers | Scroll reveal on **headline blocks only** | `ScrollReveal` wrapping an `<h2>` + intro copy, not card grids |
| Public nav | Scroll glass transition | `[data-public-header][data-scrolled]` in `globals.css` |
| Buttons / links | CSS `transition` on hover/focus | `Button` default transitions; `press` scale on click |
| Loading | Skeleton shimmer, spinners | `.skeleton-shimmer`, `animate-spin` on save icons |
| Join window open | One-shot pulse on CTA | `.join-live-pulse` on join button only |
| Modals / sheets | Radix enter/exit | `Dialog`, `Sheet` `animate-in` / `animate-out` |
| Reduced motion | Always respect `prefers-reduced-motion` | `[data-reveal]` forced visible; pulse disabled |

### Don't — remove or relocate

| Context | Anti-pattern | Fix |
|---------|--------------|-----|
| Portal cards | `interactive-lift`, `marketing-card:hover` on `dashboard-card` | Remove lift class; static card shadow only |
| Dashboard stat tiles | `ScrollReveal` or entrance on summary cards | No entrance animation |
| Booking wizard | `motion-safe:animate-in` on step content card | Static step swap; keep stepper state change only |
| Form fields | `motion.div`, `animate-in` on `PortalFormField` wrappers | Never wrap inputs — a11y focus must stay stable |
| Journey rail (portal) | `animate-in fade-in slide-in-*` on step panels inside cards | Show/hide without slide entrance |
| Card grids (any surface) | `ScrollReveal` wrapping `<article>` / `<Card>` children | Move reveal to section title above the grid |
| Empty states | Scroll reveal or hover lift on empty-state cards | Static presentation |
| FAQ / pricing cards | `interactive-lift` + scroll reveal on card bodies | Section-level motion only |

### Examples

**Good — marketing hero section:**

```tsx
<PublicPageEnter>
  <PageHero {...hero} />  {/* hero-word stagger inside */}
  <PageSection>
    <ScrollReveal>
      <h2 className="marketing-h2">How it works</h2>
      <p className="marketing-body">…</p>
    </ScrollReveal>
    <div className="grid …">
      {items.map(…)}  {/* cards: no ScrollReveal wrapper, no interactive-lift */}
    </div>
  </PageSection>
</PublicPageEnter>
```

**Bad — portal dashboard card:**

```tsx
{/* REMOVE */}
<ScrollReveal>
  <Card className="dashboard-card interactive-lift">…</Card>
</ScrollReveal>
```

**Bad — booking form field:**

```tsx
{/* NEVER */}
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <PortalFormField … />
</motion.div>
```

**Good — portal primary CTA:**

```tsx
<Button size="lg" className="transition-colors">Continue intake</Button>
```

---

## 1. Brand guide discovery

### 1.1 Search results (workspace)

| Location searched | Result |
|-------------------|--------|
| Repo root (`/home/ali/Desktop/projects/rebild`) | No brand-guide PDF or markdown |
| `frontend/docs/` | `theme-tokens.md`, `ux-standards.md`, Stitch merge docs — all describe **live** `#5fa8a6` tokens, not official guide |
| `**/*.pdf` | **0 files** |
| Grep for `#9FBCE1`, `#AEBFB2`, `#616362`, `#F6EFE7`, `Gabriola` | **No matches** in source/docs |

### 1.2 Official brand guide values (external — product-provided)

These values were supplied by stakeholders; **quote them as the brand target** until a guide file is added to the repo (recommended: `frontend/docs/brand-guide.md` or `frontend/public/brand/`).

| Token name (guide) | Hex | Intended use |
|--------------------|-----|--------------|
| **Soft Teal** | `#9FBCE1` | Primary brand accent, CTAs, highlights |
| **Sage Green** | `#AEBFB2` | Secondary / supporting surfaces, calm UI chrome |
| **Warm Gray** | `#616362` | Body text, labels, neutral UI |
| **Soft Beige** | `#F6EFE7` | Page backgrounds, warm canvas |
| **Gabriola** | (display serif) | Headings, elegant marketing/display type |
| Body font | *(confirm with brand owner)* | Long-form and UI body — guide reference not in repo |

### 1.3 What the repo actually documents today

| Source | Primary | Background | Heading font | Body font |
|--------|---------|------------|--------------|-----------|
| `frontend/docs/theme-tokens.md` | `#5FA8A6` | `#F4F7F6` | *(not specified)* | *(semantic `--foreground`)* |
| `stitch_…/serene_clinical_systems/DESIGN.md` | `#156968` (M3 primary) / `#5fa8a6` (primary-container) | `#faf8ff` | **Inter** | **Noto Sans** |
| `frontend/app/layout.tsx` (live) | — | — | **Inter** (`--font-heading`) | **Noto Sans** (`--font-sans`) |

**Conclusion:** Treat the external brand guide as authoritative for **customer-facing brand fidelity**. Treat Stitch docs as **implementation history**, not brand law.

---

## 2. Live design token audit

Source of truth: `frontend/app/globals.css` and `frontend/app/layout.tsx`.

### 2.1 Colour tokens — live vs brand guide

| Role | Live token | Live hex | Brand guide | Gap |
|------|------------|----------|-------------|-----|
| Primary / CTA | `--primary` | `#5fa8a6` | Soft Teal `#9FBCE1` | Hue + saturation: live is darker, greener teal |
| Primary text on CTA | `--primary-foreground` | `#1a1f1f` | *(guide TBD)* | Live recently uses dark text (WCAG-friendly); verify on Soft Teal |
| Page background | `--background` | `#f4f7f6` | Soft Beige `#F6EFE7` | Live is cool green-gray, not warm beige |
| Dashboard canvas | `--dashboard-bg` | `#f8fafc` | Soft Beige `#F6EFE7` | Cool slate tint vs warm beige |
| Body text | `--foreground` | `#1a1f1f` | Warm Gray `#616362` | Live is near-black, colder |
| Muted text | `--muted-foreground` | `#566665` | Warm Gray family | Close in role, different hex |
| Secondary | `--secondary` | `#9eaa9f` | Sage `#AEBFB2` | Similar intent; not exact match |
| Accent | `--accent` | `#8fa7a8` | — | No direct guide mapping |
| Sidebar chrome | `--sidebar-patient` | `#0a7378` | *(not in guide table)* | Dark teal — **orthogonal** to Soft Teal; needs explicit decision in Phase 1 |
| Sidebar CTA | `--sidebar-patient-cta` | `#5fa8a6` | Soft Teal or derived | Tied to primary track |
| Strong teal (icons/links) | `--primary-strong` | `#156968` | *(derive from Soft Teal)* | Dark companion for contrast on light surfaces |
| Focus ring | `--ring` | `#3e7c7a` | *(derive)* | Must be recalculated per primary track |
| Brand gradient | `--gradient-brand` | `#8fa7a8 → #9eaa9f` | Sage + Soft Teal | Rebuild from new tokens |
| Primary glow shadow | `--shadow-primary-glow` | `rgb(95 168 166 / 0.28)` | *(derive from primary)* | Hard-coded to old teal RGB |

Charts, success/warning/destructive: **unchanged in Phase 1** unless brand guide adds clinical status colours.

### 2.2 Typography — live vs brand guide

| Role | Live | Brand guide |
|------|------|-------------|
| `--font-heading` | **Inter** (`layout.tsx`) | **Gabriola** |
| `--font-sans` / body | **Noto Sans** | Body font from guide *(TBD — confirm)* |
| Portal H1 | `font-heading text-[2rem]` | Gabriola display |
| Marketing H1 | `.marketing-h1` → `font-heading` | Gabriola display |
| Monospace | Geist Mono | Unspecified |

**Gabriola loading:** use `next/font/local` if licensed WOFF files exist, or `next/font/google` only if Gabriola is available (verify licensing for commercial telehealth). Fallback stack: `Gabriola, "Times New Roman", serif` for headings only; keep a readable sans for body and form fields.

### 2.3 Radius, shadow, motion (stable — carry forward)

| Token | Live | Notes |
|-------|------|-------|
| `--radius` | `0.625rem` (10px) | shadcn base |
| `--radius-dashboard-card` | `1rem` (16px) | Dashboard/marketing cards |
| `--shadow-e1/e2/e3` | Stitch-tuned | Update glow RGB when primary changes |
| Motion | `--duration-*`, `--ease-out-quint` | Keep; respect `prefers-reduced-motion` |

---

## 3. Button pattern audit

### 3.1 Canonical component (standardize on this)

**File:** `frontend/components/ui/button.tsx`

| Property | Value |
|----------|-------|
| Base shape | `rounded-4xl` (pill) |
| Default variant | `bg-primary text-primary-foreground` |
| Variants | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` |
| Sizes | `default` (h-9), `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` |
| Focus | `focus-visible:ring-[3px] ring-ring/50` |
| Data attrs | `data-slot="button"`, `data-variant`, `data-size` |

**Rule:** All new and refactored UI uses `<Button>` + variants. No ad-hoc `<button className="bg-primary…">` for actions.

### 3.2 Documented overrides (inconsistencies today)

| Pattern | Location | Deviation from canonical |
|---------|----------|---------------------------|
| `AuthPrimaryButton` | `components/auth/auth-primary-button.tsx` | `h-12 w-full rounded-xl` — **square-ish**, not pill |
| `marketing-cta` utility | `globals.css` + marketing heroes | `min-height: 3rem`, `border-radius: 1rem` — **16px**, not pill |
| `BookingActions` Continue | `components/patient/booking/booking-actions.tsx` | `min-h-11 rounded-xl` on primary + outline |
| Join session CTA | `journey-current-step-card.tsx`, `join-session-gate.tsx` | `h-12 rounded-xl shadow-primary-glow` |
| Sidebar “Book Appointment” | `[data-patient-sidebar-cta]` in `globals.css` | Pill via CSS, not `Button` component |
| Journey rail inline CTA | `journey-rail.tsx` | `Button size="sm"` (h-8) vs hero `size="lg"` (h-10) |
| Raw `<button>` | `mood-checkin-card`, `quick-actions-card`, `journey-rail` timeline nodes, `compact-date-picker`, public nav | Custom classes; mood/quick actions use `rounded-xl p-3` row buttons |
| Driver.js tour footer | `globals.css` `.driver-popover…` | Hard-coded `var(--primary)` buttons with smaller radius |

### 3.3 Size matrix (current chaos)

| Context | Height | Radius |
|---------|--------|--------|
| Default Button | 36px (`h-9`) | pill (`rounded-4xl`) |
| Auth / booking primary | 44–48px (`min-h-11` / `h-12`) | `rounded-xl` (~14px) |
| Marketing primary | 48px (`marketing-cta`) | 16px |
| Join session hero | 48px `h-12` | `rounded-xl` |
| Sidebar CTA | ~40px (padding) | `9999px` pill |

### 3.4 Canonical standard (Phase 0 target)

Define **`Button` size tokens** — do not invent parallel CSS classes:

| Size | Height | Use |
|------|--------|-----|
| `sm` | 32px | Inline/table actions, journey chips |
| `default` | 36px | Standard forms, dialogs |
| `lg` | 44px | **Portal + auth primary CTAs** |
| `xl` *(new, optional)* | 48px | Marketing hero only |

| Variant | Use |
|---------|-----|
| `default` | One primary action per surface |
| `outline` | Secondary actions |
| `ghost` | Tertiary / toolbar |
| `secondary` | Supporting filled actions (sage-tinted after Phase 1) |
| `destructive` | Irreversible actions |
| `link` | Inline text actions |

**Radius policy:**

- **Portal + app chrome:** pill (`rounded-4xl`) via `Button` default — remove per-file `rounded-xl` overrides on `<Button>`.
- **Marketing:** allow `className="marketing-cta"` **only** as a size wrapper (`min-h-12 px-5 text-base font-semibold`), not a separate radius system — or add `size="xl"` and delete `.marketing-cta` radius.

**Icon buttons:** always `size="icon"` / `icon-sm` / `icon-lg`; never bare `h-9 w-9` divs.

---

## 4. New-user / first-time patient experience audit

### 4.1 Entry flow

```
Register (/register)
  → router.push("/patient/onboarding")     [register/page.tsx:61]

Login (/login)
  → default patient route OR ?redirect=     [login/page.tsx]

Onboarding (/patient/onboarding)
  → PatientOnboardingChecklist
  → Primary CTA: "Continue intake" | "Start booking" → /patient/book-appointment
  → Secondary: Refresh status, checklist cards → account / book / notifications

Dashboard (/patient/dashboard)
  → PatientDashboardView + usePatientPortalContext()
```

### 4.2 `usePatientPortalContext` (mode detection)

**File:** `frontend/src/patient/use-patient-portal-context.ts`

| Mode | When |
|------|------|
| `first-time` | Early journey (≤2 done steps), pending intake/booking steps, account setup incomplete, or recent account without upcoming session |
| `returning` | Past sessions, ≥5 journey steps done, or upcoming session past early steps |

Exports: `isFirstTime`, `currentStepKey`, `journeyProgress`, `hasUpcomingSession`.

Early step keys: `intake_started`, `intake_submitted`, `booking_requested`.

### 4.3 First-time dashboard composition (today)

**Order in `patient-dashboard-view.tsx`:**

1. `DashboardWelcomeSection` — greeting + small “Next appointment” card (text link “Book now”, not a Button)
2. `DashboardSummaryCards` — 4 tiles (Care progress, Messages, Documents, Billing)
3. `PatientTutorialOnboardingCta` — guided tour banner (first-time only)
4. `PatientTelehealth101Cta` — telehealth prep banner (first-time only)
5. `JourneyRail` — large “Your care journey” card + timeline + `JourneyCurrentStepCard` hero + “Coming next” + “Need help?” pills
6. Mood check-in + Quick actions grid
7. Resources + Billing snapshot

### 4.4 Intake & booking entry points

| Entry | Path | Notes |
|-------|------|-------|
| Onboarding hero | `/patient/book-appointment` | Clearest first-time CTA |
| Sidebar footer CTA | `/patient/book-appointment` | Always visible (desktop + mobile sheet) |
| Welcome “Book now” | text link | Low prominence |
| Journey rail / current step | `resolveJourneyCta()` → often `/patient/book-appointment` | Labels: “Continue intake”, “Book appointment” |
| Summary “Care progress” | `#care-journey` anchor | Scrolls to journey, not intake |
| Quick actions | Book shortcut in content | Present in grid |

**Booking wizard first step:** `BookingWizard` — new patients see title “Book your first appointment”, copy explains intake-first flow; stepper + `BookingStepContent` (intake steps before schedule for new patients).

### 4.5 UX friction (first-time)

| Issue | Detail |
|-------|--------|
| **No single hero CTA** | Welcome card uses underline link; primary Button lives inside journey stack |
| **Journey competes with next action** | Full-width rail + progress + motivation copy **above** the current-step hero; cognitive load before intake |
| **Duplicate onboarding surfaces** | `/patient/onboarding` vs dashboard tutorial banners vs journey copy |
| **Tutorial before task** | Tour CTA appears **before** journey; may delay intake/booking |
| **Summary cards distract** | “Messages / Documents / Billing” irrelevant before first booking |
| **CTA size inconsistency** | Journey inline `size="sm"` vs join `size="lg"` — hierarchy unclear |
| **Register vs dashboard** | New users land on onboarding, not dashboard — dashboard first visit may be second session |

### 4.6 Mobile navigation (current)

**File:** `components/ui/sidebar.tsx` + `patient-shell.tsx`

- Breakpoint: **1024px** (`MOBILE_BREAKPOINT_PX`)
- Below 1024px: sidebar → **Sheet** drawer; `SidebarTrigger` **visible** in header (`inline-flex`)
- Mobile header: logo link, search, notifications, help, profile avatar
- **Verify in Phase 2:** hamburger opens sheet with Book Appointment CTA + full nav on real devices

*(Note: older audit `refactor.md` claimed nav was hidden on mobile; that is **fixed** in current `patient-shell.tsx` — re-verify, do not regress.)*

---

## 5. Colour migration — two tracks

Implement **one** track per release; do not mix hex values across tracks.

### Track A — Official Soft Teal (recommended default)

Aligns with external brand guide. Calmer, warmer, more “premium clinic” than dev teal.

| Token | Old (live) | New (Track A) | Notes |
|-------|------------|---------------|-------|
| `--primary` | `#5fa8a6` | `#9FBCE1` | Soft Teal |
| `--primary-foreground` | `#1a1f1f` | `#1a1f1f` or `#2c2c2c` | Keep dark text on light teal for WCAG; **verify ≥4.5:1** |
| `--primary-strong` | `#156968` | `#5a7a9e` *(tune)* | Darker Soft Teal for links/icons on white |
| `--secondary` | `#9eaa9f` | `#AEBFB2` | Sage Green |
| `--background` | `#f4f7f6` | `#F6EFE7` | Soft Beige |
| `--dashboard-bg` | `#f8fafc` | `#F6EFE7` or `#faf6f1` | Unify warm canvas |
| `--foreground` | `#1a1f1f` | `#616362` | Warm Gray for body |
| `--muted-foreground` | `#566665` | `#616362` at ~80% opacity mix | Labels |
| `--accent` | `#8fa7a8` | `#AEBFB2` or mix(primary, sage) | Supporting highlight |
| `--ring` | `#3e7c7a` | *(derive from primary)* | Focus visible |
| `--sidebar-patient` | `#0a7378` | `#4a6b6e` or `#616362` | **Decision needed:** warm gray-green sidebar vs keeping dark teal anchor |
| `--sidebar-patient-cta` | `#5fa8a6` | `#9FBCE1` | Match primary |
| `--gradient-brand` | teal-sage | `#9FBCE1 → #AEBFB2` | Hero accents |
| `--shadow-primary-glow` | rgb(95 168 166) | rgb(159 188 225) | Match Soft Teal |
| Chart `--chart-1…5` | teal family | Re-seed from primary/sage | Dashboard charts only |

**Tradeoffs (Track A):**

- Pros: Brand fidelity, warmer patient trust, differentiates from generic “medical teal SaaS”
- Cons: Entire sidebar/chart/glow system must be retuned; Soft Teal is **light** — dark sidebar may still need a separate **non-guide** anchor colour; marketing screenshots and Stitch docs become stale

### Track B — Keep live `#5fa8a6`

Documented for teams that prioritize shipped Stitch parity + existing contrast work over guide palette.

| Token | Action |
|-------|--------|
| `--primary` | **Keep** `#5fa8a6` |
| `--primary-foreground` | **Keep** `#1a1f1f` (WCAG fix) |
| `--background` / `--dashboard-bg` | Optionally nudge toward beige **without** changing hue family: e.g. `#f6f3ef` |
| `--foreground` | Optionally nudge to `#616362` for warmer body text |
| `--secondary` | Map to `#AEBFB2` only if sage alignment desired |
| Gabriola | Still apply in typography phase |

**Tradeoffs (Track B):**

- Pros: Minimal regression risk; matches `STITCH_UI_MERGE_PLAN.md`, tests, and screenshots
- Cons: **Does not satisfy** “follow official brand guide” for primary colour; sales/marketing collateral mismatch

### Recommendation

**Default to Track A** for a brand-alignment initiative, with:

1. `--primary-foreground: #1a1f1f` until contrast proven on `#9FBCE1`
2. A deliberate sidebar decision (warm gray-green **or** keep `#0a7378` as “portal chrome exception” documented in `theme-tokens.md`)
3. Track B as a **flag day fallback** if Soft Teal fails WCAG on critical CTAs after QA

---

## 6. Phased implementation

### Phase 0 — Button system standardization

**Goal:** One visual language for all clickable actions before colours shift.

**Tasks:**

1. Add optional `size="xl"` to `button.tsx` if marketing needs 48px without `rounded-xl` overrides.
2. Refactor `AuthPrimaryButton` → `<Button size="lg" className="w-full">` (drop `rounded-xl`).
3. Refactor `BookingActions` → canonical `size="lg"` / `variant="outline"`, remove `rounded-xl` on Button.
4. Refactor `journey-current-step-card`, `join-session-gate` join CTAs → `size="lg"`, remove custom radius.
5. Replace raw action `<button>` in `quick-actions-card` / `mood-checkin-card` with `Button variant="ghost"` full-width rows.
6. Align Driver.js popover footer buttons to `Button` sizing tokens (or mirror pill radius in CSS).
7. Document in `ux-standards.md`: one primary per card/section; secondary = outline; tertiary = ghost/link.

**Acceptance criteria:**

- [ ] Grep for `rounded-xl` on `<Button` in `components/` → **0** (except documented marketing exception if any)
- [ ] Auth, booking, journey join, and onboarding primary CTAs all use `size="lg"` + pill radius
- [ ] No new raw `<button>` for navigation/submit actions in touched files
- [ ] Existing button/a11y tests pass (`button.test.tsx`, journey tests, booking tests)

**Files likely touched:**

- `components/ui/button.tsx`
- `components/auth/auth-primary-button.tsx`
- `components/patient/booking/booking-actions.tsx`
- `components/patient/journey/journey-current-step-card.tsx`
- `components/session/join-session-gate.tsx`
- `components/patient/dashboard/quick-actions-card.tsx`
- `components/patient/dashboard/mood-checkin-card.tsx`
- `app/globals.css` (Driver popover, `.marketing-cta` radius policy)
- `docs/ux-standards.md`

---

### Phase 1 — CSS token migration

**Goal:** Switch semantic tokens in `globals.css` (+ `@theme inline`) per chosen colour track; no component hex literals.

**Tasks:**

1. Update `:root` and `.dark` colour variables per Track A or B table (§5).
2. Recompute `--shadow-primary-glow`, `@keyframes join-pulse`, `.journey-current-pulse` RGB from new primary.
3. Update `frontend/docs/theme-tokens.md` with brand guide cross-reference.
4. Load **Gabriola** in `app/layout.tsx` → `--font-heading`; confirm body font with brand owner.
5. Grep `frontend/` for hard-coded `#5fa8a6`, `#0a7378`, `rgb(95 168 166` — replace with `var(--primary)` or remove.
6. Run contrast check on: primary button, badge, link, sidebar CTA, focus ring (target WCAG AA).

**Acceptance criteria:**

- [ ] Single source of truth in `globals.css`; no duplicate hex in touched components
- [ ] Light + dark modes both updated
- [ ] Primary button pair ≥ **4.5:1** contrast (or documented exception with mitigation)
- [ ] Gabriola renders on portal H1, marketing H1, `CardTitle`/`font-heading` surfaces
- [ ] Visual snapshot: patient dashboard, booking step 1, login, marketing home

**Files likely touched:**

- `app/globals.css`
- `app/layout.tsx`
- `docs/theme-tokens.md`
- Any component with inline hex (grep-driven)

---

### Phase 2 — New-user first dashboard

**Goal:** First-time patients see **one obvious next action** (intake **or** book), with journey de-emphasized.

**Design spec:**

```
┌─────────────────────────────────────────────────────────┐
│  H1: Good morning, {name}                               │
│  Subtitle: one line (first-time specific)               │
├─────────────────────────────────────────────────────────┤
│  FIRST-TIME HERO CARD (new)                             │
│  • If intake incomplete: "Complete your intake"         │
│    Primary Button lg → /patient/book-appointment        │
│    Progress: ~N% if draft exists                        │
│  • Elif no booking: "Book your first appointment"       │
│  • Elif upcoming session: reuse join-focused hero         │
│  • Single primary Button; outline secondary optional      │
├─────────────────────────────────────────────────────────┤
│  Summary cards (returning only OR collapsed for FT)       │
├─────────────────────────────────────────────────────────┤
│  Journey rail — COLLAPSED / compact for first-time      │
│  • Progress bar + current step label only                 │
│  • "View full journey" expands or links to #care-journey  │
│  • JourneyCurrentStepCard demoted below hero OR merged   │
├─────────────────────────────────────────────────────────┤
│  Mood + Quick actions (unchanged layout)                  │
└─────────────────────────────────────────────────────────┘
```

**Tasks:**

1. Add `FirstTimeDashboardHero` (or extend `DashboardWelcomeSection`) driven by `usePatientPortalContext()` + intake draft percent (reuse onboarding logic from `patient-onboarding-checklist.tsx`).
2. **Hide or collapse** `DashboardSummaryCards` when `portalContext.isFirstTime` (or show only Care progress tile).
3. Move `PatientTutorialOnboardingCcta` **below** hero CTA or into help menu — not above primary task.
4. Compact `JourneyRail` for `isFirstTime`: hide timeline tablist behind disclosure; keep `data-tutorial` hooks.
5. Ensure mobile: hero CTA full-width; sticky booking bar unchanged; sidebar Book CTA still visible.
6. Align copy with `resolveJourneyCta()` labels (“Continue intake” vs “Book appointment”).

**Acceptance criteria:**

- [ ] First-time user with no intake: **one** `Button variant="default" size="lg"` above the fold pointing to `/patient/book-appointment`
- [ ] First-time user with partial intake: hero shows percent + “Continue intake”
- [ ] Returning user dashboard unchanged in structure (no regression)
- [ ] `portalContext.isFirstTime` false after booking confirmed / journey advanced
- [ ] Mobile 375px: hamburger → nav + book; hero CTA visible without scroll
- [ ] Tutorial tour still startable but does not push primary CTA below fold
- [ ] Tests: `journey-rail.test.tsx`, dashboard tests updated for first-time layout

**Files likely touched:**

- `components/patient/dashboard/patient-dashboard-view.tsx`
- `components/patient/dashboard/dashboard-welcome-section.tsx` (or new hero component)
- `components/patient/journey/journey-rail.tsx`
- `components/tutorials/patient-tutorial-onboarding-cta.tsx`
- `src/patient/use-patient-portal-context.ts` *(read-only unless hero needs new flags)*

---

### Phase 3 — Shell & marketing pass

**Goal:** Public and portal chrome reflect new tokens and button system.

**Tasks:**

1. Public header/footer/mobile nav — token-only colours, Button sizes.
2. Marketing home: hero, CTA strip, trust sections — Gabriola headings, Soft Beige canvas (Track A).
3. Auth shell (`AuthShell`, login/register) — align with beige background + pill buttons.
4. Sidebar: recolour per Track A sidebar decision; CTA uses `--primary`.
5. Psychologist + ops shells — same token consumption (role prefixes already exist).

**Acceptance criteria:**

- [ ] No hard-coded teals in `components/layout/` or `components/marketing/`
- [ ] Public + auth pages visually match portal palette
- [ ] Marketing hero primary uses canonical Button (size xl/lg)
- [ ] Lighthouse/a11y: focus rings visible on nav controls

**Files likely touched:**

- `components/layout/public-header*.tsx`, `public-footer*.tsx`
- `components/marketing/*`
- `components/auth/*`
- `components/patient/patient-shell.tsx`, psychologist/ops shells
- `components/brand/clink-sidebar-brand.tsx`

---

### Phase 4 — Portal pages pass

**Goal:** Remaining patient/psychologist/ops pages pick up tokens; no page left on old hex.

**Tasks:**

1. Booking wizard steps — remove local colour overrides; booking stepper uses `--primary` for done/current states.
2. Appointments, invoices, account, recordings, data-requests — card borders/accents from tokens.
3. Status pills — use `.pill-*` utilities seeded from new semantic colours.
4. Video session room + chat widget — minimal token sync (dark room may keep separate scheme).

**Acceptance criteria:**

- [ ] Grep `#5fa8a6` / `#0a7378` in `frontend/components` → **0**
- [ ] Booking wizard E2E / unit tests pass
- [ ] Portal pages visually consistent with dashboard

**Files likely touched:**

- `components/patient/booking/**`
- `components/patient/appointments/**`
- `components/patient/account/**`
- `components/patient/billing/**`
- `components/psychologist/**`
- `components/ops/**`
- `components/session/**` (token sync only)

---

## 7. What NOT to break

| Area | Constraint |
|------|------------|
| **Booking wizard** | Do not change step order, validation rules, autosave, payment redirect, or `useBookingWizard` state machine |
| **`PortalFormField`** | Preserve `aria-invalid`, `aria-describedby`, `role="alert"` wiring and tests (`portal-form-field.test.tsx`) |
| **Journey logic** | Do not change `step-guide.ts` step keys, API shapes, or `resolveJourneyCta()` routing logic — UI only |
| **Tests** | Keep passing: journey, booking, portal form, sidebar, dashboard tests; update snapshots intentionally |
| **Routes** | No new routes; no removal of `/patient/onboarding` or `/patient/book-appointment` |
| **Realtime / join** | Join window, Twilio, socket handlers untouched |
| **Tutorial system** | Preserve `data-tutorial` IDs for driver.js tours |
| **Mobile nav** | Do not re-hide `SidebarTrigger`; sheet nav must remain reachable |
| **i18n hooks** | No copy changes beyond first-time hero strings unless product review |

---

## 8. Suggested execution order

```
Phase 0 (buttons) → Phase 1 (tokens + fonts) → Phase 2 (first-time dashboard)
       ↓
Phase 3 (shell/marketing) ∥ Phase 4 (portal pages) — can parallelize after Phase 1
```

**Estimated risk:** Phase 1 Track A highest (contrast + sidebar); Phase 0 lowest.

---

## 9. Verification checklist (pre-merge)

- [ ] `npm test` / `npm run test` in frontend green
- [ ] Manual: register → onboarding → book intake step 1 → dashboard first-time hero
- [ ] Manual: mobile 375px navigation + book CTA
- [ ] Contrast: primary button, links, badges (WebAIM or browser devtools)
- [ ] Dark mode smoke on patient dashboard + booking
- [ ] No secrets in commits; deploy per `deploy-push-and-commands.mdc`

---

## 10. Open decisions for product

1. **Colour track:** Track A (Soft Teal) vs Track B (keep `#5fa8a6`) — default **Track A** in this spec.
2. **Sidebar colour** under Track A: warm gray-green vs keep dark teal `#0a7378` as brand exception.
3. **Body font** from brand guide — confirm exact family and license.
4. **Gabriola license** — confirm web embedding rights.
5. **First-time dashboard:** hide all four summary cards vs show single “Care progress” tile.
6. **Commit brand guide PDF** to repo for future agents (`frontend/docs/brand-guide.md`).

---

## Appendix A — Key file index

| Concern | Path |
|---------|------|
| Tokens | `frontend/app/globals.css` |
| Fonts | `frontend/app/layout.tsx` |
| Button primitive | `frontend/components/ui/button.tsx` |
| Patient dashboard | `frontend/components/patient/dashboard/patient-dashboard-view.tsx` |
| Portal context | `frontend/src/patient/use-patient-portal-context.ts` |
| Journey UI | `frontend/components/patient/journey/journey-rail.tsx` |
| Onboarding | `frontend/components/patient/onboarding/patient-onboarding-checklist.tsx` |
| Booking | `frontend/components/patient/booking/booking-wizard.tsx` |
| Mobile nav | `frontend/components/ui/sidebar.tsx`, `patient-shell.tsx` |
| Form a11y | `frontend/components/shared/portal-form-field.tsx` |

## Appendix B — Live token quick reference (pre-refactor)

```css
/* :root excerpt — frontend/app/globals.css */
--primary: #5fa8a6;
--primary-foreground: #1a1f1f;
--background: #f4f7f6;
--foreground: #1a1f1f;
--secondary: #9eaa9f;
--dashboard-bg: #f8fafc;
--sidebar-patient: #0a7378;
--sidebar-patient-cta: #5fa8a6;
--primary-strong: #156968;
```

```tsx
// frontend/app/layout.tsx
// --font-heading: Inter
// --font-sans: Noto Sans
```
