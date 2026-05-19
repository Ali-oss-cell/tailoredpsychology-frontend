# Wave 19: Platform competitive gap audit & roadmap

**Audience:** Product, clinical leads, operations, engineering, and agents prioritising Tailored Psychology vs typical Australian telehealth / practice-management platforms.

**Primary promise**

> Stakeholders see **one honest picture**: what we **ship today**, what **mature competitors** usually offer, what is **partial**, what is **deferred by decision**, and what is **doc drift**—with a **phased backlog** aligned to existing Wave 1–18 work.

**Date:** 2026-05-09  
**Status:** Living document — execution pass 2026-05-09 (code + doc reconciliation).

---

## Related docs

| Doc | Relevance |
|-----|-----------|
| [`CORE_PLATFORM_DEEP_CHECK.md`](./CORE_PLATFORM_DEEP_CHECK.md) | Need-to-have (N1–N9) vs nice-to-have (P1–P8); consolidated backlog. |
| [`PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md`](./PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md) | AU law map, user-visible gaps, governance depth. |
| [`WAVE7_REQUIREMENTS_CHECKLIST.md`](./WAVE7_REQUIREMENTS_CHECKLIST.md) | BR-### rows — reconciled 2026-05-09 for APIs + telehealth chat. |
| [`WAVE_PATIENT_BUTTON_GAP_AUDIT.md`](./WAVE_PATIENT_BUTTON_GAP_AUDIT.md) | Patient shell buttons: wired vs follow-up. |
| [`ADMIN_FULL_WIRING_EXECUTION.md`](./ADMIN_FULL_WIRING_EXECUTION.md) | Admin tab functional matrix (updated 2026-05-09). |
| [`PSYCHOLOGIST_DASHBOARD_POLISH_AND_WIRING_PLAN.md`](./PSYCHOLOGIST_DASHBOARD_POLISH_AND_WIRING_PLAN.md) | Psychologist portal polish backlog. |
| [`BOOKING_AND_PROFILE_PRODUCTION_READINESS.md`](./BOOKING_AND_PROFILE_PRODUCTION_READINESS.md) | Booking/referral/Medicare honesty. |
| [`WAVE17_PATIENT_PORTAL_READINESS_DOWNLOADS_AND_JOIN.md`](./WAVE17_PATIENT_PORTAL_READINESS_DOWNLOADS_AND_JOIN.md) | Join/readiness/download honesty (BR-301/302 deferral). |
| [`routes-overview.md`](./routes-overview.md) | Canonical route inventory. |

---

## 1. Comparison frame (who we are vs “other platforms”)

| Platform type | Examples (market) | Tailored Psychology / Rebild today |
|---------------|-------------------|-------------------------------------|
| **Full practice management (PMS)** | Halaxy, Power Diary, Core Plus, Cliniko-adjacent stacks | **Lighter** on rostering depth, Medicare claiming automation, accounting integrations, SMS at scale |
| **Dedicated telehealth** | Coviu, vendor video rooms | **Video path exists** (`/video-session/:id`); production depends on Twilio (or chosen provider) + join/readiness UX; some BR-301+ spec **deferred** |
| **Marketing-only clinic site** | Static WordPress + contact form | **Far ahead** — multi-role portals, booking, governance surfaces, tutorials |
| **Enterprise health SaaS** | Deep audit, consent versioning, field-level history everywhere | **Directional** — partial admin/compliance UI; BR-402/403/405 depth still roadmap |

**One-line positioning:** Custom **branded clinic platform** with strong **portal + governance narrative**; not yet a **full PMS replacement** without deliberate Phase C investment.

---

## 2. Goals (this wave document)

| ID | Goal | Success looks like |
|----|------|---------------------|
| G1 | **Honest competitive narrative** | Sales and clinical leads can explain what we do **better** and what we **do not** claim yet. |
| G2 | **Gap IDs traceable** | Every gap row links to an owner doc, BR-###, or execution slice below. |
| G3 | **No false “missing core”** | Doc drift (Wave 7 vs code) called out separately from real product gaps. |
| G4 | **Phased roadmap** | Launch (Phase A) vs product depth (B) vs enterprise (C) is explicit. |

