# Wave-Aligned Patient Button Gap Audit

This document tracks patient-facing actions: what is wired, what is still a gap, and how it maps to wave work. Status labels:

- **In wave**: covered by existing wave tickets or backend contracts.
- **Not in wave**: no explicit ticket; add to a completion wave if product wants it.

## Recently resolved (verified in code)

- **Quick Actions** (`Book New Session`, `Message Clinic`, `View Invoices`): navigation and chat dispatch in [`quick-actions-card.tsx`](../components/patient/dashboard/quick-actions-card.tsx).
- **Upcoming Session** (`Join`, `Manage`): appointment APIs and shared manage UI via [`upcoming-session-card.tsx`](../components/patient/dashboard/upcoming-session-card.tsx) and [`appointment-manage-panel.tsx`](../components/patient/appointments/appointment-manage-panel.tsx).
- **My Appointments page** (`Manage`, status display): live list from `GET /api/patients/:id/appointments`, badges, and same manage panel in [`patient-appointments-section.tsx`](../components/patient/appointments/patient-appointments-section.tsx).
- **Account** (`Edit Profile`, `Change Password`, `Notifications`): [`patient-account-settings.tsx`](../components/patient/account/patient-account-settings.tsx) with auth profile/password and notification preference APIs.
- **Invoices** (`Download`): [`patient-invoices-section.tsx`](../components/patient/billing/patient-invoices-section.tsx) with billing list and download (placeholder `.txt` until real PDF storage).
- **Mood Check-in**: emoji actions and history via `GET`/`POST /api/patients/:id/mood-checkins` in [`mood-checkin-card.tsx`](../components/patient/dashboard/mood-checkin-card.tsx) (in-memory stub on backend).
- **Psychologist shell — Join Next Session**: resolves next workspace appointment in [`psychologist-join-next-session.tsx`](../components/psychologist/psychologist-join-next-session.tsx).

## Remaining gaps (product / infra)

These are not “dead buttons” on the patient shell, but follow-ups for a full product:

| Area | Gap | Suggested owner |
|------|-----|-----------------|
| Billing | Replace invoice download stub with stored PDFs (or generated PDFs) and durable invoice records | Backend + Frontend |
| Account / profile | Optional fields (phone, address, emergency contact) beyond display name | Both |
| Psychologist workspace | Replace demo `user_psychologist_001` → `clinician_001` mapping with real clinician–user linkage in DB | Backend |
| Mood | Persist mood check-ins in PostgreSQL when DB mode is on (today in-memory only) | Backend |

## Already functional (patient shell and flows)

- Sidebar: `Book New Appointment` (`/appointments/book-appointment`), `Logout` (`/logout`).
- Booking wizard: `Back`, `Continue`, `Submit Request` (wired).
- Referral upload: `Choose file`, `Remove` (wired to documents API).

## Recommended next tickets (optional cleanup wave)

Use a small **Patient self-service polish** bucket only for items above that you choose to schedule; retire obsolete `W10E-PatientUX-xx` placeholders that referred to already-shipped dashboard wiring.
