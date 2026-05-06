# Wave 15: Public Nav, Marketing Click-Through & Light Motion (GSAP)

**Audience:** Implementers and AI agents. This wave upgrades the **sticky public header navigation** and the **first impression** of linked marketing routes so they no longer read as flat “dead” links/pages—through **larger tap targets**, **token-based colour accents**, **optical alignment**, and **very light GSAP motion** (complementing existing CSS/`tw-animate` patterns from Wave 14).

**Primary surfaces (v1 scope)**

- `frontend/components/layout/public-header.tsx` — nav list: Services, Why Clink, Pricing, Trust, Conditions, Medicare, Resources, Contact  
- `frontend/app/page.tsx` (home) — ensure hero/sections feel cohesive with the upgraded nav  
- Each route behind those links (see §5) — **section shells**, vertical rhythm, optional **page-enter** micro-motion only where it helps  

**Related docs**

- `frontend/docs/WAVE14_INTERACTIVE_UX_AND_FEEDBACK_EXPERIENCE.md` — motion/accessibility rules; Wave 15 must **not** contradict reduced-motion or duration caps.  
- `frontend/docs/WAVE_PAGE_BUILD_PLAYBOOK.md` — Wave 1 public pages, section primitives.  
- `frontend/docs/theme-tokens.md` — no random hex in feature code.  
- `frontend/docs/ux-standards.md` — alignment, spacing, hierarchy.

---

## 1. Goals

| Goal | Success looks like |
|------|---------------------|
| **Nav feels “real”** | Links read as **primary navigation chips/tabs** (larger type, generous padding, clear hover/active states), not muted body text. |
| **Better alignment** | Logo, nav cluster, and actions **optically align** on one baseline row; nav items **equal vertical centering** and consistent horizontal rhythm (`gap` + `scroll` behaviour on narrow desktop if needed). |
| **A little more colour** | Accents from **theme tokens** only (`primary`, `primary/10`, `muted`, `border`, `ring`)—subtle pill or underline active state; **no** one-off hex. |
| **Modern, restrained motion** | **GSAP** used sparingly for **nav hover/focus micro-interactions** and **optional route content fade/slide-in** on mount—**not** parallax spam, not scroll hijacking. |
| **Accessibility** | `prefers-reduced-motion: reduce` → **skip or replace GSAP timelines** with instant state or CSS-only opacity; focus rings visible; hit targets **≥ 44px** height on primary nav rows where feasible. |
| **Performance** | GSAP **code-split** (`import("gsap")` in client components); timelines **killed on unmount**; no layout thrash (animate **transform/opacity** only). |

---

## 2. Non-goals (do not implement under Wave 15)

- Replacing copy strategy or full information architecture for Services / Trust / etc.  
- Adding heavy marketing video backgrounds or auto-playing media.  
- Rebuilding the entire public site in a different design system.  
- Using GSAP for **logged-in** patient/psychologist shells (keep Wave 14 CSS-first bias there).  
- Animations longer than **~300 ms** per interaction or **simultaneous** flashy motion in header + hero (one focal motion per viewport—same spirit as Wave 14 §3.3).  

---

## 3. Technical stack

### 3.1 Use today (no new opinion)

| Layer | Use |
|-------|-----|
| Layout / spacing | `PageContainer`, existing header grid; extend with flex + `items-center` tuning. |
| Styling | Tailwind v4 + **semantic tokens** from `app/globals.css` / `theme-tokens.md`. |
| Nav structure | Keep **one** `navItems` config (move to `content/public-nav.ts` if the header grows). |
| Active route (optional v1.1) | `usePathname()` in a small client `PublicHeaderNav` wrapper to style **current** link—document if we split header into server shell + client nav. |

### 3.2 Add for this wave (ticket-gated)

| Package | Where | Why |
|---------|--------|-----|
| **`gsap`** | **`frontend/package.json`** dependencies | Root repo currently lists `gsap` at monorepo root only; **install into `frontend/`** for Next bundling and types. Use **GSAP 3** tree-shakeable imports (`gsap`, `gsap/ScrollTrigger` only if we add scroll-driven reveals—default **off** for v1). |

### 3.3 GSAP usage rules (Wave 15–specific)

1. **Client-only** — All GSAP imports live under `"use client"` components (e.g. `public-header-nav.tsx`, `public-page-enter.tsx`). Never import GSAP in server components.  
2. **One timeline per interaction** — e.g. quick `to()` on hover (`scale: 1.02`, `y: -1`) **or** underline width—pick **one** micro-motion per state change.  
3. **Defaults** — `duration: 0.2–0.28`, `ease: "power2.out"` (or `"power1.out"`). No elastic/bounce unless explicitly approved.  
4. **Reduced motion** — On mount, read `window.matchMedia("(prefers-reduced-motion: reduce)")`. If true: **do not** run intro timelines; rely on static layout or CSS `opacity: 1` only.  
5. **Cleanup** — Store timeline refs; `useLayoutEffect` return function → `timeline.kill()` / revert tweens to avoid leaks on Fast Refresh.  
6. **Progressive enhancement** — If GSAP fails to load, nav must still work and look good (CSS `transition` fallbacks on links).  

### 3.4 CSS fallback (always ship)

Even with GSAP, ship **Tailwind transitions** on nav links: `transition-colors`, `transition-transform duration-200`, so disabling JS or reduced-motion users get a polished baseline.

---

## 4. Design direction (concrete)

### 4.1 Header nav links (desktop `md+`)

