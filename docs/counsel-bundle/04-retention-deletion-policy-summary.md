# Retention and Deletion Policy — summary for counsel (N6)

**Full engineering document:** `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md` in the product repository.

This summary captures the **default operational baseline** pending legal sign-off.

---

## Policy baseline (AU)

Default operational baseline (until jurisdiction-specific legal sign-off overrides):

- **Adults:** retain records for **minimum 7 years** from last health service interaction.
- **Minors:** retain records until the person turns **25 years old**.
- **Legal/complaint hold:** retain beyond baseline when complaint, claim, investigation, or legal process exists.

Australian obligations can vary by jurisdiction and provider context. This policy must be reviewed with legal/compliance before enabling physical purge automation in production.

## Scope of data covered

Applies to patient-linked records including:

- account/profile data
- intake drafts and committed intake payloads
- booking requests and appointments
- session metadata
- psychologist notes linked to patient
- referral document metadata
- notifications and audit references involving patient identifiers
- session video metadata and access logs

## Lifecycle states (summary)

- **Active** — normal read/write by role
- **Soft deleted** — login blocked; data retained
- **Legal hold** — purge blocked regardless of age
- **Purge eligible** — passed retention age, no hold; still requires approval before deletion

---

**Counsel:** Please confirm the 7-year / age-25 baseline and scope are appropriate for Tailored Psychology Pty Ltd or specify revisions.
