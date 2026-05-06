# Psychologist new-patient / pre-session workflow (implementation plan)

This document tracks what we shipped and what remains optional. It is **not** legal or clinical advice; it describes product behaviour aligned with common Australian expectations around minimum necessary use of health information.

## Phase 1 — Access control (done)

- **Psychologist intake read scope**: `GET /api/patients/:id/intake-latest` (and related patient-clinical reads that used the same gate: journey timeline, appointment list, mood check-ins) now require a **care relationship** for psychologists: at least one appointment where the clinician matches the logged-in psychologist (after `user_psychologist_*` → `clinician_*` mapping). Admin and practice manager retain broader read access; patients retain self-access.

## Phase 2 — Workspace accuracy (done)

- **Referral status** in `GET /psychologists/:id/pre-session-workspace` uses **`referral_documents.patient_id`** when the database is enabled. Stub/in-memory mode does not model referrals in SQL; items stay `missing_referral` unless extended later.
- **Actions** continue to include `check_referral` only when referral status is `missing_referral`.

## Phase 3 — My Patients UX (done)

- **`/psychologist/patients`**: badges for **Prep needed** (any workspace item with non-empty `actions` for that patient) and **No completed visits yet** (heuristic: zero completed sessions with this psychologist for that patient). Rows sort by prep first, then first-visit heuristic, then soonest next session.

## Phase 4 — Patient detail (done)

- **Pre-session checklist** from workspace items for that patient (upcoming sessions, merged suggested actions).
- **Intake summary** card: selective fields from `intake-latest` (no raw JSON dump) for preparation context.

## Phase 5 — Dashboard (done)

- **Pre-session workspace** card description includes a count of items that still have open prep actions.

## Optional follow-ups

- **Referrals in stub mode**: mirror in-memory referral state into workspace referral flags if a non-DB story is required.
- **Second psychologist in DB seeds**: e2e that asserts `403` for a psychologist without a relationship is conditional when `psychologist2@clink.test` exists (in-memory stub only today).
- **Referral PDF download** for assigned clinician: confirm against ops/API; add endpoint if product requires direct download from psychologist UI.
