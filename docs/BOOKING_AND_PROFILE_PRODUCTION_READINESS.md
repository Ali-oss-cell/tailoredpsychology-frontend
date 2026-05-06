# Booking, referrals, clinician profiles — production readiness

This document consolidates **repository findings**, **intended workflows**, **gaps**, **DRY/shared-model notes**, and **Australian regulatory touchpoints** (high level — **not legal advice**). Confirm Medicare numbers, session caps, and retention rules with **current** Department of Health / Services Australia materials and qualified advisers before launch.

---

## 1. Executive summary

| Theme | Status |
|--------|--------|
| Patient booking → slot → `booking_requests` | Wired (`POST /booking-requests`, `referralDocumentId` optional). |
| Referral PDF upload → link to booking | Wired (`POST /documents/referrals` → `documentId` → submit with `referralDocumentId`). |
| Ops/psych referral **review queue** | Exists in `ResourcesService` + Prisma `referral_documents` when DB enabled. |
| **Clinician choice UX** (cards: photo, specialties, bio) | **Improved**: availability API returns `specialties`, `bio`, `profileImageUrl` (DB or seed portrait fallbacks for `clinician_00*`); booking UI matches `CLINICIAN_PORTRAIT_URLS` when offline. |
| **Single source of truth** for “bookable clinicians” | **Operational ids** (`clinician_*`) remain the scheduling key; profile fields load from DB via `clinician_*` ↔ `user_psychologist_*` mapping. |
| Psychologist **bio / profile image** | **Persisted** in `psychologist_profile_bio` when database enabled (see `PsychologistNotesService`). |
| Demo patient wiring | Intake draft sync prefers **`auth/me`** patient id when available; demo id remains fallback when auth not resolved. |

---

## 2. Data inventory — doctors (psychologists)

### 2.1 Database / Prisma

| Field / model | Purpose |
|----------------|---------|
| `users` | `display_name`, `email`, `role`, … |
| `psychologist_profiles` | `registration_number`, `provider_number`, `specialties[]`, `status` |
| `psychologist_profile_bio` | `bio`, `profile_image_url` |

### 2.2 Backend APIs

| Surface | Fields exposed |
|---------|----------------|
| `GET /appointments/clinicians/availability` | `clinicianId`, `clinicianName`, `slots`, optional **`specialties`**, **`bio`**, **`profileImageUrl`** from DB when enabled. |
| `GET /appointments/patients/me/care-team` | Includes optional **`bio`**, **`profileImageUrl`** when present. |
| Psychologist `GET/PUT` profile | Full DTO; bio/image persisted via Prisma when DB enabled. |

### 2.3 Frontend

| Location | Behaviour |
|----------|-----------|
| Booking wizard — schedule step | Merges API fields with **`content/patient-booking.ts`** fallbacks per `clinicianId`; optional thumbnail when `profileImageUrl` set. |
| `/patient/my-clinician` | Can show image + bio when API returns them. |

---

## 3. Referral + booking workflow

1. Optional **referral upload** → `POST /documents/referrals` → `documentId`.
2. **Booking submit** may include `referralDocumentId` → stored on `booking_requests`.
3. **Medicare / MHTP** eligibility is **not** adjudicated from the PDF in software — ops review + external rules apply.

---

## 4. Australian orientation (not legal advice)

| Topic | Pointer |
|--------|---------|
| **Privacy Act & APPs** | OAIC APP Guidelines; health privacy guide — collection, use/disclosure, security. |
| **Better Access / MBS** | Use dated official Health / Services Australia materials for session caps and referral rules. |
| **Ahpra** | Registration numbers are verifiable on the public Ahpra register. |

---

## 5. Implementation references

- Booking schedule UI: `frontend/components/patient/booking/clinician-booking-option-card.tsx` → wraps shared `frontend/components/shared/clinician-public-profile-header.tsx`
- Booking wizard: `frontend/components/patient/booking/booking-wizard.tsx`, `frontend/src/patient/booking/api.ts`
- Care team page: `frontend/app/patient/my-clinician/page.tsx` (same shared header)
- Availability: `backend/src/modules/appointments/appointments.service.ts`
- Care team API: `getPatientCareTeam` in `appointments.service.ts`
- Profile persistence: `backend/src/modules/psychologist-notes/psychologist-notes.service.ts`
- API contract: `backend/docs/API_CONTRACT.md`, `backend/docs/API_CONTRACT_MATRIX.md`
- Data layer: `backend/docs/DATA_AND_RELATIONSHIPS.md`

---

*Update this doc when behaviour changes.*
