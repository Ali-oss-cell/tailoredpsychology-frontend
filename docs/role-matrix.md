# Clink Role Matrix

This matrix defines route access and guard behavior for all major route families.
Source of truth for enforcement is `src/routes/AppRoutes.tsx`.

## Roles

- `guest` (not authenticated)
- `patient`
- `psychologist`
- `practice_manager`
- `admin`

## Guard Types

- `Public`: no auth required
- `AuthOnly`: guest-only (authenticated users redirect)
- `ProtectedRoute`: requires auth and allowed role(s)

## Access Matrix

| Route family / URL pattern | Guard type | guest | patient | psychologist | practice_manager | admin | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| Public marketing (`/`, `/about`, `/services`, `/why-clink`, `/pricing`, `/trust`, `/conditions`, `/conditions/:slug`, `/telehealth-requirements`, `/privacy-policy`, `/resources`, `/contact`, `/get-matched`, `/medicare-rebates`) | Public | ✅ | ✅ | ✅ | ✅ | ✅ | Public content only |
| Auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`) | AuthOnly | ✅ | ↪️ | ↪️ | ↪️ | ↪️ | Logged-in users redirect away |
| Patient portal (`/patient/*`) | ProtectedRoute | ❌ | ✅ | ❌ | ❌ | ❌ | Includes dashboard, appointments, **my clinician** (care team from appointments), account, invoices, resources, data requests |
| Booking flow (`/appointments/book-appointment`) | ProtectedRoute | ❌ | ✅ | ❌ | ❌ | ❌ | Patient telehealth-first intake with referral PDF upload, consent/review, and live next-available indicators |
| Psychologist portal (`/psychologist/dashboard`, `/psychologist/schedule`, `/psychologist/patients`, `/psychologist/patients/:patientId`, `/psychologist/notes`, `/psychologist/profile`, `/psychologist/recordings`) | ProtectedRoute | ❌ | ❌ | ✅ | ❌ | ❌ | Clinical portal pages (live caseload, scoped referrals, patient export actions) |
| Manager portal core (`/manager/dashboard`, `/manager/staff`, `/manager/patients`, `/manager/appointments`, `/manager/billing`) | ProtectedRoute | ❌ | ❌ | ❌ | ✅ | ✅ | Admin shares manager core ops routes |
| Manager referrals (`/manager/referrals`) | ProtectedRoute | ❌ | ❌ | ❌ | ✅ | ✅ | Requires `referrals.verify`; manager primary referral queue |
| Manager privacy requests (`/manager/privacy-requests`) | ProtectedRoute | ❌ | ❌ | ❌ | ✅ | ✅ | Requires `privacy.requests.manage`; access/correction triage queue |
| Manager resources (`/manager/resources`) | ProtectedRoute | ❌ | ❌ | ✅ | ✅ | ✅ | Shared content management route |
| Admin-only core (`/admin/dashboard`, `/admin/users`, `/admin/appointments`, `/admin/patients`, `/admin/staff`, `/admin/billing`, `/admin/settings`, `/admin/analytics`, `/admin/audit-logs`, `/admin/security-incidents`) | ProtectedRoute | ❌ | ❌ | ❌ | ❌ | ✅ | System-wide admin controls, including breach register |
| Admin shared privacy/referrals (`/admin/data-deletion`, `/admin/referrals`, `/admin/privacy-requests`) | ProtectedRoute | ❌ | ❌ | ❌ | ✅ | ✅ | Shared with practice manager; includes privacy access/correction triage queue |
| Admin resources (`/admin/resources`) | ProtectedRoute | ❌ | ❌ | ✅ | ✅ | ✅ | Shared content management route |
| Shared recordings (`/recordings`) | ProtectedRoute | ❌ | ✅ | ✅ | ✅ | ✅ | Uses role-specific shell where needed |
| Patient recordings (`/patient/recordings`) | ProtectedRoute | ❌ | ✅ (owner patient) | ❌ | ❌ | ❌ | Lists patient-owned session videos only |
| Shared video session (`/video-session/:appointmentId`) | ProtectedRoute | ❌ | ✅ | ✅ | ✅ | ✅ | Twilio session room |
| Unknown route (`*`) | Public fallback | ✅ | ✅ | ✅ | ✅ | ✅ | 404 view with home link |

Legend:
- `✅` allowed
- `❌` denied
- `↪️` redirected (already authenticated on AuthOnly pages)

## Enforcement Rules

1. Route access must be enforced at route level via `ProtectedRoute` (not only hidden in UI).
2. Any role not explicitly listed for a protected route is denied.
3. If route access changes, update both:
   - `src/routes/AppRoutes.tsx`
   - `docs/role-matrix.md`

## UI Consistency Rule (shadcn/ui)

For every allowed route above, implement screen UI using shared shadcn/ui patterns:

- Shared shell per area (Public, Patient, Psychologist, Manager/Admin)
- Standard page header block (title, subtitle, primary actions)
- Consistent `Card`, `Table`, `Form`, `Dialog`, `Tabs`, `Badge`, `Alert`
- Consistent loading / empty / error states
- No one-off custom controls when equivalent shadcn/ui primitive exists
