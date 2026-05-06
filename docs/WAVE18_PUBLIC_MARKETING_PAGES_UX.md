# Wave 18: Public marketing pages — content, visuals, and interaction

**Audience:** Product, design, frontend, and agents improving **logged-out** marketing routes that explain services, positioning, pricing, trust, Medicare, resources, and contact.

**Primary promise**

> Visitors get **consistent, credible, and calm** pages: correct imagery, readable data (fees, rebates, trust signals), light motion that respects **reduced motion**, and clear next steps—without turning marketing into a second product surface.

---

## Related docs

| Doc | Relevance |
|-----|-----------|
| `WAVE15_PUBLIC_NAV_AND_MARKETING_PAGES.md` | IA, header/footer, and public nav boundaries. |
| `WAVE_PAGE_BUILD_PLAYBOOK.md` | Section rhythm, `PageContainer` / `PageSection` patterns. |
| `frontend/docs/routes-overview.md` | Canonical public routes. |
| `frontend/docs/IMAGE_CREDITS.md` | Attribution for committed marketing photos (e.g. Unsplash License). |

---

## 1. In-scope routes

| Route | Page module | Notes |
|-------|-------------|--------|
| `/services` | `app/services/page.tsx` → `PublicDetailPage` | Rich layout; content in `content/pages/services.ts`. |
| `/why-clink` | `app/why-clink/page.tsx` | Comparison + CTAs; align hero/sections with detail pages. |
| `/pricing` | `app/pricing/page.tsx` | `publicPricing` data + gap examples. |
| `/trust` | `app/trust/page.tsx` | `publicTrustMetrics` + `privacyControls`. |
| `/medicare-rebates` | `app/medicare-rebates/page.tsx` → `PublicDetailPage` | Content + split image. |
| `/resources` | `app/resources/page.tsx` → `PublicDetailPage` | Library narrative + FAQs. |
| `/contact` | `app/contact/page.tsx` → `PublicDetailPage` | Support pathways + FAQs. |

---

## 2. Goals

| ID | Goal | Success looks like |
|----|------|---------------------|
| G1 | **Visual consistency** | All seven routes share ambient background, typography rhythm, and section spacing aligned with `PageHero` / `PageSection` / `CtaStrip`. |
| G2 | **Honest, current data** | Pricing table, gap examples, trust metrics, and disclaimers have **visible last-updated** cues where numbers are shown; copy avoids over-claiming. |
| G3 | **Working media** | Local `next/image` targets resolve to real files under `public/` (or allowed remote hosts in `next.config.mjs`). |
| G4 | **Light interactivity** | Cards and comparison rows use **hover/focus** affordances; FAQ uses native `<details>`; no layout thrash; `prefers-reduced-motion` respected for enter animations (`PublicPageEnter`). |
| G5 | **Conversion clarity** | Each page ends with a **single** strong `CtaStrip`-style block (or equivalent) with primary + secondary actions and `?source=` where analytics need it. |

---

## 3. Non-goals

- Replacing the whole marketing stack with a CMS (content can stay in TS modules).  
- Full illustration commission or stock library licensing workflow (use **allowed** remotes + `public/` assets only).  
- Personalisation, A/B framework, or geo-based pricing automation.  
- Patient portal shell (`/patient/*`) — Wave 17 territory.

---

## 4. Implementation checklist (shippable slices)

### Slice A — Foundation (P0)

1. **`PublicMarketingAmbient`** (or equivalent): subtle gradient/blur layer behind `main` on public pages using `PublicDetailPage` and the inline marketing pages.  
2. **Asset audit:** replace broken `/assets/*.jpg` references with committed **`public/assets/*.svg`** (or add WebP/JPEG to `public/` and update `next.config.mjs` if using raster).  
3. **`next.config.mjs`:** keep `images.remotePatterns` minimal; add hosts only when a page **actually** uses that remote `Image` `src`.

### Slice B — Why Clink + Pricing + Trust (P1)

1. **Why Clink:** `PageHero` + comparison grid (Clink vs “typical telehealth” columns), disclaimer band, `CtaStrip`, optional **FAQ** (category-level, non-defamatory).  
2. **Pricing:** hero + fee cards + gap cards with clearer hierarchy; add **FAQ** block (Medicare eligibility, gap vs rebate, “not financial advice”).  
3. **Trust:** hero + metric cards (value + caption + source line) + privacy controls as **cards** or icon list (not a bare `<ul>` wall).

### Slice C — Detail pages polish (P1)

1. **`SplitFeatureSection`:** image frame hover (shadow/ring), `motion-reduce` safe.  
2. **Optional `brandBand`** on 1–2 detail routes where it strengthens narrative (resources, services) — only if assets exist.  
3. **Cross-links:** small “Related pages” row on pricing → `/medicare-rebates`, `/trust`; trust → `/why-clink`, `/pricing`.

### Slice D — Content ops (P2)

1. **Quarterly review:** `publicPricing.updatedAt`, `TrustMetric.updatedAt`, disclaimer strings.  
2. **Analytics:** ensure `PublicCtaLink` `eventName` coverage matches new CTAs where events matter.  
3. **Stock photos:** prefer **committed** raster or SVG under `public/` so pages do not depend on runtime fetches to third-party CDNs unless legal/comms explicitly approves hotlinking.

---

## 5. Acceptance criteria

| # | Criterion |
|---|-----------|
| AC1 | No **404** image requests on the seven routes in a cold load (network tab). |
| AC2 | With **prefers-reduced-motion: reduce**, `PublicPageEnter` does not run GSAP tween (content visible, no “flash hidden”). |
| AC3 | Keyboard: FAQ `<summary>` is focusable; comparison cards don’t trap focus. |
| AC4 | `npx tsc --noEmit` passes; any changed marketing page has or updates a **smoke** test if the repo already tests similar pages. |

---

## 6. Definition of Done (Wave 18)

- Slice A complete (ambient + fixed assets + image config).  
- Why Clink, Pricing, Trust meet G1/G4 at minimum.  
- This doc’s **§4** checklist updated in-repo when scope changes (dated note).  

### 6.1 Implementation log

| Date | Notes |
|------|--------|
| 2026-05-02 | Shipped: `PublicMarketingAmbient` on `PublicDetailPage` + rebuilt `/why-clink`, `/pricing`, `/trust` with `PageHero`, richer cards, FAQs / related strip where noted; fixed committed SVG paths for services/contact/resources/medicare detail content; `SplitFeatureSection` image hover polish. |
| 2026-05-02 | Removed Unsplash hotlinks and `images.unsplash.com` remote pattern—marketing imagery stays on committed `public/` assets (and existing Pexels where already used) to avoid runtime dependency on stock CDNs. |
| 2026-05-03 | Added three **Unsplash License** JPEGs under `public/assets/` (see `IMAGE_CREDITS.md`); wired to `/services`, `/resources`, `/contact` split sections. Skipped two **Unsplash+** picks (brain, couch) pending proper Plus licensing. |

**End of Wave 18 spec.**
