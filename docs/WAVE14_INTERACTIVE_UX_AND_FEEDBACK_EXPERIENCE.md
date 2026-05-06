# Wave 14: Interactive UX, Feedback & Guided Experience (Patient + Psychologist)

**Audience:** Implementers and AI agents. This wave improves **perceived quality** and **task clarity** through progress, motion, empty/loading states, lifecycle messaging, and lightweight feedback—**without** redesigning page grids or adding gamification.

**Related docs:**

- `frontend/docs/routes-overview.md` — route inventory
- `frontend/docs/BOOKING_AND_PROFILE_PRODUCTION_READINESS.md` — booking/clinician data truth
- `frontend/docs/PSYCHOLOGIST_NEW_PATIENT_WORKFLOW_PLAN.md` — clinician prep workflow
- `frontend/components/patient/booking/booking-wizard.tsx` — primary patient guided flow

---

## 1. Goals

| Goal | Success looks like |
|------|-------------------|
| **Guided flows** | Users always know step, next step, and completion state. |
| **Trust & calm** | Motion is subtle; content hierarchy unchanged; health-appropriate tone. |
| **Predictability** | Loading/error/retry preserve context; no surprise navigation. |
| **Accessibility** | Focus order, live regions, large targets, `prefers-reduced-motion` respected. |
| **Implementability** | Prefer **existing** UI primitives (`Card`, `Button`, `DashboardStateBlock`) + Tailwind; extend components rather than replacing layouts. |

---

## 2. Non-goals (do not implement under Wave 14)

- Therapy gamification (streaks, points, badges for “compliance”).
- Ambient AI assistants or unconstrained chatbots in clinical flows.
- Full visual rebrand or breaking changes to information architecture.
- Replacing REST with GraphQL unless another wave mandates it.
- Heavy animation libraries **unless** a ticket explicitly adds one after bundle/size review.

---

## 3. Technical stack (what we use and how)

### 3.1 Already in the frontend

| Capability | Source | How we use it in Wave 14 |
|------------|--------|---------------------------|
| Styling / layout | Tailwind CSS v4 | Spacing, transitions (`transition-*`, `duration-*`), opacity for skeleton shimmer **within existing containers**. |
| Animation utilities | `tw-animate-css` (imported in `frontend/app/globals.css`) | Already used e.g. `animate-in fade-in-0`, `zoom-in-95`, `slide-in-from-bottom-*`, `duration-150` on dialogs (`components/ui/confirm-dialog.tsx`). Reuse the **same vocabulary** for step panels and modals—do not introduce a second animation system unless ticket-gated. |
| UI primitives | shadcn-style components under `components/ui/` | `Button`, `Card`, `Skeleton` (add if missing via shadcn pattern), dialogs for “need help”. |
| Icons | `@phosphor-icons/react` | Status icons for lifecycle steps; keep sizes consistent with surrounding text. |
| Real-time (optional later) | `socket.io-client` (already present) | **Defer** to a sub-ticket; only wire when backend events exist. Default to **polling** or **manual refresh** for v1 of this wave. |

### 3.2 Optional additions (ticket-gated)

| Addition | When | Why |
|----------|------|-----|
| **TanStack Query (React Query)** or **SWR** | If multiple surfaces need stale-while-revalidate | Reduces custom `useEffect` fetch boilerplate; enables background refetch for “live” dashboards without websockets. |
| **Framer Motion** | Only if CSS/`tw-animate` cannot express a specific step transition | Avoid dependency creep; prefer CSS-first. |

### 3.3 Animation rules (do not break layout)

