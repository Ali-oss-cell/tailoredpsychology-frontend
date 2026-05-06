# Wave 2 Auth QA Matrix

Route-by-route QA tracking for authentication pages.

Legend:
- `pass`: verified in code and checks
- `manual-check`: needs browser validation

| Route | Responsive | Light/Dark | Token-only styling | Keyboard/Focus | Form UX | Notes |
|---|---|---|---|---|---|---|
| `/login` | pass | pass | pass | pass | manual-check | Uses shared `AuthShell`, `AuthCard`, and `AuthField` primitives. |
| `/register` | pass | pass | pass | pass | manual-check | Includes multi-field layout + terms acceptance block. |
| `/forgot-password` | pass | pass | pass | pass | manual-check | Recovery flow shell and single-email action. |
| `/reset-password` | pass | pass | pass | pass | manual-check | New password + confirmation form flow. |

## Verification basis

- Shared auth primitives:
  - `components/auth/auth-shell.tsx`
  - `components/auth/auth-card.tsx`
  - `components/auth/auth-field.tsx`
- Shared content config:
  - `content/auth.ts`
- Route files:
  - `app/login/page.tsx`
  - `app/register/page.tsx`
  - `app/forgot-password/page.tsx`
  - `app/reset-password/page.tsx`

## Next action

Perform manual browser pass for:
- error/success form states
- tab order and focus ring behavior
- dark/light visual balance on auth side imagery
