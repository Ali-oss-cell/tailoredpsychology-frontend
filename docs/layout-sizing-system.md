# Layout and Sizing System

This system keeps page density, spacing, and component sizing consistent across all role portals.

## Page Width and Container

- `container.max`: `1280px` for app shells (patient/psychologist/manager/admin)
- `container.max.public`: `1200px` for marketing pages
- `container.padding.x`: `16px` mobile, `24px` tablet, `32px` desktop
- `content.grid.gap`: `16px` mobile, `24px` desktop

## Vertical Rhythm

- Section gap:
  - `24px` standard
  - `32px` for major dashboard blocks
- Card internal padding:
  - `16px` compact
  - `20px` standard
  - `24px` detail/long-form
- Form row spacing:
  - `12px` compact
  - `16px` standard

## Header Sizing

- App header height: `64px`
- Sub-header (tabs/filter bars): `48px`
- Sticky top offset for secondary bars: `64px`
- Sidebar width:
  - collapsed `72px`
  - expanded `272px`

## Typography Scale (recommended)

- `h1`: `32px/40px`, semibold
- `h2`: `24px/32px`, semibold
- `h3`: `20px/28px`, semibold
- `body`: `16px/24px`
- `small`: `14px/20px`
- `caption`: `12px/16px`

## Control Sizing

- Button heights:
  - `sm`: `36px`
  - `md`: `40px` (default)
  - `lg`: `44px`
- Input/select/combobox:
  - default height `40px`
  - dense table filter height `36px`
- Icon sizes:
  - inline `16px`
  - default control `18px`
  - feature icon `20px`

## Table Density

- Row height:
  - compact `44px`
  - standard `52px`
- Header height: `44px`
- Cell horizontal padding: `12px`

## Responsive Breakpoint Strategy

- `sm` (>=640): stack content blocks, compact actions
- `md` (>=768): two-column page sections where applicable
- `lg` (>=1024): full shell layout with sidebar
- `xl` (>=1280): max-width container cap and denser dashboards

## shadcn Implementation Guidance

1. Use semantic tokens in `app/globals.css` for colors and states.
2. Keep spacing/radius in reusable wrappers:
   - `PageSection`
   - `AppCard`
   - `DataTableShell`
   - `PageHeader`
3. Do not hardcode arbitrary spacing/sizes in individual pages unless the pattern is explicitly unique.
