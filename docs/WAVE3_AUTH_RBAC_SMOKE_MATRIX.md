# Wave 3 Auth + RBAC Smoke Matrix (N1 + N2)

Date: 2026-05-04  
Scope: quick confidence pass for production auth path assumptions and 4-role route gating.

## Method

- Static review of frontend auth flow (`frontend/src/auth/api.ts`, `frontend/app/login/page.tsx`, `frontend/app/register/page.tsx`).
- Static review of role route restrictions and permission maps (`frontend/src/routes/route-config.ts`, `frontend/src/auth/access-control.ts`, `frontend/src/auth/session.ts`).
- This pass does **not** replace live staging/API login and route access tests.

## Auth path check (N1)

| Check | Result | Notes |
|---|---|---|
| Backend auth endpoint usage (`auth/login`, `auth/register`) | Pass | Calls go through `NEXT_PUBLIC_API_BASE_URL` with `http://localhost:3001/api` fallback. |
| Role-based post-login redirect | Pass | Uses `getDefaultRouteForRole()` with role cookie set on successful auth. |
| Demo/stub login copy in production | Pass | Demo credentials block only renders when `process.env.NODE_ENV === "development"`. |
| Terms + privacy acceptance visibility at registration | Pass | Register checkbox now links to `/terms-of-service` and `/privacy-policy`. |

## RBAC smoke matrix (N2)

| Role | Expected primary landing route | Route rule status | Permission map status |
|---|---|---|---|
| Patient | `/patient/dashboard` | Pass | Pass (`patient.portal.read`, `patient.booking.create`) |
| Psychologist | `/psychologist/dashboard` | Pass | Pass (`psychologist.portal.read`) |
| Practice manager | `/manager/dashboard` | Pass | Pass (`manager.portal.read`) |
| Admin | `/admin/dashboard` | Pass | Pass (`admin.portal.read` + manager/admin shared perms) |

## Must-fix blockers found

1. **Live auth verification pending**: no staging/API runtime test executed in this pass (required before release).
2. **Cookie hardening review pending**: role cookie is set client-side without explicit `Secure` flag; confirm production cookie strategy in server/session design.
3. **Legal approval pending**: legal pages are wired, but counsel sign-off remains open in `frontend/docs/LEGAL_SIGNOFF_TRACKER.md`.

## Release-ready next checks

- Run staging smoke with real accounts for patient/psychologist/manager/admin login and route access.
- Verify unauthorized-role route attempts redirect or deny as expected across protected pages.
- Confirm final production session/cookie strategy with backend auth owners.

---

## Wave 4 executable runtime smoke script

### Preconditions

- Frontend runtime available (`/login` responds).
- Backend auth runtime available for real login/register flow.
- Four test users exist (or can be created) for roles: patient, psychologist, practice manager, admin.
- Route guard source: `frontend/proxy.ts`.

### Test cases

| ID | Scenario | Steps | Expected result | N-item |
|---|---|---|---|---|
| W4-AUTH-01 | Patient login route | Login with patient user | Redirect to `/patient/dashboard` | N1/N2 |
| W4-AUTH-02 | Psychologist login route | Login with psychologist user | Redirect to `/psychologist/dashboard` | N1/N2 |
| W4-AUTH-03 | Manager login route | Login with manager user | Redirect to `/manager/dashboard` | N1/N2 |
| W4-AUTH-04 | Admin login route | Login with admin user | Redirect to `/admin/dashboard` | N1/N2 |
| W4-RBAC-01 | Patient blocked from admin | As patient, open `/admin/dashboard` | Redirect to role default route | N2 |
| W4-RBAC-02 | Psych blocked from patient routes | As psychologist, open `/patient/dashboard` | Redirect to role default route | N2 |
| W4-RBAC-03 | Manager blocked from admin-only routes | As manager, open `/admin/dashboard` | Redirect to `/manager/dashboard` | N2 |
| W4-RBAC-04 | Admin allowed to manager shared route | As admin, open `/manager/dashboard` | Route allowed | N2 |
| W4-RBAC-05 | Auth page guard for signed-in users | As patient, open `/login` | Redirect to `/patient/dashboard` | N1/N2 |
| W4-JOURNEY-01 | Patient core journey | Register/login -> `/patient/book-appointment` -> create request -> appointment visible -> open `/video-session/:appointmentId` shell | End-to-end path works or blocker logged | N8 |

### Evidence capture template