1. **Contain motion** — Animate **opacity, transform on inner wrappers only**, or **max-height** with care (prefer opacity + translate-y **≤ 4px** for step changes). Do not animate full-page width/height in ways that reflow sibling cards.
2. **Duration** — 150–250 ms for UI feedback; 300 ms max for step transitions. No long bounces.
3. **Easing** — `ease-out` for entrances; avoid elastic/spring in clinical UI unless explicitly approved.
4. **`prefers-reduced-motion: reduce`** — Disable non-essential motion; keep opacity-only or instant transitions for essential state changes.
5. **One focal animation per viewport** — If the booking wizard step animates, avoid simultaneous flashy hero animations elsewhere on the same screen.

### 3.4 Accessibility mechanics

| Technique | Application |
|-----------|-------------|
| **Focus management** | On step change, move focus to step heading or first field via `tabIndex={-1}` + `ref.focus()` when appropriate (document in component comment). |
| **Live regions** | `role="status"` / `aria-live="polite"` for async updates (e.g. “Saved”, “Session confirmed”) so screen readers get feedback without toast-only reliance. |
| **Touch targets** | Minimum ~44×44 px for primary actions (already align with mobile-first patterns). |
| **Skeleton vs spinner** | Prefer **skeleton** for content-shaped loading; reserve spinners for short indeterminate actions (&lt; 2 s). |

---

## 4. Patient experience — work packages

### P4-P-01 — Guided flows: visible progress (booking & long flows)

**Primary surface:** `frontend/components/patient/booking/booking-wizard.tsx`

**What we add**

- A **persistent step indicator** (labels + current index) that updates when internal step state changes.
- **Short “What happens next”** line under the title or above primary CTA (one sentence; from `content/patient-booking.ts` or similar—keep copy centralized).
- **Subtle transition** when step content changes: cross-fade or slight translate (CSS + `prefers-reduced-motion`).

**How**

- Implement a thin `BookingStepHeader` or extend existing header: `aria-current="step"` on active step.
- Use Tailwind `transition-opacity duration-200` on a wrapper `key={stepId}` to avoid animating the entire wizard shell.
- **Completion:** After successful submit, show a **calm success panel** (check icon + next actions: “View appointments”)—no confetti; optional single subtle opacity pulse on success icon only.

**Files to touch (typical)**

- `frontend/components/patient/booking/booking-wizard.tsx`
- `frontend/content/patient-booking.ts` (copy only)

---

### P4-P-02 — Smart empty & loading states + “why we ask”

**Surfaces:** Booking wizard steps, intake/consent substeps, any `DashboardStateBlock` usage on patient routes.

**What we add**

- **Skeleton** placeholders that mirror **final layout** (card rows, list rows)—not grey rectangles only.
- One-line **`InlinePurposeHint`** (or reuse `text-muted-foreground` paragraph) for sensitive steps: e.g. “We ask this to match you with the right clinician and billing pathway.”
- **Retry** on error: keep wizard **step index** and **form state** in React state; retry button only refetches failed slice (availability, slots)—do not reset entire wizard unless required.

**How**

- Add `components/ui/skeleton.tsx` if absent (shadcn pattern).
- Wrap fetches: distinguish `loading` / `error` / `empty` for each async segment.

---

### P4-P-03 — Appointment lifecycle feedback

**Surfaces:** Patient appointments area—e.g. `frontend/components/patient/appointments/*`, `frontend/app/patient/appointments/*` (confirm exact paths during implementation).

**What we add**

- **Visual pipeline:** `requested → confirmed → reminder → join → completed` (map backend statuses to these buckets in one utility `mapAppointmentPhase()`).
- Per card: **badge + short label** (“Confirmed”, “Join from …”, “Completed”).
- **Optional post-session:** Non-blocking “How did it go?” **optional** mood chips (3–5 labels) or 1–5 scale—**submit to existing or new lightweight endpoint** only if product approves storage; otherwise UI stub behind feature flag.

**How**

- Single source of truth for labels in `content/` or `src/patient/appointments/status-copy.ts`.
- Do not imply clinical outcome; keep language neutral.

---

### P4-P-04 — In-session polish (join path)

**Surfaces:** Routes that host join/video—e.g. `frontend/app/video-session/*` or session join components (locate during ticket).

