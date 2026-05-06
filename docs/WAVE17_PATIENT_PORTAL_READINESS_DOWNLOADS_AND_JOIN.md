# Wave 17: Patient Portal — Readiness, Downloads & Join (Complete Slice)

**Audience:** Product, design, frontend, and AI agents implementing the **patient** experience after shell/onboarding/tours (Wave 16) are in place.

**Primary promise**

> Patients can **prepare for care** without guesswork: they know **how to download** what they are entitled to, **how to test** camera and microphone **before** stress time, and **how to join** a telehealth session from obvious entry points—without duplicating clinical policy in the UI.

---

## Related docs

| Doc | Relevance |
|-----|-----------|
| `WAVE16_PRODUCT_TUTORIAL_AND_GUIDED_ONBOARDING.md` | Optional `patient.telehealth_101` stream; avoid stacking with join UI. |
| `WAVE7_REQUIREMENTS_CHECKLIST.md` | §D Telehealth (BR-301…305): join gates, device preflight, chat window—align acceptance criteria. |
| `WAVE14_INTERACTIVE_UX_AND_FEEDBACK_EXPERIENCE.md` | Permission prompts, errors, reduced motion around media checks. |
| `WAVE_PAGE_BUILD_PLAYBOOK.md` | Layout for a small standalone **“Test setup”** help page if needed. |
| `frontend/docs/routes-overview.md` | Canonical routes (`/video-session/...`, `/patient/invoices`, `/patient/book-appointment`). |

---

## 1. Goals

| ID | Goal | Success looks like |
|----|------|---------------------|
| G1 | **Discoverable join** | From **dashboard** and **appointments**, the next actionable visit has a **single obvious** “Join” (or “Open session”) path to the **same** workspace the product considers canonical (`/video-session/:appointmentId`). |
| G2 | **Device readiness without an appointment (optional but recommended)** | A patient can open **“Test camera & microphone”** (or equivalent) from **Account**, **Help**, or **Dashboard** without entering a live session—reusing the **same** checks and copy as the pre-session card where possible. |
| G3 | **Honest downloads** | Every **Download** control states the **real** artifact type (PDF, CSV, text export, tokenized link)—no button that says “PDF” when the file is not PDF. |
| G4 | **Billing clarity** | Invoice row actions explain **what** is downloaded (e.g. statement vs receipt) in one line or tooltip. |
| G5 | **Account & records** | **Data export** (GDPR-style package) and **session recordings** (if enabled for the user) each have a **clear** path: request → status → download/open—no dead ends after “success” toasts. |
| G6 | **Tutorial alignment (later)** | Wave 16 stream `patient.telehealth_101` (or a short checklist link) points to **join + test setup** once G1–G2 exist—**never** blocks join. |

---

## 2. Non-goals (this wave)

- Replacing **Twilio** (or chosen provider) video SDK—this wave is **entry UX**, **readiness**, and **artifact honesty**, not codec work.  
- **Guaranteed** network quality prediction—browser APIs are **hints** only; copy stays humble (“may be unstable”).  
- **Full** device settings UI (system sound output, Bluetooth routing)—link out to OS help where needed.  
- **Psychologist** parity in this document—mirror only where product insists; default scope is **patient**.  

---

## 3. Current state (repository snapshot)

Use this as the baseline for tickets; update the table when shipping.

| Area | What exists today | Notes |
|------|-------------------|--------|
| **Join + mic/camera** | `/video-session/[appointmentId]` hosts `VideoSessionWorkspace`: `PreSessionReadinessCard` (camera/mic via `getUserMedia`, coarse network hint), `JoinSessionGate`, pre-session chat. | Checks are **appointment-scoped**; there is **no** patient-shell route dedicated to “practice once.” |
| **Discoverability** | `UpcomingSessionCard` links “Join Telehealth Session” → `/video-session/...`. | Validate **appointments list** and **notifications** deep links the same way. |
| **Invoices** | `PatientInvoicesSection` calls `downloadPatientInvoice` per row. | Confirm response **Content-Type** / extension vs UI label (`PDF` vs other). |
| **Data export** | Account settings: request export → download path with `.pdf` naming in client. | Ensure backend contract matches label end-to-end. |
| **Recordings** | `/patient/recordings` with policy-gated open in new tab. | Not in main sidebar today—discoverability may be weak. |
| **Booking** | `/patient/book-appointment` (patient layout) preserves tutorials; referral **PDF upload** in wizard. | Good anchor for “documents” story. |

---

## 4. Gaps to close (prioritized backlog)

### P0 — Correctness & trust

| Item | Problem | Direction |
|------|-----------|-----------|
| **Download truthfulness** | Mismatch between **button label** and **actual file** erodes trust (especially “PDF”). | Audit `downloadPatientInvoice` and any PDF copy; align **label**, **filename**, and **support doc** in one ticket. |
| **Join URL consistency** | Multiple entry points must land on the **same** join workspace to avoid “it worked from email but not from the app.” | Single source of truth for `href` builder (helper or small `joinSessionPath(appointmentId)`). |

### P1 — Discoverability & calm

| Item | Problem | Direction |
|------|-----------|-----------|
| **Standalone readiness** | Users discover mic/camera only **inside** `/video-session/...`, often under time pressure. | Add **`/patient/video-setup`** (name TBD) that **reuses** `PreSessionReadinessCard` logic in a **no-appointment** mode, OR a modal from Dashboard/Account with identical checks. |
| **Pre-join entry points** | Join only obvious from one card. | Ensure **Appointments** list row + **notification** CTA use the same join helper. |
| **Recordings findability** | Page exists but may be off the mental map. | Optional: footer link, Resources blurb, or post-session CTA—pick **one** channel to avoid clutter. |