| Test ID | Result (`Pass`/`Fail`/`Blocked`) | Evidence | Blocker severity | Notes |
|---|---|---|---|---|
| W4-AUTH-01 |  |  |  |  |
| W4-AUTH-02 |  |  |  |  |
| W4-AUTH-03 |  |  |  |  |
| W4-AUTH-04 |  |  |  |  |
| W4-RBAC-01 |  |  |  |  |
| W4-RBAC-02 |  |  |  |  |
| W4-RBAC-03 |  |  |  |  |
| W4-RBAC-04 |  |  |  |  |
| W4-RBAC-05 |  |  |  |  |
| W4-JOURNEY-01 |  |  |  |  |

## Wave 4 execution results

### How to re-run (local)

1. Free ports **3000** (Next) and **3001** (Nest), and remove a stale Next dev lock if needed: `rm -f frontend/.next/dev/lock`.
2. Start API + web (from repo root): `npm run start:dev --prefix backend` and `npm run dev --prefix frontend` (or `npm run dev` which runs both).
3. Run: `node scripts/wave4-runtime-smoke.mjs`  
   - Optional: `SKIP_WEB=1` to run API checks only.  
   - Env: `API_BASE`, `WEB_BASE` override defaults `http://127.0.0.1:3001/api` and `http://127.0.0.1:3000`.
4. Optional auto-doc update (writes latest run table into this file): `npm run smoke:wave4:update`

### Staging command block

Use this exactly (from repo root), replacing the endpoint URLs:

```bash
API_BASE="https://<staging-api-host>/api" \
WEB_BASE="https://<staging-web-host>" \
npm run smoke:wave4
```

If you want the script to refresh this document automatically after the run:

```bash
API_BASE="https://<staging-api-host>/api" \
WEB_BASE="https://<staging-web-host>" \
UPDATE_DOC=1 \
node scripts/wave4-runtime-smoke.mjs
```

Staging account prep and closure checklist:

- `frontend/docs/WAVE5_STAGING_SMOKE_PREP_CHECKLIST.md`

**Next.js 16 note:** edge routing uses [`frontend/proxy.ts`](../proxy.ts) only. Do **not** add a separate `middleware.ts` that re-exports it — Next reports *“Both middleware file … and proxy file … are detected”* and the dev server can crash.

### Jest evidence (still valuable)

- `npm --prefix frontend run test:ci -- app/manager/dashboard/page.test.tsx app/admin/dashboard/page.test.tsx app/patient/my-clinician/page.test.tsx app/psychologist/notes/page.test.tsx` — **Pass** (4 suites).
- `npm --prefix frontend run test:ci -- app/patient/data-requests/page.test.tsx app/patient/recordings/page.test.tsx app/psychologist/profile/page.test.tsx app/admin/security-incidents/page.test.tsx app/admin/privacy-requests/page.test.tsx app/admin/data-deletion/page.test.tsx` — **Pass** (6 suites).

### Live run — 2026-05-04 (API + Next + curl)

Automated script output (`node scripts/wave4-runtime-smoke.mjs`) after starting Nest on **3001** and Next on **3000**:

| Test ID | Result | Evidence | Blocker severity | Notes |
|---|---|---|---|---|
| W4-AUTH-01 | **Pass** | `POST /api/auth/login` patient@clink.test → `200`, `user.role=patient` | — | Stub/demo users; matches dev login copy. |
| W4-AUTH-02 | **Pass** | `POST /api/auth/login` psychologist@clink.test → `200`, role `psychologist` | — |  |
| W4-AUTH-03 | **Pass** | `POST /api/auth/login` manager@clink.test → `200`, role `practice_manager` | — |  |
| W4-AUTH-04 | **Pass** | `POST /api/auth/login` admin@clink.test → `200`, role `admin` | — |  |
| W4-RBAC-01 | **Pass** | Patient bearer `GET /api/admin/ops/appointments` → **403** | — | Server-side RBAC. |
| W4-RBAC-02 | **Pass** | Psych bearer `GET /api/patients/user_patient_002/appointments` → **403** | — | No care relationship. |
| W4-RBAC-03 | **Pass** | Manager bearer `GET /api/admin/ops/appointments` → **403** | — |  |
| W4-RBAC-04 | **Pass** | Admin bearer `GET /api/patients/user_patient_001/appointments` → **200** | — | Shared clinical read. |
| W4-RBAC-05 | **Pass** | `curl -sI` patient cookie on `/login` → **307** → `…/patient/dashboard` | — | Next [`proxy.ts`](../proxy.ts) guest/auth behaviour. |
| W4-JOURNEY-01 | **Pass** | `GET …/clinicians/availability` OK; `POST /booking-requests` → **201** (retries slots on **409**); booking + analytics IDs use **UUID-style** values when PostgreSQL is on (`allocateBookingRequestId`, `AnalyticsService.recordEvent`); `GET /api/appointments/{appt_*}` **200** for created row | — | Re-run `npm run smoke:wave4` after deploy to refresh dated evidence. |