**What we add**

- **Primary “Join session”** when window is open; disabled + explanation when locked.
- **Countdown** to official start (client-side from `scheduledStartAt`; clarify timezone display).
- **Connection tips** collapsible: brief bullets (network, browser permission).
- **Need help?** single secondary link (support/email or internal help modal)—not multiple competing CTAs.

**How**

- Prefer `Card` + existing `Button` variants; avoid new navigation chrome.

---

### P4-P-05 — Care team / My clinician interactivity

**Surface:** `frontend/app/patient/my-clinician/page.tsx`, `frontend/src/patient/care-team/api.ts`

**What we add**

- **Last / next session** snippet per clinician card (from care-team API + patient sessions or aggregated fields—use **minimum API calls**; batch if needed).
- **Messaging expectations** static or CMS line: “Non-urgent messages are reviewed within business hours; urgent clinical matters use crisis lines.”
- **Card affordance:** `hover:` / `focus-visible:` ring or shadow **within same grid cell**; optional `Link` wrapping card with clear focus ring—no layout shift.

**How**

- Extend cards only with additional rows; do not change grid columns without design sign-off.

---

### P4-P-06 — Accessibility pass (patient)

- Audit patient booking + appointments + my-clinician for focus traps in modals, `aria-live` on status updates, and reduced-motion behaviour.

---

## 5. Psychologist experience — work packages

### P4-S-01 — Actionable dashboard

**Surfaces:** `frontend/app/psychologist/dashboard/page.tsx`, `frontend/components/psychologist/dashboard/*`

**What we add**

- **Pre-session workspace:** client-side **filter** (readiness / has prep actions) and **sort** (already partially in `pre-session-workspace-card.tsx`)—expose controls consistently.
- **Deep links:** Each row: **Open patient** (`/psychologist/patients/:id`), **Open session / readiness** (existing video-session link pattern).
- **Badge counts** refresh on focus/visibility or explicit refresh (see P4-S-03).

**How**

- Filter/sort state in React state or URL search params (optional)—avoid breaking shareable URLs if PM cares.

---

### P4-S-02 — Pre-session workspace as checklist (interactive)

**Surfaces:** `frontend/components/psychologist/pre-session-checklist-card.tsx`, `frontend/components/psychologist/dashboard/pre-session-workspace-card.tsx`, patient profile checklist.

**What we add**

- **Local-only checkboxes** for suggested actions (persist in `sessionStorage` keyed by `psychologistId + patientId + appointmentId` or similar)—**no clinical persistence implied** unless backend later stores it.
- **Dismiss** row for “done” items (still local).
- **Fewer hops:** each action line links to the right route (intake summary section, referral list, video-session readiness).

**How**

- Use `@radix-ui/react-checkbox` if already via shadcn; else native checkbox with large hit area.

---

### P4-S-03 — Notes workflow feedback

**Surface:** `frontend/app/psychologist/notes/page.tsx`

**What we add**

- **Autosave indicator:** “Saving…” / “Saved” debounced when editor changes (if PATCH exists—otherwise show “Draft” only).
- **Draft vs signed** visual distinction (badge, readonly editor when signed).
- **Inline hints** for clinical minimum dataset **before** submit/sign—not only on error (short bullets under fields or collapsible “Requirements”).

**How**

- Debounce 800–1200 ms; cancel on unmount.

---

### P4-S-04 — Schedule / today: refresh + “next up”

**Surface:** `frontend/app/psychologist/schedule/page.tsx`

**What we add**

- **Refresh** button + **last updated** timestamp.
- Highlight **next upcoming** session row (`border-primary` or subtle background)—first session after now.

**How**

- No pull-to-refresh on desktop unless trivial; button is sufficient.

---

### P4-S-05 — Patient profile timeline & filters

**Surface:** `frontend/app/psychologist/patients/[patientId]/page.tsx`

