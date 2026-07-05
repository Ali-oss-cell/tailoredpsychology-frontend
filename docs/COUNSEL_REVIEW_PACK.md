# Counsel review pack (N4, N5, N6, N7)

**Prepared:** 2026-07-05  
**Status:** Ready to send — attach [`counsel-bundle/`](./counsel-bundle/) to email  
**Owner:** Product Lead

---

## How to send (you do this once)

1. Zip the folder `frontend/docs/counsel-bundle/` (5 markdown files + README).
2. Email your counsel with the template below; attach the zip.
3. Record the send date in the **Routing log** at the bottom of this doc and in [`LEGAL_SIGNOFF_TRACKER.md`](./LEGAL_SIGNOFF_TRACKER.md).
4. **Do not** flip `public-contact.ts` or `legal-publication.ts` until redlines and sign-off return.
5. Amber banners stay on `/privacy-policy` and `/terms-of-service` until step 4.

**Subject:** Tailored Psychology — legal review pack (privacy, terms, retention, NDB)

**Body:**

> Please review the attached legal and operational baseline for Tailored Psychology Pty Ltd public launch (https://tailoredpsychology.com.au).
>
> We need:
> 1. Approved or redlined privacy policy and terms
> 2. Public contact details (privacy officer, emails, phone, postal address, ABN if required)
> 3. Confirmation of retention baseline (7 years adults / until age 25 minors)
> 4. Confirmation of NDB incident workflow
> 5. Sign-off names and dates
>
> Draft pages are live with a “Pending legal sign-off” banner until you approve.

---

## Purpose

Single bundle for counsel to review public legal pages and operational security/retention/NDB baseline before production publication.

---

## Documents in scope

| ID | Document | Live URL / path |
|----|----------|-----------------|
| N4 | Privacy policy copy | [`counsel-bundle/01-privacy-policy-draft.md`](./counsel-bundle/01-privacy-policy-draft.md) → live `/privacy-policy` |
| N5 | Terms of Service copy | [`counsel-bundle/02-terms-of-service-draft.md`](./counsel-bundle/02-terms-of-service-draft.md) → live `/terms-of-service` |
| N6 | Security + retention alignment | [`counsel-bundle/03-security-retention-ndb-runbook.md`](./counsel-bundle/03-security-retention-ndb-runbook.md) + [`counsel-bundle/04-retention-deletion-policy-summary.md`](./counsel-bundle/04-retention-deletion-policy-summary.md) |
| N7 | NDB / breach runbook | Same as N6 |

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