**Next edge (curl, same run)**

| Check | Result | Evidence |
|---|---|---|
| Guest → `/patient/dashboard` | **Pass** | **307** → `/login?redirect=%2Fpatient%2Fdashboard` |
| Patient cookie → `/admin/dashboard` | **Pass** | **307** → `/patient/dashboard` (role redirect) |
| Patient cookie → `/login` | **Pass** | **307** → `/patient/dashboard` |
| Patient cookie → `/video-session/appt_open_001` | **Pass** | **200** (join shell HTML; Twilio still required in-browser) |

### Follow-ups

- **Cookie/session hardening:** implemented in Wave 5 as backend-set HttpOnly `clink_role` with `sameSite=lax` and production `secure`; confirm final production domain/SSL behavior on staging.

## Latest automated run (auto-managed)

<!-- W4_LATEST_RESULTS_START -->

_Last auto-update: `2026-05-06T08:39:21.320Z`_

| Test ID | Result (`Pass`/`Fail`/`Blocked`) | Evidence | Blocker severity | Notes |
|---|---|---|---|---|
| W4-AUTH-01 | Pass | role=patient | — | Automated run passed |
| W4-AUTH-02 | Pass | role=psychologist | — | Automated run passed |
| W4-AUTH-03 | Pass | role=practice_manager | — | Automated run passed |
| W4-AUTH-04 | Pass | role=admin | — | Automated run passed |
| W4-RBAC-01 | Pass | status=403 | — | Automated run passed |
| W4-RBAC-02 | Pass | status=403 | — | Automated run passed |
| W4-RBAC-03 | Pass | status=403 | — | Automated run passed |
| W4-RBAC-04 | Pass | status=200 | — | Automated run passed |
| W4-RBAC-05 | Pass | status=307 | — | Automated run passed |
| W4-JOURNEY-01 | Pass | booking=201, list=200, details=200 | — | Automated run passed |

```json
{
  "W4-AUTH-01": {
    "pass": true,
    "role": "patient"
  },
  "W4-AUTH-02": {
    "pass": true,
    "role": "psychologist"
  },
  "W4-AUTH-03": {
    "pass": true,
    "role": "practice_manager"
  },
  "W4-AUTH-04": {
    "pass": true,
    "role": "admin"
  },
  "W4-RBAC-01": {
    "pass": true,
    "status": 403
  },
  "W4-RBAC-02": {
    "pass": true,
    "status": 403
  },
  "W4-RBAC-03": {
    "pass": true,
    "status": 403
  },
  "W4-RBAC-04": {
    "pass": true,
    "status": 200
  },
  "W4-JOURNEY-01": {
    "pass": true,
    "bookingStatus": 201,
    "listStatus": 200,
    "bookingRequestId": "br_3155740e48154eed9a31f433ccade106",
    "upcomingCount": 6,
    "pastCount": 8,
    "idempotentReplay": false,
    "appointmentDetailsStatus": 200,
    "appointmentDetailsOk": true,
    "directAppointmentOk": true,
    "bookingWriteOk": true,
    "bookingWriteNote": "ok"
  },
  "WEB_probe": {
    "base": "http://127.0.0.1:3000",
    "skip": false
  },
  "WEB_guest_patient_dashboard": {
    "status": 307,
    "location": "http://127.0.0.1:3000/login?redirect=%2Fpatient%2Fdashboard"
  },
  "WEB_W4-RBAC-01": {
    "status": 307,
    "location": "http://127.0.0.1:3000/patient/dashboard"
  },
  "WEB_W4-RBAC-05": {
    "status": 307,
    "location": "http://127.0.0.1:3000/patient/dashboard"
  },
  "W4-RBAC-05": {
    "pass": true,
    "status": 307,
    "location": "http://127.0.0.1:3000/patient/dashboard"
  },
  "WEB_video_session_shell": {
    "status": 200,
    "location": null
  }
}
```

<!-- W4_LATEST_RESULTS_END -->
