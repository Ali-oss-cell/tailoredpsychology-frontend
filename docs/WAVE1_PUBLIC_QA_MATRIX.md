# Wave 1 Public QA Matrix

Route-by-route QA tracking for current public pages implemented in Wave 1.

Legend:
- `pass`: verified in implementation + build checks
- `manual-check`: requires visual/browser pass confirmation

| Route | Responsive | Light/Dark | Token-only styling | Keyboard/Focus | Reduced motion | Notes |
|---|---|---|---|---|---|---|
| `/` | pass | pass | pass | pass | pass | Homepage includes GSAP Observer with reduced-motion guard. |
| `/about` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |
| `/services` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |
| `/telehealth-requirements` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |
| `/medicare-rebates` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |
| `/resources` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |
| `/contact` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |
| `/get-matched` | pass | pass | pass | pass | manual-check | Uses `PublicDetailPage` composition with shared sections. |

## Verification basis

- Code-level checks passed:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
- Shared layout and component usage:
  - `components/layout/public-header.tsx`
  - `components/layout/public-footer.tsx`
  - `components/marketing/public-detail-page.tsx`
  - `components/marketing/*` reusable section blocks

## Next action

Complete manual visual sweep in browser for:
- spacing consistency across breakpoints
- final content rhythm per page
- dark/light contrast polish for long-form sections
