# Navbar & Footer UI Refactor

**Date:** 2026-07-11  
**Scope:** Public marketing chrome — sticky header, mega menus, fullscreen mobile nav, expanded footer.  
**Brand constraint:** Preserve `--primary` teal (`#5fa8a6`); no palette changes.

See also: [Landing Page UI Refactor](./LANDING_PAGE_UI_REFACTOR.md) for homepage sections and shared marketing tokens.

## Design principles

1. **Premium healthcare chrome** — generous spacing, clear hierarchy, calm elevation.
2. **Teal identity preserved** — primary CTA, active nav states, and trust cues stay in the Tailored Psychology teal family.
3. **Existing routes only** — every link resolves to a real page or homepage anchor (`/#faq`, `/#how-it-works`).
4. **Accessible by default** — 44×44px targets, focus rings, semantic landmarks, mobile focus trap.
5. **Content-driven nav** — `content/public-nav.ts` and `content/public-footer.ts` centralise links.

---

## Before / after — Navbar

### Layout

| Before | After |
|--------|-------|
| ~68px header (`min-h-[4.25rem]`) | 84px desktop default (`min-h-[5.25rem]`), compacts to 72px on scroll |
| Flat sticky bar with light blur | White/glass background, `shadow-e2`, backdrop blur when scrolled |
| Logo + inline scroll nav + CTAs | Logo left, primary nav centre-left, Login + CTA + theme toggle right |
| Duplicate mobile/desktop CTAs | Single primary CTA: “Find Your Psychologist →” (48px, `rounded-xl`, teal glow, hover lift) |

### Primary navigation

| Before | After |
|--------|-------|
| Flat list: Services, Why TP, Pricing, Trust, Conditions, Medicare, Resources, Contact | Services ▾, Conditions, Pricing, Resources ▾, About |
| No mega menus | **Services mega:** Individual Therapy, Couples, Child Psychology, ADHD, Anxiety, Depression, Trauma |
| Medicare as top-level link | **Resources mega:** Articles, FAQ, Medicare, Telehealth Guide, Emergency Resources |
| Homepage section anchors mixed into nav | Secondary row: How it Works (`/#how-it-works`), Trust (`/trust`) |

### Nav interaction

| Before | After |
|--------|-------|
| `font-medium` links, tight gap | Medium weight, `rounded-xl`, increased spacing, hover background |
| Route-only active state | Pathname match + mega-menu child highlight + homepage section observer for anchors |
| Login ghost button same visual weight as nav | Login as outline button, visually distinct from nav links |
| 40px theme toggle | 44×44px theme toggle |

### Mobile navigation

| Before | After |
|--------|-------|
| Dropdown panel below header | Fullscreen overlay with backdrop blur |
| Flat link list + homepage anchors | Grouped sections: Primary, Secondary, Support |
| Single CTA at top | Bottom-pinned CTAs: Find Your Psychologist + Book Appointment |
| No focus trap | Focus trap, Escape to close, body scroll lock, `aria-expanded` |

### Search

| Before | After |
|--------|-------|
| N/A | **Deferred** — no search infrastructure; skipped per spec |

---

## Before / after — Footer

### Layout

| Before | After |
|--------|-------|
| 2-column: brand blurb + 5 link columns | 6-column desktop: Company, Quick Links, Services, Resources, Support, Newsletter |
| Same grid on mobile | Mobile accordion for link columns; company + newsletter always visible |
| Text social links | Phosphor icon buttons (LinkedIn, Instagram, Facebook, YouTube) with hover lift |

### Company column

| Before | After |
|--------|-------|
| Logo + one-line mission | Logo, mission statement, trust badges (ABN on request, Australia Wide, Privacy First, AHPRA Registered) |

### Link columns

| Before | After |
|--------|-------|
| Company / Services / Resources / Privacy / Support | Quick Links, Services (condition routes), Resources (FAQ, Medicare, Telehealth, Privacy, Help, Emergency), Support (Portal, Clinician Login, Register, Contact, Accessibility) |

### Emergency card

| Before | After |
|--------|-------|
| Small destructive panel with 000 + Lifeline | Prominent card with medical icon, 000, Lifeline 13 11 14, Beyond Blue 1300 22 4636 |

### Newsletter

| Before | After |
|--------|-------|
| “Stay in touch” disabled form | “Stay Updated” headline, rounded input + button, privacy note (UI only) |

### Bottom bar

| Before | After |
|--------|-------|
| Copyright only | Copyright + Privacy, Terms, Accessibility, Sitemap (`/sitemap.xml`), Back to Top |

---

## Key files

| Area | Path |
|------|------|
| Nav content | `content/public-nav.ts` |
| Footer content | `content/public-footer.ts` |
| Header shell | `components/layout/public-header.tsx` |
| Desktop nav | `components/layout/public-header-nav.tsx` |
| Mega menus | `components/layout/public-nav-mega-menu.tsx` |
| Mobile nav | `components/layout/public-header-mobile-nav.tsx` |
| Footer | `components/layout/public-footer.tsx` |
| Footer accordion | `components/layout/public-footer-accordion.tsx` |
| Scroll FX | `components/layout/header-scroll-fx.tsx` |
| Tokens | `app/globals.css` (`[data-public-header]`, `.marketing-*`) |

---

## Deferred / partial

| Item | Status |
|------|--------|
| Site search | Deferred — no backend or index |
| Cookies policy page | Link omitted — route does not exist |
| Newsletter ESP | UI placeholder only |
| Social URLs | Placeholder `#` until marketing provides |
| ABN display | “ABN on request” until counsel confirms in `public-contact.ts` |
| Dedicated Accessibility page | Links to `/contact` |

---

## Completion checklist

- [x] Navbar height, scroll glass, compact mode
- [x] Mega menus (Services, Resources)
- [x] Secondary nav (How it Works, Trust)
- [x] Mobile fullscreen nav with focus trap
- [x] Footer 6-column desktop / accordion mobile
- [x] Emergency card with Beyond Blue
- [x] Phosphor social icons
- [x] en-AU copy, WCAG focus rings
- [x] Build + tests passing
