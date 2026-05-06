# Wave 3 Patient QA Matrix

Initial QA tracking for patient dashboard implementation.

Legend:
- `pass`: verified in code/build checks
- `manual-check`: needs browser/device interaction pass

| Route | Shell Reuse | Responsive | Light/Dark | Token-only styling | Keyboard/Focus | Notes |
|---|---|---|---|---|---|---|
| `/patient/dashboard` | pass | pass | pass | pass | manual-check | Uses new `PatientShell` + modular dashboard cards. |
| `/patient/appointments` | pass | pass | pass | pass | manual-check | Uses shared patient shell and appointment card/list layout. |
| `/patient/account` | pass | pass | pass | pass | manual-check | Uses shared patient shell and account/security cards. |
| `/patient/resources` | pass | pass | pass | pass | manual-check | Uses shared patient shell and resource category cards. |
| `/patient/invoices` | pass | pass | pass | pass | manual-check | Uses shared patient shell and invoice history rows. |

## Verification basis

- Shared shell/component architecture:
  - `components/patient/patient-shell.tsx`
  - `components/patient/dashboard/*`
- Content-driven composition:
  - `content/patient-dashboard.ts`
  - `content/patient-appointments.ts`
  - `content/patient-account.ts`
  - `content/patient-resources.ts`
  - `content/patient-invoices.ts`
- Route:
  - `app/patient/dashboard/page.tsx`
  - `app/patient/appointments/page.tsx`
  - `app/patient/account/page.tsx`
  - `app/patient/resources/page.tsx`
  - `app/patient/invoices/page.tsx`

## Next action

Manual browser pass for:
- sidebar/topbar behavior on smaller breakpoints
- focus order across dashboard action buttons
- card density and spacing parity in both themes