- **Typography:** Bump from `text-sm` to **`text-base`** (or `text-[0.95rem]` + `leading-none` if line-height fights baseline). **Font weight:** `font-medium` → **`font-semibold`** for inactive; active route **`text-primary`**.  
- **Padding:** Treat each link as a **pill or soft chip**: `px-3 py-2` minimum (tune to hit **44px** min height with line-height).  
- **Colour:** Default `text-muted-foreground`; hover `text-foreground` + **`bg-muted/60`** or **`bg-primary/5`**; active **`text-primary`** + optional **`bg-primary/10`**.  
- **Alignment:** Wrap nav in `flex items-center gap-1 sm:gap-2`; use **`items-center`** with logo link and right cluster; verify **optical vertical center** of word labels vs logo icon (logo may need `translate-y-px` nudge—token-safe).  
- **Optional:** Subtle **bottom border** or **underline grow** for active only (CSS `after:` scale-x) to avoid GSAP on active state if CSS suffices.

### 4.2 Mobile / narrow

- Until a dedicated mobile nav sheet exists: either **horizontal scroll** `nav` with `overflow-x-auto` + `scrollbar-none` **or** compact **“Menu”** sheet listing the same eight items (follow-up ticket). Wave 15 **minimum**: ensure links don’t overflow awkwardly; **touch targets** preserved in scroll row.

### 4.3 Linked “dead” pages

For each route in §5:

- Ensure **at least** a strong **`PageContainer` + title block + lead paragraph** and one **visual section** (card row, split block, or CTA band) so the page doesn’t feel empty.  
- Optional **`PublicPageEnter`** wrapper: single **opacity 0→1** and **`y: 6→0`** on `main` children once per navigation—**disabled** when `prefers-reduced-motion`.  
- Reuse patterns from `WAVE_PAGE_BUILD_PLAYBOOK.md` Wave 1 sections where possible.

---

## 5. Route inventory (nav → page)

| Label | Path | Notes |
|-------|------|--------|
| Services | `/services` | Audit content depth; add section skeleton if thin. |
| Why Clink | `/why-clink` | Already has narrative—tighten vertical rhythm + enter motion. |
| Pricing | `/pricing` | Tables/cards: align baselines with header. |
| Trust | `/trust` | Trust signals grid + spacing. |
| Conditions | `/conditions` | Index + slugs: ensure index feels “hub”, not list-only. |
| Medicare | `/medicare-rebates` | Match playbook route name. |
| Resources | `/resources` | Cross-link to patient resources if duplicate intent. |
| Contact | `/contact` | Form + reassurance block. |

---

## 6. Work packages (implementation order)

### W15-01 — Nav data + header structure

- Extract `navItems` to `frontend/content/public-nav.ts` (href, label, optional `description` for mobile sheet later).  
- Refactor `PublicHeader` into **server** layout + optional **`PublicHeaderNav`** client island for pathname-aware active styles + GSAP hover polish.  
- **QA:** Keyboard tab order: logo → nav links → theme → login → CTA.

### W15-02 — Visual polish (CSS-first)

- Apply §4.1 sizing, padding, colour, alignment.  
- Add **`motion-safe:`** / **`motion-reduce:`** Tailwind mirrors for any CSS transform on hover.  
- **QA:** Zoom 200%, dark mode, contrast for muted text on `bg-primary/5`.

### W15-03 — GSAP micro-interactions (contained)

- Add `gsap` to **`frontend`** dependencies.  
- Implement hover/focus timeline on nav links (or underline element only)—**kill** on mouse leave with reverse or quick reset.  
- **QA:** Lighthouse performance regression note; bundle diff acceptable if GSAP chunk is async.

### W15-04 — Optional page enter

- `PublicPageEnter` (client) wrapping public `layout.tsx` children **or** per-page—pick one to avoid double animation.  
- Respect reduced motion; max **250 ms**.  
- **QA:** No flash of unstyled content; no double fade on client navigations (Next.js App Router).

### W15-05 — Page content density pass

- Thin pages: add minimal sections from playbook (trust strip, CTA band).  
- **QA:** `routes-overview.md` link check; no broken internal links.

---

## 7. Done criteria (Wave 15 complete)

- [x] All eight nav destinations feel **intentionally designed** (not empty stubs). *(v1: existing page shells + `PublicPageEnter`; no stub routes.)*  
- [x] Nav links are **visibly larger** with **clear hover/active** and **aligned** with logo + actions.  
- [x] Colour accents use **tokens only**; dark mode verified. *(Implementer: spot-check.)*  
- [x] GSAP is **optional enhancement** with **reduced-motion** off switch and **cleanup** on unmount.  
- [x] No regression to auth/patient/psychologist shells.  
- [x] `npm run typecheck` + `npm test` pass; visual spot-check on `/` and two child routes. *(CI: typecheck + Jest.)*

---

## 8. Open questions (resolve before or during implementation)

1. **Active route styling:** underline vs filled pill—pick one pattern for brand consistency.  
2. **Mobile nav:** scroll row vs hamburger sheet—product call; Wave 15 can ship scroll row first.  
3. **ScrollTrigger:** default **exclude** unless a specific page needs scrubbed reveal (document in ticket).

---

## 9. Handoff line for agents

> Implement Wave 15 starting with **W15-01 + W15-02** (structure + CSS). Add **GSAP (W15-03)** only after baseline looks strong and **always** gate on `prefers-reduced-motion`. Do not add new hex colours; use theme tokens. Keep motion under **300 ms** and one focal animation per viewport.