---

## 3. Non-goals

- Feature parity with Halaxy/Power Diary in one release.  
- Legal advice — see [`PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md`](./PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md).  
- Replacing Waves 7–18 tickets — this doc **indexes** them.  
- **Phase C** enterprise items in this execution pass (timeline, full audit depth, integrations) — remain backlog.

---

## 4. What we already have (on par or ahead for v1)

| Area | Status | Evidence / notes |
|------|--------|------------------|
| Multi-role portals | **Shipped** | Patient, psychologist, practice manager, admin — [`routes-overview.md`](./routes-overview.md) |
| Public marketing | **Shipped** | Services, pricing, trust, conditions, Medicare, contact — Wave 18 |
| Auth & RBAC | **Shipped** (verify prod) | Login/register, `proxy.ts`, role cookie, CORS config — Wave 3 + backend `cors.config.ts` |
| Patient booking | **Shipped** | Availability, intake, referral upload, `POST /booking-requests` |
| Patient portal shell | **Shipped** | Dashboard, appointments, billing, resources, data requests, my clinician |
| Psychologist workflow | **Shipped (core)** | Live caseload + patient profile APIs; notes/sign-off; referrals on profile |
| Ops / admin | **Shipped (core)** | `admin/ops/*` endpoints + admin pages wired |
| Telehealth entry | **Shipped UX path** | T-30 chat window in backend; BR-301/302 **deferred** (N9) |
| Compliance direction | **Draft + UI** | Privacy/terms pages, retention runbook — **counsel sign-off pending** |
| Onboarding UX | **Shipped** | Tutorials (Wave 16), theme toggle (`@space-man/react-theme-animation`) |

---

## 5. Gap matrix vs typical platforms

### 5.1 Patient experience

| ID | Gap | vs competitors | Repo / wave owner | Priority | Wave 19 |
|----|-----|----------------|-------------------|----------|---------|
| PG-01 | Invoice download placeholder | PMS: real PDFs | `billing.service.ts` | Phase B | **Done** — minimal PDF download |
| PG-02 | Account profile depth | PMS standard | `patient_profiles` + account settings | Phase B | **Done** — phone, emergency, accessibility editable |
| PG-03 | Unified journey timeline | Mature portals | BR-501 | Phase C | Open |
| PG-04 | Medicare auto-adjudication | Integrated PMS | Honesty by design | — | **By design** |
| PG-05 | Mood in-memory only | Persist check-ins | `patient_mood_checkins` migration | Phase B | **Done** — PostgreSQL when DB on |

### 5.2 Clinician & practice ops

| ID | Gap | vs competitors | Repo / wave owner | Priority | Wave 19 |
|----|-----|----------------|-------------------|----------|---------|
| CO-01 | Psychologist caseload static | Live caseload | `psychologist/patients` pages | Phase B | **Done** — workspace API |
| CO-02 | Psychologist referral visibility | Ops queues | `getPsychologistReferrals` on profile | Phase B | **Done** |
| CO-03 | Notes UX depth | Rich clinical UIs | Wave 12 | Phase B | Open (polish) |
| CO-04 | Admin tabs partial | Full PMS admin | `admin/ops/*` | Phase B | **Done** — wired |
| CO-05 | Practice rostering at scale | PMS core | — | Phase C | Open / partner |

### 5.3 Telehealth

| ID | Gap | vs competitors | Repo / wave owner | Priority | Wave 19 |
|----|-----|----------------|-------------------|----------|---------|
| TH-01 | BR-301/302 join gates | Regulated telehealth | Wave 17 deferral | Decision | **Deferred** (signed N9) |
| TH-02 | BR-303–305 chat rules | Coviu-class | `appointments.service.ts` | Phase B | **Done** — reconciled in Wave 7 |
| TH-03 | Twilio production config | Turnkey video | Deploy env | Phase A | **Verify on staging** |

