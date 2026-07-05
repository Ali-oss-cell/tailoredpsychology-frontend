# Core platform deep check (how this repo defines “core”)

This document captures a **structured deep check** against how *this* repository defines “core” — without implying every E2E path was executed against a live API/DB in one pass. Use it for onboarding, release readiness, and reconciling **spec vs code**.

**See also:** [`PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md`](./PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md) (AU law map, privacy policy, broader gaps), [`WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md`](./WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md) (competitive positioning, gap IDs, Phases A–C), [`WAVE20_LAUNCH_CLOSURE_AND_STAGING.md`](./WAVE20_LAUNCH_CLOSURE_AND_STAGING.md) (staging smoke, A6/N8), [`routes-overview.md`](./routes-overview.md) (route inventory).

---

## 1. What counts as “core” here (multiple lenses)

| Lens | What it tells you |
|------|-------------------|
| [`routes-overview.md`](./routes-overview.md) | **Surface coverage**: which URLs exist for public, auth, patient, psychologist, manager, admin, video, recordings. Strong signal for “did we ship a page shell?” |
| [`BOOKING_AND_PROFILE_PRODUCTION_READINESS.md`](./BOOKING_AND_PROFILE_PRODUCTION_READINESS.md) | **Booking/referral/clinician slice**: what’s actually wired (e.g. `POST /booking-requests`, referral upload, availability fields). |
| [`PROJECT_CLOSURE_CHECKLIST.md`](./PROJECT_CLOSURE_CHECKLIST.md) | **Wave 11+ closure** items (ops nav, referrals, governance, etc.) — many marked done with test evidence cited. |
| [`WAVE7_REQUIREMENTS_CHECKLIST.md`](./WAVE7_REQUIREMENTS_CHECKLIST.md) | **Aspirational product / compliance backlog** (BR-xxx). Many rows still say **`Not started`** even where the codebase has moved on — **treat as planning doc unless reconciled to code**. |
| [`WAVE8_IMPLEMENTATION_PLAN.md`](./WAVE8_IMPLEMENTATION_PLAN.md) / [`WAVE8_EXECUTION_TICKETS.md`](./WAVE8_EXECUTION_TICKETS.md) | Sequencing plan (e.g. telehealth T-30 chat); not automatically “all done”. |

So: **missing “core”** can mean:

- **(a)** no route/UI,
- **(b)** spec says Not started but code exists, or
- **(c)** spec deferred (e.g. Wave 17 on BR-301/302).

---

## 2. High-confidence “core is present” (from docs + spot checks)

- **Role-based portals** — Patient / psychologist / manager / admin routes are enumerated in `routes-overview.md` (dashboards, patients, notes, referrals, privacy, billing, etc.).
- **Booking + referrals** — `BOOKING_AND_PROFILE_PRODUCTION_READINESS.md` describes end-to-end wiring (availability, booking submit, referral doc id, review queue when DB on).
- **Video session** — `/video-session/:appointmentId` and related patient readiness/join work (also referenced in [`WAVE17_PATIENT_PORTAL_READINESS_DOWNLOADS_AND_JOIN.md`](./WAVE17_PATIENT_PORTAL_READINESS_DOWNLOADS_AND_JOIN.md)).
- **Closure-style quality** — `PROJECT_CLOSURE_CHECKLIST.md` claims green lint/typecheck/tests for front/back with counts (still worth **re-running** before any release).

---

## 3. Likely gaps or “not done vs spec” (worth tracking)

### A) Wave 7 checklist vs reality (doc drift)

`WAVE7_REQUIREMENTS_CHECKLIST.md` still lists **`BR-601` / `BR-602`** etc. as **`Not started`**, but the backend exposes `GET .../clinicians/availability` and `POST .../booking-requests` (see `backend/src/modules/appointments/appointments.controller.ts`).

**Action:** Either **update the checklist** to “Done” / “Partial” with file/API references, or the team will always feel something is “missing” on paper even when code exists.

### B) Telehealth / join “hard” requirements (still open in spec)

Same Wave 7 file: **`BR-301`** (location confirmation before join), **`BR-303–305`** (pre-session chat T-30, auto-close, permissions) may still show **`Not started`** while parts of the product implement related UX (e.g. pre-session chat panel, readiness cards).

Wave 17 **explicitly deferred** BR-301/302 in product docs until clinical/sign-off — so this can be a **known intentional gap vs ideal spec**, not a surprise omission.

