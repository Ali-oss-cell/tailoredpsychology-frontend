# Wave 16: Product Tutorial, Guided Flows & Familiarity Layer

**Audience:** Product, designers, implementers, and AI agents. Clink spans **public marketing**, **multi-role authenticated portals** (patient, psychologist, practice manager, admin), **booking**, **telehealth**, **notifications**, **chat**, **billing**, **ops queues**, and **settings**. New and returning users need a **coherent “first week” mental model**—not a one-off tooltip dump. This wave defines a **tutorial and guidance system**: welcome moments, **step-aware tours**, **contextual hints**, and **safe escape hatches**, so users understand **where they are**, **what the tabs/shells mean**, and **what to do next**.

**Primary promise**

> Meet the user, **welcome** them by role and intent, **walk** them through the surfaces they actually use, and **reinforce** with light in-context hints—without trapping, nagging, or blocking critical clinical workflows.

---

## Related docs

| Doc | Relevance |
|-----|-----------|
| `WAVE17_PATIENT_PORTAL_READINESS_DOWNLOADS_AND_JOIN.md` | Patient **join**, **mic/camera readiness**, **downloads** (invoices/exports)—feeds `patient.telehealth_101` and must **not** block join with tour chrome. |
| `WAVE14_INTERACTIVE_UX_AND_FEEDBACK_EXPERIENCE.md` | Motion, reduced-motion, toast/feedback patterns—tours must **respect** these rules. |
| `WAVE15_PUBLIC_NAV_AND_MARKETING_PAGES.md` | Public header/nav; optional **pre-auth** “Clink 101” links or landing sections. |
| `WAVE12_PSYCHOLOGIST_DASHBOARD_NOTES_PROFILE_PLAN.md` | Psychologist mental model, pre-session workspace. |
| `WAVE_PAGE_BUILD_PLAYBOOK.md` | Section primitives for any standalone **Help / Get started** pages. |
| `frontend/docs/ux-standards.md` | Hierarchy, spacing—tutorial UI must match shell chrome. |

---

## 1. Goals

| Goal | Success looks like |
|------|---------------------|
| **Welcome, don’t overwhelm** | First session after login (or first visit to a major area) shows a **short, skippable** welcome that explains **portal name + 3 pillars** (e.g. “Appointments, care, account”) in **under 45 seconds** of reading. |
| **Flow with the user** | Tutorials are **linear journeys** tied to **real tasks** (“Book first appointment”, “Join a telehealth session”, “Review intake queue”)—not abstract feature lists. |
| **Tabs & system clarity** | User can answer: **What is this sidebar?** **What does each top area do?** **Where do notifications go?** **What is chat vs video?**—via **highlight + one sentence** per stop. |
| **Familiarity over time** | **Progressive disclosure**: day-1 essentials; day-3+ **optional** deep dives (“Power tips for psychologists”). **Dismiss** persists; **“Remind me later”** snoozes. |
| **Accessibility** | Keyboard through tour steps; **screen reader** announcements for step changes; **`prefers-reduced-motion`** → no spotlight sweep animations; focus **trapped only** when modal welcome is intentional and Esc closes. |
| **Non-clinical risk** | Tutorials **never** block **join session**, **emergency exits**, or **logout**. No overlay during **active video** unless explicitly a **post-session** tip. |
| **Measurable** | Optional analytics events: `tutorial_started`, `tutorial_step_completed`, `tutorial_skipped`, `tutorial_completed` (privacy-sensitive; aggregate only). |

---

## 2. Non-goals (v1 / Wave 16 spec)

- Replacing **human onboarding** (clinic-specific policies, consent, crisis lines)—digital tours are **complementary**.  
- Building a **full LMS** or video course platform inside Clink.  
- **Mandatory** tutorials for every screen on every login—default is **first-time + snooze**, not perpetual lockout.  
- **Authoring CMS** for non-engineers in v1 (copy can live in `content/tutorials/*.ts` until a CMS is justified).  
- **Localization / i18n** of every string in v1 unless i18n infra already exists—design hooks (`tutorialId`, `locale`) anyway.  
- Tutorials that **auto-click** or **submit forms** on behalf of the user—**highlight + explain only**; user performs actions.  

---

## 3. Personas & tutorial streams

Each stream is a **playlist** of steps. Users may belong to **one primary role**; some users switch context (rare); tours are **role-scoped**.

### 3.1 Patient (`patient`)

