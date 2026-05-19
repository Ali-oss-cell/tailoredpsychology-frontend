# Wave 21: Experience completeness (A → Z)

**Audience:** Product and engineering closing the gap between “solid v1 portal” and “mature AU telehealth/PMS feel” without claiming Halaxy-class scope.

**Date:** 2026-05-19  
**Status:** In progress — engineering slices ship in order; legal/integrations stay honestly scoped.

---

## How to read this vs your competitive map

| Your gap theme | Honest status before Wave 21 | Wave 21 action |
|----------------|------------------------------|----------------|
| Real invoice PDFs | **Done** (Wave 19) | **Durable DB invoices** when PostgreSQL on |
| Rich patient profile | **Mostly done** (contact + emergency in UI + DB) | Address fields optional Phase 21B |
| Patient journey timeline | **Partial** (dashboard API + card exist) | Surface on appointments; billing step |
| Password reset | **UI shell only** | **Wire forgot/reset APIs** |
| Psychologist caseload | **Done** (API-backed list) | Polish only |
| Admin ops tabs | **Done** (admin/ops APIs) | Harden DTOs over time |
| Telehealth BR-301/302 | **Deferred** (clinical waiver) | Unchanged unless counsel reopens |
| Pre-session chat T-30 | **DB windows exist** | Verify UX matches; doc reconcile |
| Consent versioning | **Partial** (`patient_consents`, reconsent) | Expose history in account (21C) |
| Legal sign-off | **Open** | Process — `LEGAL_SIGNOFF_TRACKER.md` |
| Integrations (Xero, Medicare claim) | **Out of scope** | Honest “not wired” copy |
| Full rostering / SMS at scale | **Out of scope** | Partner or Phase C |

---

## Execution phases

### Phase 21A — Auth & money (this pass)

- [x] **21A-1** — `POST /auth/forgot-password` + `POST /auth/reset-password` (token store; dev reset URL).
- [x] **21A-2** — Forgot / reset password pages wired to API.
- [x] **21A-3** — `patient_invoices` table + billing list/download from PostgreSQL when enabled.
- [x] **21A-4** — Journey timeline on **Appointments** page; `invoice_downloaded` analytics step.

### Phase 21B — Profile & portal cohesion

- [ ] **21B-1** — Postal address on `patient_profiles` + account settings.
- [ ] **21B-2** — Consent version history visible on patient account.
- [ ] **21B-3** — Psychologist referral strip on patient profile (read-only).

### Phase 21C — Trust & enterprise depth

- [ ] **21C-1** — Counsel sign-off (N4/N5) — **not engineering**.
- [ ] **21C-2** — Staging A6 + Twilio media (WAVE20-S4/S5).
- [ ] **21C-3** — Expanded audit on billing + password reset (done in 21A for reset).
- [ ] **21C-4** — Integrations: product decision only.

---

## Verification

```bash
cd frontend && npm run smoke:wave20   # after API up
# Manual: /forgot-password → email → /reset-password?token=...
# Manual: /patient/billing → download PDF
```

---

## Revision history

| Date | Notes |
|------|--------|
| 2026-05-19 | Wave 21 opened; Phase 21A implementation started. |