**Action:** Reconcile Wave 7 §D rows with actual backend/socket behaviour and Wave 17 deferral notes so stakeholders see **one story**.

**Decision record (N9, dated 2026-05-04):**
- BR-301 and BR-302 are explicitly **Deferred** in Wave 7 to align with Wave 17.
- Current product stance is **defer with waiver**, not “missing implementation by accident.”
- Re-open only when clinical + product define exact join-gate copy, UX, and sign-off owner.

### C) Lifecycle / analytics / consent depth

Many **`BR-001`–`BR-004`**, identity/risk **`BR-101+`**, **`BR-402`** (append-only events), **`BR-405`** (consent versioning), **`BR-501`–`BR-506`** are still **`Not started`** in the checklist — i.e. **product/compliance depth**, not just “a page exists”.

### D) Public site assets

`frontend/content/homepage.ts` still references **`/assets/clinic-room.jpg`**, **`team-discussion.jpg`**, and other **`.jpg`** paths; `public/assets/` may be **SVG-heavy** or use different filenames — risk of **404s on `/`** unless those rasters exist.

**Action:** Network tab on homepage after deploy; grep `"/assets/` under `frontend` and verify each path exists under `public/`.

### E) Demo / local auth

`login/page.tsx` mentions **stub backend / demo logins** — fine for dev; for **production core** you’d confirm real auth paths only and gate or remove demo copy in production builds.

---

## 4. How to systematically ensure nothing important is missed (process)

1. **Reconcile Wave 7 table to code** once: for each `BR-60x` API row, grep backend + [`backend/docs/API_CONTRACT.md`](../../backend/docs/API_CONTRACT.md) / matrix; mark Done or “Partial / v1”.
2. **Role smoke matrix**: one happy path per role from `routes-overview.md` (patient booking → video shell, psych notes, manager referral queue, admin audit).
3. **Cross-doc**: align Wave 17 deferrals with Wave 7 §D so telehealth join/chat requirements read consistently.
4. **Asset audit**: grep `frontend` for `"/assets/` and verify each file exists under `public/`.
5. **Backend module inventory** vs `routes-overview` “summary” column (optional but thorough).

---

## 5. Automation / E2E limitation

A full **automated gap report** (grep + file existence + checklist diff) or **E2E against live API/DB** is a separate pass: run in CI or Agent mode with services up, then attach results to this doc’s revision history.

---

## 6. Bottom line

The repo’s **routes + booking doc + closure checklist** suggest a **broad core platform is in place**. The biggest **honest** risks to track are:

1. Wave 7 checklist **out of date** vs implemented APIs (**doc drift**).
2. Telehealth **BR-301 / BR-303+** (and related rows) still **spec-open or deferred** vs what ships — needs explicit product/legal alignment.
3. **Homepage (and similar) asset paths** possibly **404ing** if `public/` does not match referenced extensions/names.

---

## 7. Need to have vs nice to have (Clink-oriented)

Use this to **sequence work**: finish **§7.1** before widening scope into **§7.2**. Treat §7.1 as **launch / trust / compliance minimum** for a health-adjacent telehealth product; §7.2 as **depth, differentiation, and paper hygiene** once the baseline is safe and honest.

### 7.1 Need to have

| ID | Item | Why it matters |
|----|------|----------------|
| **N1** | **Production-grade auth** — no stub/demo as the primary story; real password reset, sessions, server-side role checks | Security and APP 6 / trust |
| **N2** | **RBAC correct end-to-end** — patient / psychologist / manager / admin only see and mutate what policy allows | Privacy + safety incident prevention |
| **N3** | **Truthful care & money UX** — fees, rebates, downloads, join URLs match reality (see Wave 17 patterns) | ACL / consumer trust; clinical expectation setting |
| **N4** | **Public privacy policy + legal sign-off** — [`/privacy-policy`](/privacy-policy) draft in repo must become **entity-specific** approved text | APP 1 / transparency |
| **N5** | **Terms of Service (or equivalent)** — registration references terms; ship a **`/terms-of-service`** (or legal pack) consistent with counsel advice | Contractual clarity with users |
| **N6** | **Health data baseline** — encryption in transit, sensible retention alignment with counsel + [`RETENTION_AND_DELETION_POLICY_AU.md`](../../backend/docs/RETENTION_AND_DELETION_POLICY_AU.md) | APP 11 + health record norms |
| **N7** | **Incident / NDB readiness** — owner, runbook, how to assess eligible data breach (even if UI is partial) | Privacy Act NDB scheme |
| **N8** | **Core journeys work on real API+DB** — register → intake/booking → appointment → join video (or explicit failure); referrals/queues if selling to practices | “Product exists” bar |
| **N9** | **Explicit decision on deferred telehealth spec** — BR-301/302 (and related §D rows): **implement** or **signed, dated waiver** in product docs | Removes undefined regulatory/clinical posture |

