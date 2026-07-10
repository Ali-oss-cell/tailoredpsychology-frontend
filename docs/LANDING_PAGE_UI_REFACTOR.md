# Landing Page UI Refactor Plan

**Date:** 2026-07-11  
**Scope:** Homepage (`app/page.tsx`) and shared marketing chrome (header, footer, hero, sections).  
**Brand constraint:** Preserve existing `--primary` teal (`#5fa8a6`); align with dashboard refactor tokens (`--dashboard-bg`, card radius, shadows) where shared.

## Design principles

1. **Calm, premium healthcare** — generous whitespace, clear hierarchy, soft elevation; no competitor clone aesthetics.
2. **Teal identity preserved** — primary CTAs, accents, and trust cues stay in the Tailored Psychology teal family.
3. **Extend existing content** — reuse `content/homepage.ts`, `content/conditions`, `matchClinicianCatalog`, and existing assets.
4. **Accessible by default** — WCAG AA contrast, semantic headings, keyboard focus rings, `prefers-reduced-motion` respected.
5. **Minimal blast radius** — marketing-only components; portal/dashboard globals extended additively, not replaced.

## Typography scale (marketing)

| Role | Size | Utility |
|------|------|---------|
| H1 (hero) | 56–64px responsive | `.marketing-h1` |
| H2 (sections) | 40px | `.marketing-h2` |
| H3 (cards) | 28px | `.marketing-h3` |
| Body | 18px | `.marketing-body` |
| Small / muted | 15px | `.marketing-small` |

Headings use `font-heading`; body stays on sans stack.

## Spacing & surfaces

| Token | Value | Usage |
|-------|-------|-------|
| Page canvas | `--dashboard-bg` `#f8fafc` | Alternating section backgrounds |
| Card radius | 16px (`rounded-2xl`) | Service, step, testimonial cards |
| Primary CTA height | 48px (`h-12`) | Hero and section CTAs |
| Card shadow | `--shadow-e1` → `--shadow-e2` on hover | `.marketing-card` |

## Before / after — by section

### Navigation

| Before | After |
|--------|-------|
| Compact sticky header, small nav links | Sticky navbar with improved spacing and hover states |
| CTA same weight as Login | Highlighted primary CTA “Find a Psychologist” → `/get-matched` |
| No section anchor awareness | Active state when homepage sections scroll into view |
| Horizontal scroll nav on mobile only | Collapsible mobile menu with full link list + section anchors |

**Navbar & footer detail:** see [NAVBAR_FOOTER_UI_REFACTOR.md](./NAVBAR_FOOTER_UI_REFACTOR.md) for mega menus, fullscreen mobile nav, 6-column footer, emergency card, and deferred items.

### Hero

| Before | After |
|--------|-------|
| Single badge, two CTAs | Badge “Available Australia Wide”, three CTAs (primary / secondary / anchor) |
| `titleAccent: "your situation"` | Accent on “your journey” in primary colour |
| No inline trust row | Trust indicators: Medicare, AHPRA, Telehealth, Australia Wide, Privacy |
| Static hero image | Larger `rounded-3xl` image with shadow, border, optional floating stat cards (illustrative) |

### Trust bar (post-hero)

| Before | After |
|--------|-------|
| Single-line legal strip with links | Icon card grid: Evidence-Based, Licensed, Secure Video, Fast Matching, Australia Wide, Privacy |

### How It Works

| Before | After |
|--------|-------|
| Split layout with image + numbered list | Three step cards with icons: Answer questions → Match → Book instantly (`#how-it-works`) |

### Services

| Before | After |
|--------|-------|
| Three generic service cards | Condition/service grid (Anxiety, Depression, ADHD, Trauma, etc.) linking to `/conditions/*` |

### Featured Psychologists

| Before | After |
|--------|-------|
| Team snapshot split section only | Dedicated card grid from `matchClinicianCatalog` with photo, specialty, languages, Book CTA |

### Why Choose Us

| Before | After |
|--------|-------|
| Multiple separate split sections | Unified alternating image/content blocks: Privacy, Evidence, Matching, Clinicians, Australia Wide |

### Testimonials

| Before | After |
|--------|-------|
| “Moments” image row | Modern testimonial cards with illustrative disclaimer |

### FAQ

| Before | After |
|--------|-------|
| Native `<details>` accordion | Accessible accordion with marketing typography (`#faq`) |

### Footer

| Before | After |
|--------|-------|
| Logo + 5 links | Expanded columns: Company, Services, Resources, Privacy, Support, Contact, social placeholders, newsletter UI, emergency resources (Lifeline 13 11 14, 000) |

## Phased rollout

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Plan doc, marketing tokens, content model | ✅ Complete |
| **Phase 2** | Hero, trust bar, How It Works, Services | ✅ Complete |
| **Phase 3** | Psychologists, Why Choose Us, Testimonials, FAQ | ✅ Complete |
| **Phase 4** | Header/footer chrome, page assembly, build/test | ✅ Complete |

### Deferred (out of scope)

- Animated stat counters
- Video hero background
- Newsletter backend / ESP integration
- AHPRA/Medicare badge artwork (counsel review pending — copy follows existing marketing tone only)
- Deep refactor of non-home marketing pages (`/services`, `/pricing`, etc.)

## Legal / copy notes

- Floating hero stats and testimonials are marked **illustrative** in content; no unverified satisfaction or outcome claims.
- Medicare and AHPRA references align with existing `marketing-metadata` and `public-trust-metrics` tone.
- **Counsel review pending** for any future AHPRA/Medicare identifier graphics or third-party trust seals.

## Key files

| Area | Path |
|------|------|
| Homepage | `app/page.tsx` |
| Content | `content/homepage.ts` |
| Hero | `components/marketing/hero-section.tsx` |
| Trust bar | `components/marketing/home-trust-strip.tsx` |
| How it works | `components/marketing/home-how-it-works-section.tsx` |
| Services grid | `components/marketing/home-services-grid.tsx` |
| Psychologists | `components/marketing/featured-psychologists-section.tsx` |
| Why choose us | `components/marketing/why-choose-us-section.tsx` |
| Testimonials | `components/marketing/testimonials-section.tsx` |
| FAQ | `components/marketing/faq-section.tsx` |
| Header / mobile | `components/layout/public-header.tsx`, `public-header-nav.tsx`, `public-header-mobile-nav.tsx`, `public-nav-mega-menu.tsx` |
| Footer | `components/layout/public-footer.tsx`, `public-footer-accordion.tsx` |
| Nav / footer content | `content/public-nav.ts`, `content/public-footer.ts` |
| Navbar & footer plan | `docs/NAVBAR_FOOTER_UI_REFACTOR.md` |
| Section observer | `components/marketing/homepage-section-observer.tsx` |
| Tokens | `app/globals.css` (`.marketing-*`, `.marketing-card`, smooth scroll) |

## Completion summary

Homepage redesigned with premium healthcare layout, preserved teal brand, dashboard-aligned tokens, scroll reveals, and expanded footer. Build and tests passing. Commit: `227a99a`.