| Stream ID | When to offer | Objective |
|-----------|----------------|------------|
| `patient.welcome` | First login after registration **or** first dashboard visit with `tutorial_patient_welcome` unset | Greet by name; map **sidebar**: Dashboard, Appointments, My clinician, Billing, Resources, Privacy, Account; point to **notifications** and **profile**; mention **chat** appears when a session window exists. |
| `patient.first_booking` | After welcome, if **no upcoming appointment** (or explicit CTA from empty state) | Walk to **Book appointment** (or booking route); explain **triage / confirmation** at a high level; where to see **status**. |
| `patient.telehealth_101` | First time opening **video session** or **first appointment within 24h** | Readiness checks, **chat vs video**, **join** timing, **notifications** for “session soon”. |
| `patient.account_security` | First visit to **Account** (optional) | Password, notification prefs, **data requests** pointer. |

### 3.2 Psychologist (`psychologist`)

| Stream ID | When | Objective |
|-----------|------|-------------|
| `psych.welcome` | First dashboard | Sidebar: Dashboard, Schedule, Patients, Notes, Recordings, Profile; **notifications**; **pre-session workspace** card purpose. |
| `psych.session_day` | First **video-session** or first **join** from schedule | Same patient telehealth story from clinician side: **readiness escalation**, **chat**, **notes** timing (policy-safe wording). |
| `psych.notes_queue` | First visit to **Notes** with empty queue explanation | How queue relates to **sessions** and **patients**. |

### 3.3 Practice manager & admin (`practice_manager`, `admin`)

| Stream ID | When | Objective |
|-----------|------|-------------|
| `ops.welcome` | First ops dashboard | **Ops vs clinical** boundary; **sidebar sections** (varies admin vs manager); **search placeholder** honesty (“coming soon” if still true); **compliance mode** stub if visible. |
| `ops.intake_referrals` | First visit to **Referrals** or **Intake** card | Queue mental model—**not** clinical advice. |

### 3.4 Guest / pre-auth (optional, smaller)

| Stream | Where | Objective |
|--------|-------|-------------|
| `public.clink_101` | Optional entry from **Resources** or footer **“How Clink works”** | Explain **patient journey** in plain language: get matched → book → session → billing; **no** PII. |

---

## 4. Experience architecture

### 4.1 Layers (compose, don’t conflate)

| Layer | Purpose | Example |
|-------|---------|---------|
| **A. Welcome modal / sheet** | One-time **emotional + structural** orientation; **big picture**. | “Welcome to your patient portal, {name}” + 3 bullets + **Start tour** / **Skip**. |
| **B. Spotlight / coachmark tour** | **Sequential** highlights on real UI (`data-tutorial-anchor` targets); **Next / Back / Exit**. | Step 3 of 8: ring around **Appointments** in sidebar. |
| **C. Contextual hints (“nudges”)** | **Single** non-blocking hint tied to **state** (empty list, first error, new feature flag). | “You can mark notifications read here” near bell **once**. |
| **D. Checklist (optional)** | **Parallel** track: onboarding checklist already exists for patients—**integrate** rather than duplicate (link checklist items to **deep links** that open the right tour step). |
| **E. Help surface** | Persistent **`/help` or in-shell “?”** opens **indexed** help: same copy as tours + FAQs. | Search “notifications” → short article + **Replay tour**. |

**Rule:** If **B** is active, suppress **C** on the same element to avoid stacking.

### 4.2 Flow with the user (narrative beats)

1. **Arrive** — User lands post-login on default route (`/patient/dashboard`, etc.).  
2. **Acknowledge** — Welcome: “You’re in the right place.”  
3. **Orient** — “This column is navigation; this header is global actions.”  
4. **Act** — “Try opening Appointments” (user clicks; tour advances on **navigation**, not synthetic click).  
5. **Reinforce** — After first booking, a **hint** on Appointments row: “Statuses update here; we’ll notify you.”  
6. **Exit** — “You can replay this anytime from **Account → Help**” (or header `?`).

### 4.3 “Tabs and system” copy themes (consistent vocabulary)

Document canonical terms for tours (use everywhere):

| Term | User-facing meaning |
|------|---------------------|
| **Portal** | The logged-in area for your role (Patient portal, Operations portal, etc.). |
| **Sidebar** | Primary navigation; collapses to icons on narrow layouts. |
| **Header** | Search (if enabled), **notifications**, **profile**. |
| **Main content** | The page you chose from the sidebar. |
| **Chat** | Pre-session / contextual messaging when your care team enables it—not SMS. |
| **Video session** | The telehealth room for your scheduled appointment. |
| **Notifications** | In-app bell; optional email/SMS per preferences (if product supports). |

