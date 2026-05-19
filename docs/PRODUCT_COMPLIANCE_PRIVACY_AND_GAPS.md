# Product, compliance, privacy, and gap analysis (Australia-oriented)

**Audience:** Product, engineering, clinical leads, operations, and legal/compliance reviewers preparing Tailored Psychology for credible launch and ongoing governance.

**Important — not legal advice**

This document summarises **engineering-visible gaps**, **common Australian legal touchpoints** for a health-adjacent digital service, and **where to find binding policy text**. It does **not** constitute legal, clinical, or regulatory advice. Laws change; obligations vary by entity structure, state/territory, funding model, and what data you actually process. **Engage Australian-qualified legal counsel** before relying on this for compliance decisions.

---

## Related artefacts in this repository

| Artefact | Purpose |
|----------|---------|
| [`WAVE7_REQUIREMENTS_CHECKLIST.md`](./WAVE7_REQUIREMENTS_CHECKLIST.md) | BR-### business requirements (many rows still “Not started” — reconcile against code before treating as live status). |
| [`CORE_PLATFORM_DEEP_CHECK.md`](./CORE_PLATFORM_DEEP_CHECK.md) | Lenses for “what is core”, high-confidence shipped areas, gaps (doc drift, telehealth spec, assets, demo auth), and a reconciliation process. |
| [`WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md`](./WAVE19_PLATFORM_COMPETITIVE_GAP_AUDIT.md) | vs Halaxy/PMS/telehealth competitors; gap IDs (PG/CO/TH/GV/IN); Phases A–C checklists. |
| [`WAVE13_COMPLIANCE_AND_CLINICAL_GOVERNANCE_PLAN.md`](./WAVE13_COMPLIANCE_AND_CLINICAL_GOVERNANCE_PLAN.md) | Governance hardening scope (consent, notes, legal hold, NDB, privacy requests). |
| [`BOOKING_AND_PROFILE_PRODUCTION_READINESS.md`](./BOOKING_AND_PROFILE_PRODUCTION_READINESS.md) | Booking, referrals, clinician profile wiring; AU regulatory **pointers** (not advice). |
| [`backend/docs/RETENTION_AND_DELETION_POLICY_AU.md`](../../backend/docs/RETENTION_AND_DELETION_POLICY_AU.md) | Engineering baseline for retention / soft delete / legal hold (must align with legal sign-off). |
| **Public privacy policy (live page)** | `/privacy-policy` — content from `frontend/content/legal/privacy-policy-au.ts` (draft until legal replaces placeholders). |

---

## Part A — Australian law and standards (high-level map)

Use this as a **reading list and workshop agenda** for counsel — not a compliance certificate.

### A.1 Primary Commonwealth frameworks (digital health context)

| Topic | Instrument / body | Why it matters for Clink |
|-------|---------------------|---------------------------|
| **Privacy** | *Privacy Act 1988* (Cth), **Australian Privacy Principles** (APPs) in *Privacy Amendment (Enhancing Privacy Protection) Act 2012* | Governs collection, use, disclosure, quality, security, access, correction, and cross-border flows for **personal information**; **APP 6** / **sensitive information** rules bite hard for **health information**. |
| **Data breaches** | **Notifiable Data Breaches** (NDB) scheme under the *Privacy Act* | **Eligible data breaches** may require OAIC and individual notification within statutory timeframes. Product + runbooks must support identification and assessment. |
| **Electronic marketing** | *Spam Act 2003* (Cth) | Consent, identification, and unsubscribe rules for **commercial electronic messages**; distinguish **direct marketing** vs **service messages** (e.g. appointment reminders). |
| **Consumer protection** | *Australian Consumer Law* (Schedule 2, *Competition and Consumer Act 2010*) | **Misleading representations** about pricing, rebates, or outcomes (including marketing and in-app copy) can create regulatory risk separate from privacy law. |
| **Health practitioner advertising** | National Law / AHPRA advertising guidelines | If marketing references **regulated health services**, avoid misleading claims, undue pressure, unreasonable expectation of benefit, and inappropriate use of testimonials (rules are detailed — get advice). |
| **Medicare / MBS** | Department of Health & Aged Care / Services Australia materials | **Rebate eligibility and session caps** are statutory/administrative — software should **not** pretend to adjudicate a PDF; UX must be **truthful** (see Wave 17 invoice/join honesty pattern). |

**Authoritative links (external):**

