# Wave 13: Compliance and Clinical Governance Hardening

This wave closes regulatory and clinical-governance gaps after Waves 11 and 12, with focus on AU health privacy, clinical safety, and auditability.

Primary references:

- `frontend/docs/PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md` (AU law map, product gaps, privacy policy checklist)
- `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`
- `backend/docs/API_CONTRACT.md`
- `backend/docs/API_CONTRACT_MATRIX.md`

---

## Scope

### In scope

- Informed consent lifecycle (versioning, renewal, withdrawal).
- Clinical note minimum dataset enforcement.
- Legal hold and break-glass access governance.
- Data breach/NDB response workflow foundations.
- Patient data access/correction workflow.
- Session video governance hardening.

### Out of scope (defer)

- Full legal automation and external regulator integrations.
- AI clinical summarization governance framework.

---

## Wave 13 Tickets

## W13A-01 Consent Lifecycle Contract (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend
- **Status:** Backlog
- **Files:**
  - `backend/src/modules/consents/*` (new/expanded)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `frontend/src/patient/*`
- **Endpoints (new/expanded):**
  - `POST /api/consents`
  - `POST /api/consents/withdraw`
  - `GET /api/patients/:id/consents`
- **Output:**
  - versioned consent records with timestamp + actor.
  - explicit withdrawal records and reason.
  - re-consent triggers for significant policy/treatment changes.
- **Tests required:**
  - consent version/withdrawal transition tests.
  - role ownership tests for consent reads.

## W13A-02 Clinical Notes Minimum Dataset Enforcement (P0)

- **Priority:** P0
- **Owner:** Backend + Clinical + Frontend
- **Status:** Backlog
- **Files:**
  - `backend/src/modules/psychologist-notes/*`
  - `frontend/components/psychologist/notes/*`
- **Output:**
  - required fields before sign-off: session date, service type, presenting issues/summary, risk assessment, plan, clinician signature.
  - signed notes immutable except amendment flow.
- **Tests required:**
  - sign-off rejection tests when required fields missing.
  - amendment and immutability tests.

## W13B-01 Legal Hold + Break-Glass Access (P0)

- **Priority:** P0
- **Owner:** Backend + Security
- **Status:** Backlog
- **Files:**
  - `backend/src/modules/users/*`
  - `backend/src/modules/audit/*`
  - `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`
- **Output:**
  - legal-hold enforcement integrated with deletion/purge and export flows.
  - break-glass endpoint/flag with mandatory justification and strict audit eventing.
- **Tests required:**
  - purge blocked under legal hold.
  - break-glass access denied without reason; audited when granted.

## W13B-02 Data Breach + NDB Workflow Foundation (P1)

- **Priority:** P1
- **Owner:** Backend + Security + Ops
- **Status:** Done
- **Files:**
  - `backend/src/modules/security-incidents/*` (new)
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `frontend/app/admin/security-incidents/page.tsx`
  - `frontend/src/admin/security-incidents/api.ts`
- **Endpoints (new):**
  - `POST /api/admin/security-incidents`
  - `GET /api/admin/security-incidents`
  - `PATCH /api/admin/security-incidents/:id`
- **Output:**
  - incident register with severity/status/impact.
  - notifier workflow states to support NDB process handling.
- **Tests required:**
  - admin-only controls.
  - incident state transition tests.

## W13C-01 Patient Access and Correction Requests (P1)

- **Priority:** P1
- **Owner:** Backend + Frontend
- **Status:** Done
- **Files:**
  - `backend/src/modules/auth/patient-data-requests.*`
  - `backend/src/modules/auth/dto/create-patient-data-request.dto.ts`
  - `backend/src/modules/auth/dto/patient-data-request.dto.ts`
  - `backend/src/modules/auth/dto/patient-data-request-action.dto.ts`
  - `backend/migrations/1714214700000_patient-data-requests.js`
  - `frontend/src/privacy-requests/api.ts`
  - `frontend/app/patient/data-requests/page.tsx`
  - `frontend/app/admin/privacy-requests/page.tsx`
  - `frontend/app/manager/privacy-requests/page.tsx`
- **Endpoints (new):**
  - `POST /api/patients/me/data-requests`
  - `GET /api/patients/me/data-requests`
  - `GET /api/patients/me/data-requests/:id`
  - `GET /api/admin/patient-data-requests`
  - `POST /api/admin/patient-data-requests/:id/actions`
- **Output:**
  - patient-visible request tracking for access/correction actions.
  - operational triage queue for admin/compliance handling.
- **Tests required:**
  - ownership, status, and SLA timestamp tests.

## W13D-01 Session Video Governance Hardening (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend + Security
- **Status:** Done
- **Files:**
  - `backend/src/modules/psychologist-notes/*`
  - `frontend/app/psychologist/recordings/page.tsx`
  - `frontend/app/patient/recordings/page.tsx`
  - `frontend/src/psychologist/videos/api.ts`
- **Output:**
  - short-lived playback URLs only.
  - optional watermark metadata (viewer/time/session).
  - retention class alignment (`active`, `hold`, `purge_pending`) with patient lifecycle.
  - download policy controls by role.
- **Tests required:**
  - ownership/assignment video access tests.
  - expired token and revoked access tests.

## W13E-01 Compliance Documentation and QA Closure (P0)

- **Priority:** P0
- **Owner:** Backend + Frontend + Compliance
- **Status:** Backlog
- **Files:**
  - `backend/docs/API_CONTRACT.md`
  - `backend/docs/API_CONTRACT_MATRIX.md`
  - `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`
  - `frontend/docs/PROJECT_CLOSURE_CHECKLIST.md`
- **Output:**
  - all governance contracts documented and cross-linked.
  - production readiness notes for legal/compliance sign-off.
- **Tests required:**
  - full wave lint/tests/typecheck green.

---

## Strict Execution Order (Wave 13)

1. `W13A-01` consent lifecycle.
2. `W13A-02` notes minimum dataset.
3. `W13B-01` legal hold + break-glass.
4. `W13D-01` session video governance hardening.
5. `W13C-01` patient access/correction requests.
6. `W13B-02` data breach/NDB workflow foundation.
7. `W13E-01` docs + QA closure.

---

## Definition of Done (Wave 13)

- Consent lifecycle is versioned and enforceable.
- Signed psychologist notes meet minimum clinical dataset requirements.
- Legal hold and break-glass policies are implemented and audited.
- Session video access is hardened with secure tokenized controls and lifecycle alignment.
- Patient access/correction requests are operational.
- Compliance docs and test suites are complete and green.

