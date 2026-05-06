# Theme Tokens (Logo-Aligned, shadcn/ui Ready)

This project uses semantic color tokens in `app/globals.css` so all shadcn/ui components and custom UI surfaces share one visual system.

## Core Brand Colors

- `--primary`: `#5FA8A6` (CTA and main actions)
- `--secondary`: `#9EAA9F` (supporting tone)
- `--accent`: `#8FA7A8` (highlights and selected states)
- `--background`:
  - Light: `#F4F7F6`
  - Dark: `#0B0F10`

## Surface Levels

Use these for layout depth consistency:

- `--surface-1`: main section background
- `--surface-2`: cards/panels
- `--surface-3`: raised or interactive containers

## Text and Contrast

- `--foreground`: primary text
- `--muted-foreground`: supporting labels/hints
- Keep long-form text on `--foreground`, not on muted brand tones.

## Border, Input, and Focus

- `--border`: base divider and component outline
- `--input`: input border/background companion token
- `--ring`: focus/keyboard ring

## Status Colors

- `--success`, `--success-foreground`
- `--warning`, `--warning-foreground`
- `--info`, `--info-foreground`
- `--destructive`, `--destructive-foreground`

Use these for badges, alerts, and inline status states.

## Data Visualization

Charts use:

- `--chart-1`
- `--chart-2`
- `--chart-3`
- `--chart-4`
- `--chart-5`

Prefer these in order for consistent dashboards.

## Gradient Utility

- `--gradient-brand` powers the utility class: `.bg-brand-gradient`

Use for hero accents, not full-page backgrounds.

## shadcn/ui Usage Guidance

1. Use semantic classes (`bg-background`, `text-foreground`, `border-border`) by default.
2. Use `primary` for actions, not large content surfaces.
3. Build new components with token-backed classes instead of hex values.
4. Reuse status tokens for alerts/toasts/tags to keep role pages visually consistent.