- OAIC — APP guidelines and privacy topics: `https://www.oaic.gov.au/`
- AHPRA — advertising hub: `https://www.ahpra.gov.au/`
- Services Australia — Medicare information: `https://www.servicesaustralia.gov.au/`

### A.2 State and territory health records

Australia also has **state/territory health records legislation** that may apply to **health information** held by certain providers or in certain contexts. Whether Clink is an “organisation” under a given Act, or whether obligations fall primarily on the **clinic/practice** as system operator, is a **legal structuring question**. Document:

- who is **APP entity** / **organisation** for each deployment;
- who is **data custodian** for clinical notes vs platform metadata;
- **data flow diagrams** for patient → practice → subprocessors (video, email, cloud).

### A.3 APPs at a glance (product implications)

| APP | Short label | Product / engineering hook |
|-----|-------------|----------------------------|
| **APP 1** | Open and transparent | Public **privacy policy** (`/privacy-policy`), internal policy register, clear collection notices at collection points. |
| **APP 2** | Anonymity / pseudonymity | Where practicable, offer paths that do not over-collect; document trade-offs for telehealth identity assurance. |
| **APP 3** | Collection solicited & lawful | Intake/booking fields tied to **clear purpose**; avoid “just in case” fields (Wave 7 data matrix intent). |
| **APP 4** | No unsolicited collection | Marketing vs clinical forms separated; no dark patterns. |
| **APP 5** | Notification (collection notice) | Registration, intake, and referral upload flows should surface **who**, **why**, **consequences of not giving**. |
| **APP 6** | Use / disclosure | Role-based access (RBAC), audit logs, **minimum necessary** in UI defaults. |
| **APP 7** | Direct marketing | Opt-in/opt-out model documented; distinguish reminders. |
| **APP 8** | Cross-border | Subprocessor list + contracts (video, hosting, email); transparency in policy. |
| **APP 9** | Adoption, use, disclosure of government identifiers | Care with Medicare numbers — counsel should define handling rules. |
| **APP 10** | Quality | Patient profile correction pathways; clinician review workflows. |
| **APP 11** | Security | SOC-style controls, secrets management, incident response, pen test cadence. |
| **APP 12** | Access | Patient **access** requests — align with `/patient/data-requests` and ops queues. |
| **APP 13** | Correction | Correction requests + clinical record amendment policy. |

---

## Part B — “Missing product” vs “missing checklist row”

### B.1 User-visible capability gaps (pull away from a credible product)

| Gap | User / buyer impact | Repository notes |
|-----|---------------------|-------------------|
| **Telehealth join gates vs Wave 7 BR-301/302** | Regulators and clinicians may expect **explicit pre-join checks** (e.g. location attestation, formal preflight record) beyond “nice UI”. | Wave 17 documents **dated deferral** for BR-301/302 until product defines strings and liability. `PreSessionReadinessCard` / `/patient/video-setup` help readiness but may not equal BR-302 “requirement” as written in WAVE7. |
| **Pre-session chat rules BR-303–305** | Chat UX exists (`pre-session-chat-panel.tsx`), but **Wave 7 table** may still show “Not started” — **reconcile** documentation with backend/socket rules so stakeholders trust behaviour. | See `frontend/docs/WAVE8_EXECUTION_TICKETS.md` (claims Done for chat lane) vs `WAVE7_REQUIREMENTS_CHECKLIST.md`. |
| **Demo / stub auth messaging** | Production buyers expect **no stub accounts** in live marketing or login. | `login/page.tsx` references demo behaviour — ensure production build/config removes or gates copy. |
| **Medicare / rebate expectations** | Users may believe software **validated** rebates from uploads. | `BOOKING_AND_PROFILE_PRODUCTION_READINESS.md` states PDF is **not** auto-adjudicated — UX must stay aligned (pricing, Medicare pages, booking review). |
| **Broken public assets** | Erodes trust instantly. | Homepage `content/homepage.ts` still references some **`/assets/*.jpg`** paths; verify files exist under `public/` or swap to committed media (see `IMAGE_CREDITS.md` for Unsplash-sourced marketing rasters). |
| **Terms of Service legal maturity** | Route and links are shipped, but legal approval and owner-controlled publication workflow may still be pending. | Keep **Privacy Policy** + **Terms** + **acceptable use** + clinician engagement terms aligned in one legal release process (`LEGAL_SIGNOFF_TRACKER.md`). |

### B.2 Governance / enterprise gaps (serious buyers)

