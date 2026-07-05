# Wave 20: Launch closure & staging verification

**Audience:** Engineering, ops, product — finish **Phase A** leftovers from [`WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md`](./WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md) and CORE **N1, N4–N8** items that are not pure counsel sign-off.

**Primary promise**

> Production and staging are **verifiable**: automated smoke covers auth, RBAC, booking, **Twilio join token**, **CORS**, and **invoice PDF**; legal/process items stay **honestly open** until counsel signs.

**Date:** 2026-05-19  
**Status:** Living document — update after each staging/production smoke run.

---

## Related docs

| Doc | Relevance |
|-----|-----------|
| [`WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md`](./WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md) | Phase A/B matrix; A2/A4/A6 open items |
| [`CORE_PLATFORM_DEEP_CHECK.md`](./CORE_PLATFORM_DEEP_CHECK.md) | N1–N9 checkboxes |
| [`WAVE5_STAGING_SMOKE_PREP_CHECKLIST.md`](./WAVE5_STAGING_SMOKE_PREP_CHECKLIST.md) | Staging credentials + evidence |
| [`WAVE3_AUTH_RBAC_SMOKE_MATRIX.md`](./WAVE3_AUTH_RBAC_SMOKE_MATRIX.md) | W4-* + W20-* latest results |
| [`LEGAL_SIGNOFF_TRACKER.md`](./LEGAL_SIGNOFF_TRACKER.md) | N4, N5 counsel approval |
| [`SECURITY_RETENTION_NDB_RUNBOOK.md`](./SECURITY_RETENTION_NDB_RUNBOOK.md) | N6, N7 formal approval |
| [`backend/deploy/README.md`](../../backend/deploy/README.md) | Deploy, migrate, env vars |

---

## 1. Goals

| ID | Goal | Success |
|----|------|---------|
| G1 | **Staging smoke repeatable** | One command with `API_BASE` / `WEB_BASE` + optional role env vars |
| G2 | **A6 / N8 evidence** | Join-session token + video shell probe recorded |
| G3 | **Production CORS verified** | Preflight returns allow-origin for site origin |
| G4 | **No false legal closure** | Counsel rows stay unchecked until approved |

---

## 2. Non-goals

- Counsel sign-off (N4, N5, N6, N7 formal approval) — product/legal owners.
- Phase C enterprise (Wave 19 §C).
- Full Twilio room media test in CI (manual browser note still required for A6).

---

## 3. Automated smoke (engineering)

From `frontend/` (backend on 3001 + frontend on 3000, or point at staging):

```bash
cd frontend
# Local default (127.0.0.1:3001 / 3000)domin
npm run smoke:wave20

# Staging / production API + web
API_BASE="https://api.tailoredpsychology.com.au/api" \
WEB_BASE="https://tailoredpsychology.com.au" \
CORS_ORIGIN="https://tailoredpsychology.com.au" \
SMOKE_PATIENT_EMAIL="patient@example.com" \
SMOKE_PATIENT_PASSWORD="..." \
npm run smoke:wave20

# Write latest W4 table into WAVE3 matrix
UPDATE_DOC=1 npm run smoke:wave20:update
```

**W20 checks (in addition to W4-AUTH/RBAC/JOURNEY):**

| ID | What |
|----|------|
| W20-CORS-01 | `OPTIONS` `/auth/login` with `Origin` → `Access-Control-Allow-Origin` + `credentials` |
| W20-JOIN-01 | `POST /appointments/:id/join-session` returns JWT + `roomName` for patient on upcoming appt |
| W20-INVOICE-01 | `GET /billing/invoices/:id/download` → `application/pdf` body |

---

## 4. Checklists

### 4.1 Engineering (this wave)

- [x] **W20-S1** — `smoke:wave20` script with CORS, join, invoice PDF probes.
- [x] **W20-S2** — Staging env vars documented in `backend/deploy/.env.example` + deploy README migrate step.
- [x] **W20-S3** — `LEGAL_SIGNOFF_TRACKER` entity name aligned to Tailored Psychology Pty Ltd.
- [ ] **W20-S4** — Staging smoke run with **real** role passwords (record date in WAVE3 matrix).
- [ ] **W20-S5** — Manual browser: join video room with real Twilio credentials (A6).

### 4.2 Phase A (Wave 19) — unchanged ownership

- [x] **A1** — CORS + cookies (Wave 19).
- [ ] **A2** — Counsel-approved privacy + terms.
- [x] **A3** — Honesty audit.
- [ ] **A4** — NDB/retention runbook formally signed.
- [x] **A5** — BR-301/302 deferral.
- [ ] **A6** — Full staging journey including **live** Twilio media (blocked on W20-S4/S5).

### 4.3 CORE need-to-have linkage

| CORE | Wave 20 action |
|------|----------------|
| N1 | SMTP mailer implemented; prod login verified (no demo copy); **pending backend deploy + SMTP env + email receipt test** |
| N4, N5 | Counsel pack ready (`COUNSEL_REVIEW_PACK.md`); **counsel sign-off open** |
| N6, N7 | Runbook + approval table; **formal sign-off open** |
| N8 | **Blocked:** prod smoke needs role credentials; manual journey + Twilio pending W20-S4/S5 |

---

## 5. Post-deploy commands (server)

```bash
cd /opt/clink/tailoredpsychology-backend/deploy
git pull && docker compose --env-file .env -f docker-compose.traefik.yml up -d --build
docker compose --env-file .env -f docker-compose.traefik.yml exec api npx prisma migrate deploy
```

Set in `.env`: `COOKIE_DOMAIN`, `CORS_ORIGINS` (if non-default), `TWILIO_*` for real video, **`SMTP_*`** for password reset (see deploy README §8).

---

## 6. Manual verification log (N8 / A6 / W20-S5)

Record each production browser run here. **Pass bar:** register → book → Stripe pay → appointment visible → **live Twilio A/V** (not shell-only).

| Date | Tester | Environment | Register | Book | Stripe pay | Appt visible | Invoice PDF | Twilio A/V | Appointment ID | Notes |
|------|--------|-------------|----------|------|------------|--------------|-------------|------------|----------------|-------|
| — | — | production | — | — | — | — | — | — | — | Pending: deploy SMTP backend, seed or use prod test users, run smoke W20-S4, then complete manual checklist |

### Manual checklist (production)

1. `/register` — account created; terms/privacy links work
2. `/patient/book-appointment` — wizard completes; Stripe Checkout opens
3. Stripe — payment succeeds; redirect back to app
4. `/patient/appointments` — new appointment listed
5. `/patient/invoices` — invoice + PDF download
6. `/video-session/:id` — Twilio connects with local camera/mic
7. Second participant (psychologist browser) — mutual A/V confirmed

---

## 7. Revision history

| Date | Notes |
|------|--------|
| 2026-07-05 | SMTP `MailService` for password reset; counsel pack + post-approval flags; prod CORS pass; prod smoke blocked on role credentials; manual verification log added. |
| 2026-05-19 | Wave 20: launch smoke script, deploy docs, legal tracker entity fix; A6/N8 remain staging-manual. |
