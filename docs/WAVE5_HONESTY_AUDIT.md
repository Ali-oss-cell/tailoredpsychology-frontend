# Wave 5 Honesty Audit (N3)

Date: 2026-05-06  
Scope: pricing, Medicare, invoice/download wording, and join CTA consistency before external demo.

## Findings

| Area | Source | Outcome | Notes |
|---|---|---|---|
| Pricing disclaimers | `frontend/content/public-pricing.ts` | Pass | Explicitly states examples are indicative and rebate values can change. |
| Medicare eligibility claims | `frontend/content/pages/medicare-rebates.ts` | Pass | Uses conditional language ("where eligibility is met"), avoids guaranteed claim outcomes. |
| Invoice download truthfulness | `frontend/components/patient/billing/patient-invoices-section.tsx`, `frontend/src/patient/billing/api.ts` | Pass | UI now states file may be PDF/text and derives filename from server headers/content type. |
| Patient invoices header wording | `frontend/content/patient-invoices.ts` | Fixed | Replaced "Medicare-related records" with artifact-accurate wording. |
| Join CTA consistency | `frontend/components/patient/dashboard/upcoming-session-card.tsx`, `frontend/src/session/join-session.ts` | Pass | CTA uses canonical helper and always routes to `/video-session/:appointmentId`. |

## Must-fix items

- None open after this pass.

## Follow-up items

- Re-run this audit on staging copy/content before external demo if legal or marketing text changes.