### P2 — Guidance & policy alignment

| Item | Problem | Direction |
|------|-----------|-----------|
| **Wave 7 BR-301 / BR-302** | Checklist still marks location confirmation / formal preflight spec as open. | **Deferred (reconfirmed 2026-05-04):** no change to `JoinSessionGate` in this wave; product to schedule a follow-up when location attestation and formal preflight copy are ready. |
| **Tutorial** | `patient.telehealth_101` in Wave 16 table is not fully wired to real join UX. | After P1, add **3–5** tour stops: where join appears → what readiness does → where notifications are. |

---

## 5. Experience architecture (keep it simple)

### 5.1 Three patient “moments”

1. **Anytime** — “Am I technically ready?” → **Test setup** (optional page or modal).  
2. **Before visit** — “When and how do I enter?” → **Dashboard / Appointments / notification** → same **join** route.  
3. **After documents** — “How do I get my invoice / export / recording?” → **Billing**, **Account**, **Recordings** with **honest** download verbs.

### 5.2 Rules

- **Never** block **Join** behind a tutorial overlay (Wave 16 rule carries forward).  
- **One** primary CTA per surface (avoid two different “Join” behaviors on the same card).  
- Reuse **`PreSessionReadinessCard`** internals for standalone test—**one implementation** of browser checks, two entry layouts (embedded vs standalone).  

---

## 6. Implementation plan (phased)

### Phase A — Audit & label fix (small, high leverage)

1. Trace **invoice download** end-to-end: API route, `Content-Disposition`, client `anchor.download`.  
2. Update UI strings to match reality; add **one** sentence in empty/error states for exports and invoices.  
3. Extract **`joinSessionHref(appointmentId)`** (or equivalent) and replace ad-hoc string builds in patient UI + notifications consumer.

**Exit:** P0 table cleared; no misleading “PDF” where not PDF.

### Phase B — Standalone readiness (recommended)

1. Add route **`/patient/video-setup`** under `app/patient/` (inherits layout + tutorials boundary).  
2. Refactor **`PreSessionReadinessCard`** to accept `mode: "appointment" | "practice"`; in `practice`, hide appointment-only API merges if any, keep camera/mic/network UI identical.  
3. Link from **Dashboard** (secondary link or “Help” row) and **Account** (“Test camera & microphone”).  

**Exit:** G2 satisfied; link is visible in **two** places max (avoid nav sprawl).

### Phase C — Discoverability pass

1. Appointments table/list: primary row action uses **`joinSessionHref`**.  
2. Notifications: deep link template reviewed against same helper (`backend/src/modules/appointments/appointments.service.ts` uses `/video-session/${appointmentId}` for session CTAs; matches `joinSessionHref`).  
3. Optional: one **Recordings** discovery path (choose sidebar vs Resources vs post-session only—document choice).

**Exit:** G1 satisfied in QA matrix row.

### Phase D — Tutorial & Wave 7 alignment

1. Implement or formally **defer** BR-301/302 with sign-off.  
2. Ship **`patient.telehealth_101`** steps referencing real selectors (`data-tutorial` on join entry + readiness anchor).  

**Exit:** G6 + checklist rows updated.

---

## 7. Acceptance criteria (testable)

| # | Criterion |
|---|-----------|
| AC1 | From **dashboard** with a known `appointmentId`, “Join” navigates to `/video-session/{id}` and readiness UI renders without console errors. |
| AC2 | From **`/patient/video-setup`** (or chosen route), running checks requests **camera + mic** once; tracks are **stopped** after check; user can repeat without refresh leak (no runaway streams). |
| AC3 | Invoice download button text matches **actual** file type delivered in happy-path fixture test or manual QA script. |
| AC4 | With **notifications** flag on (if applicable), tapping a “session soon” notification lands on the **same** join URL as AC1. |
| AC5 | **Reduced motion**: readiness UI does not rely on motion-only affordance for pass/fail (icons + text). |

---

## 8. Open questions (resolve before Phase B/C)

1. Should **“Test setup”** require login, or offer a **logged-out** marketing micro-page? (Default: **authenticated only**—simpler.)  
2. Do we ever show **speaker output** selection in v1, or defer to OS? (Default: **defer**.)  
3. Is **session recording** discovery in-scope for Wave 17 or a follow-up wave? (Pick one to avoid endless scope.)  

---

## 9. Definition of Done (Wave 17)

- P0 items **shipped** or **explicitly waived** with product sign-off in this file (dated note).  
- **BR-301 / BR-302 (Wave 7 §D):** As of **2026-05-04**, mandatory location confirmation and the expanded formal preflight spec in `JoinSessionGate` are **not** implemented in this slice; the backlog table above records the deferral. Revisit when clinical/product sign-off defines the exact gate and strings.  
- At least **one** calm path for **mic/camera** (Phase B) **or** a written decision to postpone with rationale.  
- Join entry points **share** the same URL builder and pass AC1/AC4.  
- `routes-overview.md` updated if new patient route(s) ship.  

---

**End of Wave 17 spec.** Ticket titles should reference **Wave 17** and section IDs (G1, P0, Phase B, etc.) for traceability.