---

## 5. Library landscape (implementation phase—decision record)

Pick **one** primary engine for **spotlight tours (layer B)**. Hints (C) can be **custom** (Popover + local state) without a heavy library.

| Library | Strengths | Risks / notes |
|---------|-----------|----------------|
| [**React Joyride**](https://docs.reactjoyride.com/) | Mature React API, **controlled steps**, **scroll-to-element**, accessibility options, widely used. | Bundle size; styling fight with shadcn—**theme overrides** required. |
| [**Shepherd.js**](https://shepherdjs.dev/) | Excellent **accessibility** story, flexible **modal vs modal-less** steps, framework-agnostic. | React wrapper thin; imperative API. |
| [**Driver.js**](https://driverjs.com/) | **Lightweight**, simple spotlight, no React dependency. | Less React-idiomatic; a11y depends on usage. |
| **Floating UI + custom** | Full control, smallest bundle; you own **focus trap** and **ARIA live regions**. | More engineering; higher bug risk. |

**Recommendation (for implementers, not binding):** **`react-joyride`** or **`shepherd.js`** if we want **strong defaults for a11y** and **step callbacks** (`onStepChange` → analytics). **Driver.js** if we want **minimal deps** and tours are **simple**. Prototype **one** patient `patient.welcome` stream in a spike before locking.

**Dependencies to avoid mixing:** Do not run **two** tour engines on the same page.

---

## 6. Technical design (implementation-ready outline)

### 6.1 Data model (client-first; optional server later)

| Field | Storage (v1) | Purpose |
|-------|----------------|---------|
| `tutorialVersion` | `localStorage` key e.g. `clink_tutorial_v1` | Invalidate old tours when copy/steps change. |
| `completedStreams` | `localStorage` JSON set of stream IDs | Skip completed streams. |
| `snoozedUntil` | ISO per stream or global | “Remind me in 3 days”. |
| `lastStepIndex` | Optional per stream | Resume mid-tour if user refreshed (nice-to-have). |

**Future:** persist per user in API (`user_preferences.tutorials`) for cross-device—document migration path only.

### 6.2 Anchors & selectors

- Prefer **`data-tutorial="sidebar.appointments"`** attributes on **stable** shell components (`PatientShell`, `PsychologistShell`, `OpsShell`, headers).  
- Avoid **CSS class** selectors—they churn.  
- **Dynamic lists:** anchor the **container**, not row N—copy says “your appointments appear here”.  

### 6.3 Integration points (code map starters)

| Area | File / pattern |
|------|----------------|
| Patient shell | `frontend/components/patient/patient-shell.tsx` — header, sidebar, footer anchors. |
| Psychologist shell | `frontend/components/psychologist/psychologist-shell.tsx` |
| Ops shell | `frontend/components/ops/ops-shell.tsx` |
| Notification bell | `frontend/components/notifications/notification-bell.tsx` — hint stream `patient.notifications_intro` |
| Video session | `frontend/app/video-session/[appointmentId]/page.tsx` + workspace — `patient.telehealth_101` |
| Existing onboarding | `frontend/components/patient/onboarding/patient-onboarding-checklist.tsx` — **link** checklist rows to tour streams or deep links. |

### 6.4 Orchestration

- **`TutorialProvider`** (client context): exposes `startStream(id)`, `dismissStream`, `snooze`, `isCompleted`.  
- **`TutorialGate`** on role layouts: after hydration, reads storage and decides **welcome vs tour vs nothing**.  
- **Route-aware:** some steps only valid on `/patient/appointments`—use `usePathname` to **advance** or **prompt navigation** (“Click Appointments next”).  

### 6.5 Accessibility checklist (must pass before ship)

- Focus order: spotlight **does not** remove focusable elements from tab order incorrectly.  
- **Esc** closes welcome modal; **does not** logout user.  
- **`aria-live="polite"`** on step title change.  
- **Reduced motion:** disable spotlight **pulse**; keep **border + scroll into view** only.  
- **Contrast:** tooltip panel uses **card** tokens, not low-contrast yellow sticky notes.  

### 6.6 Security & privacy

- Tours must **not** echo **PHI** in tooltips (use generic “your clinician” not names loaded from API in tutorial copy).  
- **Deep links** in tours only to **in-app** routes already validated (same spirit as `parseSafeAppLocation` for notifications).  

---

## 7. Content pack (copy structure—expand per stream in implementation)

For each **stream**, maintain in `frontend/content/tutorials/` (suggested):

```text
streams/
  patient.welcome.ts      # steps: welcome copy + anchors
  patient.first_booking.ts
  patient.telehealth_101.ts
  psych.welcome.ts
  ops.welcome.ts
shared/
  vocabulary.ts           # shared sentences
  analyticsEvents.ts      # event name constants
```

Each **step** object (conceptual):

- `id` — stable string `patient.welcome.step.sidebar-intro`  
- `target` — `[data-tutorial="..."]` selector  
- `title`, `body` — short; **body** max ~2 sentences  
- `placement` — `auto`, `bottom`, `right`  
- `disableBeacon` — optional  
- `waitForRoute` — optional pathname pattern  

---

## 8. Phased delivery (tickets)

| Phase | Scope | Outcome |
|-------|--------|---------|
| **16.0 Spike** | One library PoC + **one** stream (`patient.welcome` 4 steps) on staging | Go / no-go on library + a11y sign-off. |
| **16.1 Foundation** | `TutorialProvider`, storage util, `data-tutorial` anchors on **patient shell only**, welcome modal | Patients see welcome + skippable tour. |
| **16.2 Patient depth** | `first_booking`, `telehealth_101`, notification hint | Booking + session paths covered. |
| **16.3 Clinician** | `psych.welcome` + session-day tour | Parity for psychologist shell. |
| **16.4 Ops** | `ops.welcome` + intake/referrals pointer | Admin/manager clarity. |
| **16.5 Help hub** | `/help` or modal index + “Replay tour” | Escape hatch + discoverability. |
| **16.6 Polish** | Analytics, snooze, version bumps, translations hook | Hardening. |

---

## 9. UX copy principles (for writers)

1. **Second person, calm, short.** (“You’ll find upcoming visits here.”)  
2. **One idea per step.** If you need two ideas, split steps.  
3. **Name the benefit**, not only the widget. (“Billing keeps invoices in one place.”)  
4. **Acknowledge uncertainty.** (“If you don’t see chat yet, that’s normal until your session window opens.”)  
5. **Never blame.** Avoid “You should have…”.  

---

## 10. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Tutorial fatigue | **Snooze**, **never show again** per stream, low default frequency. |
| Breaks on UI refactor | **data-tutorial** anchors + CI check (grep anchors referenced in content). |
| Overlays break E2E tests | Prefer **`PLAYWRIGHT_SKIP_TUTORIALS=1`** in Playwright config or CI so flows never depend on tutorial UI; alternatively leave **`NEXT_PUBLIC_TUTORIALS`** unset so tours do not mount. When tutorials are enabled in E2E, the welcome layer exposes **`data-testid="tutorial-welcome-overlay"`** (backdrop click triggers snooze; **Don’t show again** marks the stream completed). Driver.js adds its own overlay when a tour runs—dismiss via the tour close control or avoid starting the tour in tests. |
| React 19 / tour library choice | **`react-joyride`** peer range does not include React 19; patient MVP uses **Driver.js** for the spotlight tour while keeping the same content and `data-tutorial` anchor contract. |
| Clinical distraction during session | **Disable** auto-start tours on `/video-session/*` except **pre-join** micro-hint gated on “first time”. |
| Token / layout shift | Lazy-load tour library **after** welcome choice (“Start tour” click). |
| **Multiple overlays / stacked modals** | **One engine at a time:** never schedule the welcome modal while `activeTourStreamId` is set; cancel the welcome delay timer when the tour starts; render welcome with `open && !activeTourStreamId`; destroy any previous Driver instance before creating a new one. **Session:** after the user starts the spotlight once, suppress **auto** welcome for that tab until replay clears the flag (CTA / `?` still start the tour). |

---

## 11. Open questions (resolve before 16.0 spike)

1. **Single global “Help”** vs **per-portal help** routes?  
2. Should **practice managers** see **any** patient-tutorial snippets (e.g. for support calls)? Probably **no**—keep ops copy separate.  
3. Do we need **admin impersonation** mode to **suppress** tutorials? (Likely yes—`impersonation` flag.)  
4. **Mobile**: sidebar collapsed by default—welcome should **show simplified diagram** or **first expand sidebar** step?  

---

## 12. Definition of Done (Wave 16 product tutorial initiative)

- [ ] **Spec approved** — this doc + UX review of first-stream copy.  
- [ ] **Patient welcome + 1 tour** shippable behind feature flag (`NEXT_PUBLIC_TUTORIALS=1` or similar).  
- [ ] **Skip / replay / snooze** work; state survives refresh.  
- [ ] **a11y** spot-check (VoiceOver or NVDA) on welcome + 3 steps.  
- [ ] **Docs** — this file linked from `AGENTS.md` or internal wiki if applicable; implementers add **anchor map** appendix when code exists.  

---

## Appendix A — Example welcome script (patient, draft)

**Modal title:** Welcome to your patient portal  

**Body:**  
You’re set up to manage care in one place—appointments, messages when your session window is open, and account settings. This short tour shows where everything lives. You can skip anytime.

**Primary:** Start 2-minute tour  
**Secondary:** Maybe later (snooze 3 days)  
**Tertiary:** Don’t show again  

*(Implementation will replace with final tone from product.)*

---

## Appendix B — Anchor inventory (starter list)

| `data-tutorial` | Element |
|------------------|---------|
| `shell.sidebar` | Sidebar root |
| `shell.sidebar.dashboard` | Dashboard nav item |
| `shell.sidebar.appointments` | Appointments nav item |
| `shell.header` | Sticky header row |
| `shell.header.notifications` | Notification bell wrapper |
| `shell.header.profile` | Profile / account menu |
| `shell.main` | Main content outlet |
| `patient.quick-actions` | Dashboard quick actions card (if present) |
| `shell.sidebar.my-clinician` … `shell.sidebar.account` | Other patient sidebar tabs (see `patient-shell.tsx`) |
| `shell.sidebar.book-appointment` | Footer “Book New Appointment” |
| `shell.header.search` | Header search (md+) |
| `shell.header.tour-help` | `?` replay / dismiss control |
| `patient.page.*` | Per-route wrappers (dashboard, onboarding, appointments, …) |

Add analogous anchors for psychologist and ops shells in implementation.

---

## Appendix C — Patient tour layering (engineering)

**Goal:** exactly **one** primary overlay at a time: either the **welcome modal** (Layer A) **or** the **Driver.js** spotlight (Layer B), never both.

| Gap / symptom | Why it happened | Hardening |
|---------------|-----------------|----------|
| Welcome opens on top of an active Driver step | Welcome `useEffect` depended only on `pathname`, so a timer fired **after** the user started the tour and `pathname` did not change → `setWelcomeOpen(true)` ran anyway. | Add **`activeTourStreamId`** to the effect deps; **return early** (no timer) when a tour is active; **`open={welcome && !activeTour}`**; **`sessionStorage`** suppress auto-welcome for the tab after first `startTour` (cleared on **Replay**). |
| Two Driver popovers / mismatched “step X of Y” (e.g. “6 of 9” + “4 of 8” after changing tabs) | (1) **Remount** / Strict Mode starting a second instance before teardown. (2) **driver.js `setSteps`**: it resets internal state with `X()` but **does not remove** the existing popover node; the next `moveTo` → `Q()` only removes `l("popover")`, which is now empty, so it **appends a second** `.driver-popover` while the first remains. | **Singleton destroy** before `driver()`; after **`setSteps`** in pathname resync, **`removeLeakedDriverJsDom()`** strips stray `.driver-popover` nodes before **`moveTo`**. |
| Tour restarts or flicker when only the URL changed | **`useLayoutEffect`** listed **`useRouter()`** in its dependency array; in App Router the router object identity can change often, tearing down and restarting the whole Driver session. | Hold **`routerRef.current.push`** and keep the mount effect deps to **`[streamId, onClose]`** only. |
| Hydration mismatch on onboarding CTA | `shouldOfferStream` reads `localStorage` on the server as “empty” vs client as “completed”. | **Defer** CTA / `?` until **`useEffect` client mount** before reading storage. |
| Popover misaligned after `router.push` | Layout not finished when `moveNext` / `setSteps` ran. | **Debounce** pathname resync; **`scrollIntoView`** + double **`requestAnimationFrame`** `refresh()`. |

**Patient tab coverage:** the `patient.welcome` stream should walk **every** main sidebar destination the shell exposes (dashboard → appointments → clinician → billing → resources → privacy → account → book wizard) plus header affordances, with **`waitForRoute`** + **`pushPathOnNext`** so copy matches the page under `shell.main`.

---

**End of Wave 16 spec.** Implementation tickets should reference stream IDs (`patient.welcome`, …) and this file for **goals, non-goals, and a11y rules**. Update **tutorial version** when steps or anchors change materially.
