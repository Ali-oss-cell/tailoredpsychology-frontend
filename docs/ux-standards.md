# Clink UX Standards (shadcn/ui)

This document defines UI standards for a clean, consistent product experience during the shadcn/ui rebuild.

## Core Principles

1. Consistency over novelty.
2. Clarity over density.
3. Fast scanning over decorative complexity.
4. Reuse shared components before creating custom UI.

## Layout and Composition

- Use shared shells by area:
  - Public shell
  - Patient shell
  - Psychologist shell
  - Manager/Admin shell
- Use one page template pattern:
  1. Page title and short subtitle
  2. Primary actions (top-right where relevant)
  3. Main content sections in `Card` blocks
  4. Secondary actions/details in side panels where needed
- Keep stable spacing rhythm and max-width rules across pages.

## shadcn/ui Component Standards

- Use shadcn primitives by default:
  - `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`
  - `Form`, `FormField`, `FormItem`, `FormMessage`
  - `Card`, `Badge`, `Alert`, `Tabs`, `Dialog`, `Sheet`
  - `Table` for data-heavy pages
- Do not build one-off controls if a shadcn equivalent exists.
- Prefer compositional wrappers around shadcn primitives for domain-specific use.

## Tables and Data Screens

- Every table page should provide:
  - Search
  - Filter controls (if applicable)
  - Empty state
  - Error state
  - Loading state (skeleton or spinner)
- Keep action columns consistent (`View`, `Edit`, `Delete`, etc.).
- Use compact but readable row heights.

## Forms and Validation

- Use `react-hook-form` patterns with shadcn `Form` primitives.
- Show validation messages inline near fields.
- Preserve entered values after non-fatal submission errors.
- Use clear success and failure feedback (`Alert` or toast).

## State Behavior

- Loading state: visible and non-jarring.
- Empty state: explain what the user can do next.
- Error state: include actionable next step (`Retry`, `Contact support`, etc.).

## Accessibility and Internationalization

- Preserve semantic heading order (`h1` to `h2` to `h3`).
- Ensure keyboard navigation for interactive controls.
- Ensure sufficient color contrast and visible focus states.
- Maintain RTL compatibility where enabled.

## Visual Guardrails

- Keep typography and color token-driven.
- Do not hardcode random spacing/color values in feature files.
- Use a restrained icon style and keep icon meaning consistent.
