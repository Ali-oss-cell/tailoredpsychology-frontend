# Security, Retention, and NDB Runbook — DRAFT (N6 + N7)

**Date:** 2026-05-06  
**Status:** Draft operational baseline — pending counsel/ops formal sign-off

---

## Ownership

| Function | Primary owner | Secondary owner | SLA |
|---|---|---|---|
| Security incident triage | Ops Lead | Engineering Lead | Acknowledge within 1 hour of detection |
| NDB assessment decision | Privacy Officer (or delegated legal owner) | Product Lead | Initial eligibility assessment within 24 hours |
| Retention policy alignment | Engineering Lead | Legal Counsel | Policy-to-implementation review each release cycle |

## Trigger conditions

Escalate to incident workflow when any of the following occur:

- Unauthorized access to personal or health information.
- Suspected data exfiltration or credential compromise.
- Incorrect role access exposing another user's records.
- Failed deletion/retention control affecting regulated data.

## Triage flow

1. Confirm incident scope and affected systems.
2. Preserve logs/evidence and open incident record.
3. Contain access (revoke sessions/keys, block endpoints if required).
4. Classify severity and legal impact.
5. Start NDB eligibility assessment.

## NDB assessment workflow (AU)

1. Determine whether personal information is involved.
2. Assess likely serious harm risk.
3. Confirm whether remediation removed serious harm risk.
4. If eligible data breach threshold met:
   - notify OAIC
   - notify affected individuals as required.
5. Record timeline, rationale, and decision sign-off.

## Retention alignment checks

- Engineering source: see `04-retention-deletion-policy-summary.md` in this pack.
- Before release:
  - verify policy assumptions still match legal guidance
  - verify deletion/retention jobs and admin workflows reflect policy
  - record approval date and approver in release notes.

## Evidence and records

- Incident register entry with timestamps and owners.
- NDB decision record (eligible/non-eligible with rationale).
- Post-incident corrective actions with due dates.

---

**Counsel:** Please confirm this workflow is adequate for Tailored Psychology Pty Ltd or provide revisions.