**Suggested checkboxes (need to have)**

- [ ] **N1** — Production auth path verified; demo/stub copy gated or removed in prod builds (`login` and env strategy). *(2026-07-05: prod `/login` has no demo copy; `MailService` + SMTP wired — **deploy backend, set `SMTP_*`, verify forgot-password email receipt**.)*
- [x] **N2** — Role smoke matrix passed (patient / psych / manager / admin) against live or staging API. *(Local **2026-05-04**: API RBAC probes + Next `proxy.ts` redirect probes recorded in `WAVE3_AUTH_RBAC_SMOKE_MATRIX.md`.)*
- [x] **N3** — Spot-audit pricing, Medicare copy, invoices, join links for honesty. *(Completed 2026-05-06; findings and wording fixes recorded in `WAVE5_HONESTY_AUDIT.md`.)*
- [ ] **N4** — Replace `ENTITY_PLACEHOLDER` in `content/legal/privacy-policy-au.ts`; privacy officer + contact; legal sign-off recorded. *(Entity text done; counsel pack in `COUNSEL_REVIEW_PACK.md` — contact details deferred to counsel; flip `legal-publication.ts` + `public-contact.ts` after approval.)*
- [ ] **N5** — Terms page shipped + linked from register/footer as counsel directs. *(Route + links shipped; flip `legalPublication.termsOfServiceApproved` after counsel sign-off.)*
- [ ] **N6** — Security/retention review with legal; engineering doc matches approved retention. *(Runbook + approval table in `SECURITY_RETENTION_NDB_RUNBOOK.md`; pending formal sign-off.)*
- [ ] **N7** — NDB runbook + incident register process agreed (align with admin security-incidents UI if used). *(Same runbook; pending formal approval.)*
- [ ] **N8** — End-to-end patient booking → session join on staging with real data path. *(Prod CORS pass 2026-07-05; full smoke blocked on prod role credentials; manual Twilio journey pending — see `WAVE20_LAUNCH_CLOSURE_AND_STAGING.md` §7.)*
- [x] **N9** — BR-301/302 + Wave 7 §D reconciliation doc updated (implement or waiver).

### 7.2 Nice to have

| ID | Item | Why it’s “nice” |
|----|------|-----------------|
| **P1** | **Wave 7 checklist 100% “Done”** | Mostly **documentation reconciliation**; reduces false “missing core” |
| **P2** | **Patient journey timeline (e.g. BR-501)** | Clarity UX; not always day-one for narrow pilot |
| **P3** | **Append-only / field-level audit everywhere (BR-402/403)** | Enterprise and dispute maturity; phase by domain |
| **P4** | **Consent versioning depth (BR-405)** | Legal defensibility; can follow MVP consent capture |
| **P5** | **Lifecycle analytics (BR-503–506)** | Ops improvement |
| **P6** | **Tutorials / marketing polish (Waves 16–18)** | Conversion and calm onboarding |
| **P7** | **Homepage / marketing imagery perfection** | Trust; fix 404s first, art direction second |
| **P8** | **Every BR-101+ identity/risk field** | Inclusivity and triage depth; phase with clinical |

**Suggested checkboxes (nice to have)**

- [x] **P1** — Reconcile `WAVE7_REQUIREMENTS_CHECKLIST.md` BR-60x (and others) to code/API contract; mark Done / Partial with references. *(Wave 19: §G APIs + §D telehealth + partial §E.)*
- [ ] **P2** — Unified status timeline for patient portal (design + API if needed).
- [ ] **P3** — Audit event coverage expanded per Wave 13 / governance plan.
- [ ] **P4** — Consent model v2 per legal (version, withdraw, minor flows).
- [ ] **P5** — Metrics definitions + first dashboard slice.
- [ ] **P6** — Tutorial and public-page backlog from Wave 16–18 as product prioritises. *(2026-07-05: portal shell search now functional across patient, psychologist, manager, and admin shells; ops compliance sidebar links to audit/privacy tools.)*
- [x] **P7** — Asset audit complete; optional raster refresh per `IMAGE_CREDITS.md`. *(Wave 19: fixed homepage clinic/team paths to `.svg`.)*
- [ ] **P8** — Intake field matrix (pronouns, risk, etc.) phased per clinical sign-off.