| Gap | Why it hurts |
|-----|--------------|
| **Append-only audit for sensitive transitions (BR-402)** | Without immutable, queryable evidence, **enterprise sales** and **incident review** are harder. |
| **Consent versioning / withdrawal (BR-405)** | Health privacy expectations often require **demonstrable consent state** at time of treatment and changes over time. |
| **Field-level audit (BR-403)** | Needed for “who changed what, when, why” on sensitive records. |
| **Unified patient journey timeline (BR-501)** | Without it, the product can feel like **separate forms** rather than **one coordinated service**. |

### B.3 Documentation hygiene (internal, but creates false “missing core”)

| Issue | Fix |
|-------|-----|
| WAVE7 checklist shows **BR-601/602 “Not started”** while controllers expose `GET .../clinicians/availability` and `POST .../booking-requests`. | Run a **reconciliation sprint**: mark Done/Partial with file references, or split “spec done” vs “code done”. |
| Multiple waves (7, 8, 11, 13, 16, 17, 18) | Maintain a **single executive status page** (this doc can link outward) updated monthly. |

---

## Part C — Privacy policy delivery (what we shipped)

### C.1 Public route

- **URL:** `/privacy-policy`
- **Implementation:** `frontend/app/privacy-policy/page.tsx` + `frontend/components/legal/privacy-policy-document.tsx`
- **Copy source:** `frontend/content/legal/privacy-policy-au.ts`

### C.2 Before production checklist (legal + product)

- [x] Replace policy placeholder with the registered legal entity name (`Clink Health Pty Ltd`).
- [ ] Insert **ACN/ABN**, **physical address**, and **privacy officer contact** (email + postal address if required).
- [ ] Confirm **subprocessor list** (hosting, email, video, analytics) and **countries**; attach or link from policy if your counsel wants public transparency.
- [ ] Align retention statements with **`RETENTION_AND_DELETION_POLICY_AU.md`** after legal edits.
- [ ] Map in-product flows to APP **collection notices** (register, intake, referral upload, telehealth join).
- [x] Terms route and cross-links are shipped (`/terms-of-service`, register, footer).
- [ ] Run **legal sign-off** versioned in your document control system (Git commit ≠ legal approval).

---

## Part D — Security incidents and privacy rights (in-product)

These routes support **operational** privacy workflows — they do not replace a privacy management system:

| Route | Role | Intent |
|-------|------|--------|
| `/patient/data-requests` | Patient | Access / correction style requests (UI). |
| `/manager/privacy-requests`, `/admin/privacy-requests` | Manager / Admin | Triage queues. |
| `/admin/security-incidents` | Admin | Incident register / NDB readiness workflow foundation. |

Ensure **runbooks** exist outside this repo: breach assessment, OAIC notification drafting, comms templates.

---

## Part E — Marketing and “law adjacent” UX

| Risk | Mitigation |
|-------|------------|
| **Misleading pricing / rebate copy** | Keep **indicative** language; date-stamp tables; link to official Medicare guidance. |
| **Therapeutic claims on marketing pages** | Keep claims **non-clinical** or clinically reviewed; AHPRA advertising rules are strict for regulated health services. |
| **Images and consent** | Use licensed/committed assets; maintain [`IMAGE_CREDITS.md`](./IMAGE_CREDITS.md) for stock photography provenance. |

---

## Part F — Suggested next actions (prioritised)

1. **Legal retainer session** — APP entity determination, health records Act applicability, Medicare number handling, telehealth consent, marketing review.
2. **Reconcile WAVE7 vs code** — especially BR-60x APIs and BR-303+ telehealth chat; eliminate false “Not started”.
3. **Legal sign-off completion for Terms + Privacy** — route/copy are shipped; complete counsel approval workflow (`LEGAL_SIGNOFF_TRACKER.md`).
4. **Asset audit** — script or CI check that every `public/` reference resolves.
5. **Production auth** — remove or hide demo-only copy on login for production builds.
6. **Clinical sign-off** on deferred join gates (BR-301/302) — implement or permanently document waiver with dated governance approval.

---

## Revision history

| Date | Author | Notes |
|------|--------|-------|
| 2026-05-03 | Engineering | Initial consolidated master doc; added `/privacy-policy` draft page and route-config entry. |
| 2026-05-06 | Engineering | Updated legal status after Terms shipping: retained Terms as legal-signoff task, marked shipped route/link work as complete. |

**End of document.**
