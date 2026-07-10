# Frontend Structure

Current layout after the A–D refactor (July 2026). The `app/` router stays thin; feature logic lives under `components/`, `src/`, and `content/`.

## Key folders

```text
app/                              # Next.js routes (thin page wrappers)
components/
  auth/                           # AuthField, shells, forgot/reset forms
  ops/
    pages/                        # Shared manager/admin list pages
  patient/booking/
    steps/                        # Booking wizard step components
    booking-wizard.tsx            # Orchestrator (~150 lines)
    use-booking-wizard.ts         # Wizard state, sync, navigation
  psychologist/                   # *-workspace.tsx heavy UI
  shared/
    portal-form-field.tsx         # Portal Form Kit
    empty-state.tsx, step-intro.tsx, what-happens-next.tsx
  ui/                             # shadcn-style primitives (Button, Input, Alert, …)
content/
  fixtures/                       # Seed/demo data (not user copy)
  ops-pages.ts, patient-booking.ts
src/
  routes/
    route-config.ts               # Single source: paths, RBAC, nav metadata
    nav-utils.ts, nav-icons.tsx   # Shell nav resolution
  auth/                           # access-control, session, guards
  admin/ops/queries/              # React Query hooks for ops lists
  patient/booking/                # types, validation, API, schedule utils
proxy.ts                          # RBAC middleware (reads APP_ROUTES)
```

## Rules

1. **Routes & RBAC** — Add or change portal paths in `src/routes/route-config.ts` (`navLabel`, `navIcon`, `navKey`, `showInNav`). `proxy.ts` enforces `allowedRoles` + `requiredPermissions`.
2. **Navigation** — Shells (`patient-shell`, `psychologist-shell`, `ops-shell`) render nav from `getShellNavItems()`; do not hardcode nav arrays.
3. **Forms** — Portal flows use `components/shared/portal-form-field.tsx` (`PortalTextInput`, `PortalSelect`, `PortalFileUpload`, …). Auth uses `AuthField` on top of the kit.
4. **Ops lists** — Shared UI in `components/ops/pages/`; data via `src/admin/ops/queries/*`.
5. **Booking** — Steps in `components/patient/booking/steps/`; orchestration in `use-booking-wizard.ts`.
6. **Copy vs fixtures** — User-facing strings in `content/`; seed schedules/clinicians in `content/fixtures/`.

## Shell nav groups

| Shell        | Config field   | Groups                          |
|-------------|----------------|---------------------------------|
| patient     | `navGroup`     | main, care, account             |
| psychologist| `navGroup`     | main, care                      |
| ops         | `navGroup`     | management (manager), admin     |

## Related docs

- `docs/REFACTOR_STATUS.md` — refactor checklist
- `docs/UX_DESIGN_REVIEW.md` — UX north star
