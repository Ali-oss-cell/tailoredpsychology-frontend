# Shadcn Migration Checklist

Use this checklist for each route/page migrated to the new UI system.

## Per Route Checklist

- [ ] Route exists as an App Router file under `app/**/page.tsx`
- [ ] Route path and ownership are documented in `docs/routes-overview.md`
- [ ] Route access expectations are documented in `docs/role-matrix.md` (for protected/mixed-role areas)
- [ ] Correct shell/layout is used for the area (Public/Patient/Psychologist/Ops)
- [ ] Page follows shared header/title/section composition patterns
- [ ] Uses shadcn/ui primitives and shared wrappers (no one-off controls when reusable exists)
- [ ] Uses semantic tokens only (no hardcoded hex values in page/feature components)
- [ ] Page follows `docs/layout-sizing-system.md` spacing and sizing rules
- [ ] Loading/empty/error states are implemented where async data exists
- [ ] Responsive behavior is verified (mobile/tablet/desktop)
- [ ] Light/dark parity and contrast are verified
- [ ] Keyboard/focus and reduced-motion behavior are verified

## Per PR Checklist

- [x] No route access regressions
- [x] No route rename/removal without docs update
- [x] No permission mapping drift between routes and access control
- [x] Shared components extracted when repeated
- [x] Wave plan alignment checked in `docs/WAVE_PAGE_BUILD_PLAYBOOK.md`
- [x] Lint and type checks pass
- [x] Quick UX sanity pass completed across affected pages
