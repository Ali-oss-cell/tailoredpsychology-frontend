# Legal Sign-off Tracker (N4 + N5)

Purpose: track owner and sign-off state for public legal pages before release.

## Scope

- `/privacy-policy`
- `/terms-of-service`

## Ownership

| Area | Primary owner | Secondary owner | Target date | Sign-off state | Last updated |
|---|---|---|---|---|---|
| Privacy policy legal review | Product Lead | Legal counsel | 2026-05-12 | Pending legal | 2026-05-04 |
| Terms of Service legal review | Product Lead | Legal counsel | 2026-05-12 | Pending legal | 2026-05-04 |
| Public contact details publication | Ops Lead | Product Lead | 2026-05-10 | Pending legal | 2026-05-04 |

## Sign-off states

- `Pending legal`: drafted and routed for counsel review.
- `Approved by counsel`: legal text approved, awaiting release sign-off.
- `Approved for production`: approved and ready for public release.

## Source of truth for public legal contact details

- Canonical publication route: `/contact` page content.
- Privacy policy contact paragraph should reference the same public contact channel.
- Once direct privacy officer details are confirmed, mirror them in policy text and contact page in the same release.

## Release checklist

- [x] Privacy policy has concrete entity name in content (`Clink Health Pty Ltd`).
- [x] Terms of Service route exists (`/terms-of-service`).
- [x] Register page links to Terms and Privacy pages.
- [x] Public footer links include Terms and Privacy pages.
- [ ] Legal counsel approved privacy policy copy for production use.
- [ ] Legal counsel approved terms copy for production use.
- [ ] Privacy officer/public contact details finalized and published.

## Decision log

| Date | Decision | Owner |
|---|---|---|
| 2026-05-04 | Added Terms route and wiring links from register/footer; legal approval still pending. | Product |
| 2026-05-04 | Privacy policy placeholder replaced with concrete entity text; sign-off remains pending. | Product |
| 2026-05-04 | Added explicit owner/target date/sign-off states; set `/contact` as public source-of-truth pending direct privacy officer details. | Product |
| 2026-05-06 | Added operational security/retention/NDB runbook with named owners for N6/N7 linkage. | Product |
