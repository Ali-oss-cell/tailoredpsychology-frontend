# Counsel review pack (N4, N5, N6, N7)

**Prepared:** 2026-07-05  
**Status:** Ready to route to legal counsel  
**Owner:** Product Lead

---

## Purpose

Single bundle for counsel to review public legal pages and operational security/retention/NDB baseline before production publication.

---

## Documents in scope

| ID | Document | Live URL / path |
|----|----------|-----------------|
| N4 | Privacy policy copy | [`content/legal/privacy-policy-au.ts`](../content/legal/privacy-policy-au.ts) → `/privacy-policy` |
| N5 | Terms of Service copy | [`content/legal/terms-of-service-au.ts`](../content/legal/terms-of-service-au.ts) → `/terms-of-service` |
| N6 | Security + retention alignment | [`SECURITY_RETENTION_NDB_RUNBOOK.md`](./SECURITY_RETENTION_NDB_RUNBOOK.md) + [`backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`](../../backend/docs/RETENTION_AND_DELETION_POLICY_AU.md) |
| N7 | NDB / breach runbook | Same as N6 (`SECURITY_RETENTION_NDB_RUNBOOK.md`) |

---

## What counsel should return

1. **Approved or redlined** privacy policy and terms text (Word/PDF or tracked changes).
2. **Public contact block** for publication on `/contact` and privacy policy contact section:
   - Privacy officer name (if applicable)
   - Privacy enquiries email
   - General enquiries email
   - Phone
   - Postal address
   - ABN (if required on public site)
3. **Retention baseline confirmation** — default engineering baseline is 7 years (adults) / until age 25 (minors); confirm or revise.
4. **NDB workflow confirmation** — triage, OAIC notification criteria, individual notification steps in runbook.
5. **Sign-off names and dates** for N4, N5, N6, N7.

---

## Routing checklist

- [x] Bundle assembled in repo (this document + linked sources).
- [ ] Sent to legal counsel (record date and recipient below).
- [ ] Counsel review in progress.
- [ ] Redlines received.
- [ ] Engineering applied copy + contact updates.
- [ ] Sign-off recorded in [`LEGAL_SIGNOFF_TRACKER.md`](./LEGAL_SIGNOFF_TRACKER.md).
- [ ] Frontend deployed with banners removed.

### Routing log

| Date | Action | Owner | Notes |
|------|--------|-------|-------|
| 2026-07-05 | Pack prepared for counsel | Product | Contact details deferred to counsel per product decision |

---

## Post-approval engineering steps

After counsel returns approved copy and contact details:

1. Apply text edits to `content/legal/privacy-policy-au.ts` and `content/legal/terms-of-service-au.ts`.
2. Fill `content/legal/public-contact.ts` with counsel-provided details and set `approvedForProduction: true`.
3. Mirror privacy contact paragraph in privacy policy `contact` section.
4. Set flags in `content/legal/legal-publication.ts`:
   - `privacyPolicyApproved: true`
   - `termsOfServiceApproved: true`
5. Record N6/N7 approval in [`SECURITY_RETENTION_NDB_RUNBOOK.md`](./SECURITY_RETENTION_NDB_RUNBOOK.md) Approval section.
6. Update checkboxes in [`LEGAL_SIGNOFF_TRACKER.md`](./LEGAL_SIGNOFF_TRACKER.md) and [`CORE_PLATFORM_DEEP_CHECK.md`](./CORE_PLATFORM_DEEP_CHECK.md).
7. Deploy frontend.

---

## Email template (optional)

Subject: Tailored Psychology — legal review pack (privacy, terms, retention, NDB)

Body:

> Please review the attached Tailored Psychology legal and operational baseline for public launch:
>
> - Privacy policy (Australian APPs-oriented draft)
> - Terms of Service
> - Security / retention / Notifiable Data Breaches runbook
>
> We need approved copy, public contact details for the privacy officer / enquiries, and confirmation of retention and NDB workflows. Source files are in our repo under `frontend/docs/COUNSEL_REVIEW_PACK.md`.

---

## Related trackers

- [`LEGAL_SIGNOFF_TRACKER.md`](./LEGAL_SIGNOFF_TRACKER.md) — N4/N5 sign-off states
- [`CORE_PLATFORM_DEEP_CHECK.md`](./CORE_PLATFORM_DEEP_CHECK.md) — N4–N7 need-to-have checkboxes
- [`WAVE20_LAUNCH_CLOSURE_AND_STAGING.md`](./WAVE20_LAUNCH_CLOSURE_AND_STAGING.md) — engineering verification (N1, N8, A6)