**What we add**

- **Tabs or toggle:** Upcoming / Past for session list (sessions already filtered server-side by clinician—ensure UI reflects that).
- Optional compact **timeline** visual (vertical line + dots) **inside existing column**—do not widen grid.

---

### P4-S-06 — Light real-time (defer / optional)

- **Default:** polling interval (e.g. 60–120 s) on dashboard when tab visible (`document.visibilityState`), or manual refresh only.
- **Later:** Socket events for waiting room—coordinate with backend wave; feature-flag.

---

## 6. Shared / platform work packages

### P4-X-01 — Notifications UX (preferences surface)

- Ensure patient **notification preferences** (if API exists) are visible under account/settings with clear toggles for email/SMS.
- Copy only; wiring follows backend contract.

### P4-X-02 — Consistent feedback (toasts)

- Introduce a thin toast utility **once** (e.g. shadcn `Toaster` + `sonner` or radix toast—**align with existing patterns** if any under `components/`).
- Use for: save profile, submit booking, copy export link—**short** messages.

### P4-X-03 — Optimistic UI (narrow)

- Apply only to **idempotent** toggles and safe updates (e.g. dismiss local checklist, UI preference). **Do not** optimistic-book appointments without rollback strategy.

### P4-X-04 — Data fetching layer (optional)

- Evaluate adding **TanStack Query** in a **single** feature slice first (e.g. psychologist dashboard cards) before repo-wide migration.

---

## 7. Implementation order (recommended)

| Phase | Tickets | Rationale |
|-------|---------|-----------|
| **14a** | P4-P-02, P4-X-02 | Skeletons + toasts improve everything downstream with low layout risk. |
| **14b** | P4-P-01, P4-P-05 | Booking progress + my clinician—highest patient visibility. |
| **14c** | P4-S-01, P4-S-02, P4-S-04 | Psychologist task efficiency. |
| **14d** | P4-P-03, P4-P-04 | Lifecycle + join polish depends on route audit. |
| **14e** | P4-S-03, P4-S-05 | Notes + profile timeline. |
| **14f** | P4-P-06, P4-X-01, P4-X-03 | A11y hardening + prefs + optimistic toggles. |
| **14g** | P4-S-06, P4-X-04 | Real-time & React Query only if needed. |

---

## 8. Verification checklist (per PR)

- [ ] No new horizontal overflow on 375 px width for touched pages.
- [ ] `prefers-reduced-motion` tested (DevTools or OS setting).
- [ ] Keyboard: tab order logical; focus visible on cards-as-links.
- [ ] Loading: skeleton approximates final layout.
- [ ] No gamification language introduced.

---

## 9. Key files index (starting points — verify during implementation)

| Area | Path |
|------|------|
| Booking wizard | `frontend/components/patient/booking/booking-wizard.tsx` |
| Psychologist shell / nav | `frontend/components/psychologist/psychologist-shell.tsx` |
| Dashboard | `frontend/app/psychologist/dashboard/page.tsx` |
| Pre-session card | `frontend/components/psychologist/dashboard/pre-session-workspace-card.tsx` |
| Patients list | `frontend/app/psychologist/patients/page.tsx` |
| Patient detail | `frontend/app/psychologist/patients/[patientId]/page.tsx` |
| My clinician | `frontend/app/patient/my-clinician/page.tsx` |
| Care team API | `frontend/src/patient/care-team/api.ts` |

---

## 10. Agent execution notes

1. **Read this wave doc first**, then open the **key files** listed in §9 before editing.
2. **Prefer additive PRs** per phase (14a, 14b, …) to keep review small.
3. When adding animation, **document the CSS classes** in the PR description for designers to tweak tokens later.
4. If a ticket requires backend changes (post-session mood, notification prefs), **split** into backend wave ticket with API contract update in `backend/docs/API_CONTRACT_MATRIX.md`.

---

**End of Wave 14 specification.**