### 7.3 One-line rule

- **Need to have:** safe, lawful, **honest**, **role-correct** handling of people and health data, with **core paths working** and **clear signed decisions** on known spec gaps (e.g. BR-301/302).
- **Nice to have:** depth, metrics, documentation perfection, and experience layers that **reduce friction** once the baseline is trusted.

---

## 8. Consolidated next-work backlog (single ordered list)

Work **top to bottom** unless legal/security blocks reordering.

1. **N9** — Close the loop on **BR-301/302 / Wave 7 §D** vs Wave 17 (implement join gates or publish signed waiver + single stakeholder story).
2. **N4 + N5** — **Privacy policy** finalisation + **Terms** page (registration and footer links).
3. **N1** — **Production auth** and removal/gating of demo-only messaging for prod.
4. **N2 + N8** — **RBAC smoke** + **one full patient journey** on staging/real API.
5. **N3** — **Honesty audit** (pricing, Medicare, invoices, join) — quick pass before any external demo.
6. **N6 + N7** — **Security / retention / NDB** runbook with legal (link engineering retention doc to approved policy).
7. **P1** — **Wave 7 ↔ code reconciliation** (stops false “missing core” noise).
8. **§3 D** — **Public asset audit** (`homepage.ts` and grep `"/assets/"` → `public/`). *(Wave 19: homepage `.jpg` → committed `.svg` paths.)*
9. **P7** — **Marketing polish** after assets are clean.
10. **P2–P6, P8** — Pick **one** nice-to-have theme per sprint (timeline, audit depth, consent v2, metrics, tutorials, intake fields) based on pilot customer.

---

## Revision history

| Date | Notes |
|------|--------|
| 2026-05-03 | Initial capture from core-platform deep-check summary; linked related docs. |
| 2026-05-03 | Added §7 need vs nice tables + checkboxes, §7.3 rule, §8 consolidated backlog for next work. |
| 2026-05-04 | Wave 1 completed: BR-301/302 decision recorded as deferred-with-waiver and aligned across Wave 7 + Wave 17 docs. |
| 2026-05-04 | Wave 2 completed: `/terms-of-service` shipped, register/footer legal links added, and legal owner/sign-off tracking captured in `LEGAL_SIGNOFF_TRACKER.md`. |
| 2026-05-04 | Wave 3 completed: Auth + RBAC smoke matrix documented with explicit release blockers in `WAVE3_AUTH_RBAC_SMOKE_MATRIX.md`. |
| 2026-05-04 | Wave 4 completed: legal tracker upgraded with owner/status/date model and contact source-of-truth; runtime smoke script executed with test-backed evidence plus explicit live-runtime blockers for N1/N2/N8. |
| 2026-05-04 | Wave 4 follow-up: local smoke (`scripts/wave4-runtime-smoke.mjs`) + matrix in `WAVE3_AUTH_RBAC_SMOKE_MATRIX.md`. Booking IDs: with PostgreSQL, `POST /booking-requests` uses `br_<uuid>` to avoid `P2002` collisions with legacy `br_000001` rows; in-memory mode keeps sequential ids for tests. |
| 2026-05-06 | Wave 5 progress: Track B honesty audit completed (`WAVE5_HONESTY_AUDIT.md`) and Track C governance runbook drafted with owners/process (`SECURITY_RETENTION_NDB_RUNBOOK.md`). |
| 2026-05-06 | Wave 5 progress: Track A session hardening implemented (backend-set HttpOnly role cookie, frontend cookie writes removed) and local smoke evidence refreshed. |
| 2026-05-06 | Wave 5 progress: Track D staging prep checklist added (`WAVE5_STAGING_SMOKE_PREP_CHECKLIST.md`) pending real staging role credentials. |
| 2026-05-09 | Wave 19 added: competitive gap audit and phased roadmap (`WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md`). |
| 2026-07-05 | Portal UX polish: live manager ops pages, shell search (`?q=`) on all portal list pages, ops account menu, manager dashboard snapshot; Wave 7 BR-406 → Partial; P6 portal search note. N8/W20-S4/S5 staging smoke still open pending credentials + manual Twilio run. |
