# Wave 5 Staging Smoke Prep Checklist (Track D)

Purpose: unblock `smoke:wave4` on staging with real role accounts and capture evidence for N1/N2/N8 closure.

## 1) Required staging inputs

- `API_BASE` (example: `https://staging-api.example.com/api`)
- `WEB_BASE` (example: `https://staging.example.com`)
- Four real test users with passwords:
  - patient
  - psychologist
  - practice manager
  - admin

## 2) Account readiness checks (before running smoke)

- [ ] All four users can authenticate through staging `/auth/login`.
- [ ] Role assignments are correct (`patient`, `psychologist`, `practice_manager`, `admin`).
- [ ] Patient user has at least one expected appointment-visible path.
- [ ] Booking endpoint enabled and writable for patient role in staging.
- [ ] Staging TLS/domain setup supports secure cookies (`Secure`, `SameSite=Lax`) and app routing.

## 3) Run commands

API + web smoke (includes Wave 20 CORS, join token, invoice PDF):

```bash
API_BASE="https://<staging-api-host>/api" \
WEB_BASE="https://<staging-web-host>" \
CORS_ORIGIN="https://<staging-web-host>" \
npm run smoke:wave20
```

API + web smoke with auto-doc update:

```bash
API_BASE="https://<staging-api-host>/api" \
WEB_BASE="https://<staging-web-host>" \
UPDATE_DOC=1 \
node scripts/wave4-runtime-smoke.mjs
```

## 4) Evidence requirements for closure

- [ ] `W4-AUTH-01..04` all `Pass`.
- [ ] `W4-RBAC-01..05` all `Pass`.
- [ ] `W4-JOURNEY-01` `Pass` with `bookingWriteOk: true`.
- [ ] One manual/browser note confirms real media join path for `/video-session/:appointmentId` (Twilio/session token path), not only shell HTML.

## 5) Post-run documentation updates

- [ ] Verify `frontend/docs/WAVE3_AUTH_RBAC_SMOKE_MATRIX.md` latest auto-managed section updated.
- [ ] Update `frontend/docs/CORE_PLATFORM_DEEP_CHECK.md` N1/N8 notes with staging date and result summary.
- [ ] If any check fails, record blocker severity and owner/date.