### 5.4 Governance, legal, enterprise

| ID | Gap | vs competitors | Repo / wave owner | Priority | Wave 19 |
|----|-----|----------------|-------------------|----------|---------|
| GV-01 | Privacy/terms counsel sign-off | AU launch | `LEGAL_SIGNOFF_TRACKER.md` | Phase A | **Open** (legal) |
| GV-02 | Append-only audit (BR-402) | Enterprise | Wave 13 | Phase C | Open |
| GV-03 | Consent versioning (BR-405) | Health privacy | `patient_consents` | Phase C | Partial in code |
| GV-04 | Field-level audit (BR-403) | Enterprise | Wave 13 | Phase C | Open |
| GV-05 | NDB runbook approved | Privacy Act | `SECURITY_RETENTION_NDB_RUNBOOK.md` | Phase A | **Open** (process) |
| GV-06 | Demo login on production | Buyer trust | `login/page.tsx` | Phase A | **Done** — dev-only block |

### 5.5 Integrations

| ID | Gap | vs competitors | Notes | Priority | Wave 19 |
|----|-----|----------------|-------|----------|---------|
| IN-01 | Accounting (Xero/MYOB) | Add-on | — | Phase C | Open |
| IN-02 | Medicare claiming | PMS core | Honest UX only | Phase C | Open |
| IN-03 | Bulk SMS/email | PMS marketing | Partial notifications | Phase C | Open |
| IN-04 | Native mobile apps | Incumbents | Web-first | Optional | Open |

---

## 6. Documentation drift (not missing code)

| Issue | Symptom | Fix | Wave 19 |
|-------|---------|-----|---------|
| Wave 7 **BR-601/602** “Not started” | Feels like APIs missing | Mark **Done** in Wave 7 §G | **Done** |
| Wave 7 **§D telehealth** vs Wave 8 | Distrust of chat | Mark BR-303–305 Done/Partial | **Done** |
| Homepage **`.jpg`** paths | 404 on `/` | Use committed `.svg` assets | **Done** |
| `ADMIN_FULL_WIRING_EXECUTION` stale | Admin feels broken | Update matrix to **functional** | **Done** |

---

## 7. Phased execution (maps to CORE §7 + this matrix)

### Phase A — Launch / trust minimum (need to have)

| Slice | Items | Wave / doc |
|-------|-------|------------|
| A1 | Production auth, CORS, `COOKIE_DOMAIN`, staging smoke | Wave 3, Wave 5, `cors.config.ts` |
| A2 | Privacy + terms legal sign-off | `LEGAL_SIGNOFF_TRACKER.md` |
| A3 | Honesty pass (pricing, Medicare, invoices, join) | `WAVE5_HONESTY_AUDIT.md` |
| A4 | Security / retention / NDB runbook approved | `SECURITY_RETENTION_NDB_RUNBOOK.md` |
| A5 | BR-301/302 **signed deferral** or implement | N9 — Wave 17 |
| A6 | Real patient journey on **staging** with Twilio | `WAVE5_STAGING_SMOKE_PREP_CHECKLIST.md` |

**Phase A checklist**

- [x] **A1** — CORS allowlist + cookie domain documented; login redirect fixes shipped; demo logins dev-only.
- [ ] **A2** — Counsel-approved privacy + terms published. *(Legal — outside engineering.)*
- [x] **A3** — Honesty audit completed (`WAVE5_HONESTY_AUDIT.md`).
- [ ] **A4** — NDB/retention owners and runbook formally signed. *(Ops/legal.)*
- [x] **A5** — BR-301/302 deferred with waiver (Wave 7 + CORE N9).
- [ ] **A6** — Book → appointment → join video on **staging** with real Twilio. *(Run checklist on server.)*

### Phase B — “Feels like a real product”

