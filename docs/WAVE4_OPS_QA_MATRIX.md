# Wave 4 Ops QA Matrix

This matrix tracks validation for manager and admin operations portals.

## Route coverage

- [x] `/manager/dashboard`
- [x] `/manager/staff`
- [x] `/manager/patients`
- [x] `/manager/appointments`
- [x] `/manager/billing`
- [x] `/manager/resources`
- [x] `/admin/dashboard`
- [x] `/admin/users`
- [x] `/admin/appointments`
- [x] `/admin/patients`
- [x] `/admin/staff`
- [x] `/admin/billing`
- [x] `/admin/settings`
- [x] `/admin/analytics`
- [x] `/admin/audit-logs`
- [x] `/admin/data-deletion`
- [x] `/admin/referrals`
- [x] `/admin/resources`

## QA checks

- [x] Shared shell is used consistently (`components/ops/ops-shell.tsx`)
- [x] Page-level content is typed/config-driven (`content/ops-pages.ts`)
- [x] Pages avoid ad hoc color values and use semantic tokens
- [x] All routes render with reusable template (`components/ops/ops-page-template.tsx`)
- [x] Nav active-state behavior matches current route
