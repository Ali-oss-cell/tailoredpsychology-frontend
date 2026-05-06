# Frontend Structure Blueprint

Use this structure to keep the codebase clean as pages and roles grow.

## Target Folder Structure

```text
src/
  app/                         # Next app router entry and route segments
  routes/
    AppRoutes.tsx              # Runtime route registration
    route-config.ts            # Single source of truth for paths/roles/shell/nav
  auth/
    access-control.ts          # Roles, permissions, role->permission mapping
    guards/
      ProtectedRoute.tsx
  features/
    public/
      pages/
      components/
      api/
      types/
    auth/
      pages/
      components/
      api/
      types/
    patient/
      pages/
      components/
      api/
      types/
    psychologist/
      pages/
      components/
      api/
      types/
    manager/
      pages/
      components/
      api/
      types/
    admin/
      pages/
      components/
      api/
      types/
  shared/
    layout/                    # App shells and common page wrappers
    ui/                        # shadcn wrappers (PageHeader, DataTableShell, etc.)
    hooks/
    lib/
    types/
```

## Organization Rules

1. Route definitions live in `src/routes/route-config.ts`; avoid hardcoding route metadata elsewhere.
2. Each feature owns its pages, feature-specific components, API client calls, and types.
3. Shared UI patterns go in `src/shared/ui`, not copied into role folders.
4. Guard logic and permission checks live in `src/auth`, never duplicated in page components.
5. Any route/role change must update:
   - `src/routes/route-config.ts`
   - `docs/routes-overview.md`
   - `docs/role-matrix.md`

## Why this scales

- New role pages become predictable to place and review.
- Shared shell/layout changes apply everywhere without touching each page.
- Route security and navigation remain centralized and auditable.