| Slice | Items | IDs |
|-------|-------|-----|
| B1 | Real invoice PDFs + billing persistence | PG-01 |
| B2 | Admin ops tabs wired (`admin/ops/*`) | CO-04 |
| B3 | Psychologist patients/notes/profile live | CO-01, CO-02 |
| B4 | Persist mood + profile optional fields | PG-05, PG-02 |
| B5 | Telehealth chat rules reconciled | TH-02 |
| B6 | Wave 7 ↔ code reconciliation | Doc drift |

**Phase B checklist**

- [x] **B1** — Invoice download returns `application/pdf` (minimal PDF generator).
- [x] **B2** — Admin appointments/patients/staff/resources/settings/billing/analytics/deletion-queue use `admin/ops` APIs.
- [x] **B3** — Psychologist caseload + patient profile API-backed (referrals on profile).
- [x] **B4** — Mood persisted in `patient_mood_checkins` when PostgreSQL enabled; profile contact fields in UI.
- [x] **B5** — BR-303–305 marked Done/Partial in Wave 7 with code references.
- [x] **B6** — Wave 7 §G + §D + partial §E rows updated.

### Phase C — Enterprise / differentiation

| Slice | Items | IDs | Status |
|-------|-------|-----|--------|
| C1 | Patient journey timeline | PG-03 | Not started |
| C2 | Audit + consent depth | GV-02–04 | Not started |
| C3 | Lifecycle analytics | CORE P5 | Not started |
| C4 | Integrations (accounting, claiming) | IN-01, IN-02 | Not started |
| C5 | Intake field matrix (identity/risk) | CORE P8 | Not started |

**Phase C checklist** — deferred to future waves; no engineering claim of completion.

- [ ] **C1** — Unified patient timeline (design + API).
- [ ] **C2** — BR-402/403 enterprise audit depth.
- [ ] **C3** — Ops analytics definitions + dashboards.
- [ ] **C4** — Integration partner decision.
- [ ] **C5** — Wave 7 identity/risk field matrix with clinical sign-off.

---

## 8. Persona snapshot (buyer conversation)

| Persona | “We’re strong because…” | “We’re not claiming yet…” |
|---------|-------------------------|---------------------------|
| **Patient** | Book online, portal, telehealth join path, privacy requests, PDF invoices | Full timeline, native app |
| **Psychologist** | Live caseload, notes, referrals on profile, video join | Enterprise notes editor |
| **Practice manager** | Referrals, patients, billing views | Full rostering/SMS suite |
| **Admin / compliance** | Audit, incidents, privacy queues, ops APIs | Field-level audit everywhere |
| **Buyer (clinic owner)** | Own brand, one stack, governance story | Halaxy-class PMS without Phase C |

---

## 9. Target models (pick one to narrow scope)

| Model | Phase A focus | Defer |
|-------|---------------|-------|
| **Solo telehealth clinic** | A1–A6, B1–B3 | IN-*, CO-05, C* |
| **Multi-clinic pilot** | A + B2 + B6 + legal | C4 until partner |
| **Enterprise hospital-adjacent** | Not ready without **C2** + legal depth | Marketing-only positioning |

---

## 10. Code changes (Wave 19 execution log)

| Change | Files |
|--------|--------|
| Homepage asset 404 fix | `content/homepage.ts` → `.svg` paths |
| Invoice PDF download | `backend/src/common/minimal-pdf.util.ts`, `billing.service.ts` |
| Mood PostgreSQL persistence | `prisma/schema.prisma`, migration `20260509140000_patient_mood_checkins`, `appointments.service.ts` |
| CORS (prior commit) | `backend/src/cors.config.ts`, `main.ts` |

---

## 11. Revision history

| Date | Notes |
|------|--------|
| 2026-05-09 | Initial Wave 19 capture from competitive gap review. |
| 2026-05-09 | Execution pass: Phase B code fixes, Wave 7 reconciliation, checklists updated; Phase A/C items left open where legal/staging/enterprise. |
