---
name: Clink Design System
colors:
  surface: '#faf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#faf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424848'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#727878'
  outline-variant: '#c2c8c8'
  surface-tint: '#4c6264'
  primary: '#4c6264'
  on-primary: '#ffffff'
  primary-container: '#8fa7a8'
  on-primary-container: '#263d3e'
  inverse-primary: '#b3cbcc'
  secondary: '#566158'
  on-secondary: '#ffffff'
  secondary-container: '#d9e6da'
  on-secondary-container: '#5c675e'
  tertiary: '#75584b'
  on-tertiary: '#ffffff'
  tertiary-container: '#be9b8c'
  on-tertiary-container: '#4c3328'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee7e8'
  primary-fixed-dim: '#b3cbcc'
  on-primary-fixed: '#071f20'
  on-primary-fixed-variant: '#344b4c'
  secondary-fixed: '#d9e6da'
  secondary-fixed-dim: '#becabe'
  on-secondary-fixed: '#141e17'
  on-secondary-fixed-variant: '#3e4941'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#e4bfaf'
  on-tertiary-fixed: '#2b160d'
  on-tertiary-fixed-variant: '#5b4135'
  background: '#faf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  h1:
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  caption:
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  button:
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 4rem
  gutter: 24px
  margin: 32px
  container-max: 1280px
---

## Brand & Style

The visual identity of this design system is built on the intersection of clinical precision and empathetic care. It utilizes a "Modern Corporate" aesthetic softened by minimalist principles to reduce cognitive load for users who may be in vulnerable emotional states. 

The brand personality is authoritative yet approachable—think of a high-end, modern clinic in a coastal Australian setting. It avoids the coldness of traditional healthcare by using organic, sage-tinted neutrals and soft geometric shapes. The style movement prioritizes clarity through generous whitespace (breathing room) and a refined "Modern" approach that aligns perfectly with the Shadcn/ui ecosystem.

## Colors

The color strategy for this design system uses a palette of muted eucalypt greens and mineral teals. 

- **Primary & Secondary:** These colors (#8FA7A8, #9EAA9F) are used for non-interactive elements, illustrations, and subtle UI backgrounds to establish a calming environment.
- **Accent/CTA:** The deeper teal (#5FA8A6) is reserved for interactive elements. It provides sufficient contrast against both light and dark backgrounds to pass AA accessibility standards.
- **Dark Mode Surfaces:** The dark palette follows a tiered approach using Surface 1 and Surface 2 to create depth without relying on harsh blacks, maintaining the "premium" feel.
- **Highlights:** The optional highlight (#00C2B8) should be used sparingly for success states or specialized health metrics.

## Typography

This design system utilizes **Manrope** for all typographic levels. Manrope was selected for its modern, geometric construction that remains highly legible in clinical contexts while feeling more "refined" than standard system fonts.

- **Hierarchy:** Headlines use tighter letter spacing and heavier weights to feel grounded and authoritative. 
- **Readability:** Body text is set with a generous 1.6x line height to ensure that medical notes, patient records, and educational content are easy to digest.
- **Alignment:** Left-alignment is preferred for all body text to maintain a predictable reading rhythm.

## Layout & Spacing

The layout is governed by a **12-column responsive fluid grid**. 

- **Grid Logic:** Use a 12-column grid for desktop (spanning 1280px+), transitioning to a 6-column grid for tablets, and a 2-column grid for mobile devices. 
- **Spacing Rhythm:** This design system follows an 8px (0.5rem) spatial scale. 
- **Breathing Room:** "Premium" quality is achieved through "oversized" padding in containers (typically `spacing.lg` or 32px) to prevent the UI from feeling cluttered or stressful—critical for a psychology platform.

## Elevation & Depth

To maintain a "clinical yet warm" feel, this design system avoids heavy shadows. Instead, it uses **Tonal Layering** and **Ambient Depth**:

- **Low-Contrast Outlines:** Borders use `#2A3333` at 1px width. In light mode, these are softened to 10% opacity to act as subtle guides.
- **Ambient Shadows:** Shadows should be used only on floating elements (Modals, Popovers). Use a large blur radius (24px) with a very low opacity (4-8%) using the Primary color as the shadow tint rather than pure black.
- **Surface Tiering:** 
  - Background: Base color.
  - Surface 1: Used for sidebars and navigation headers.
  - Surface 2: Used specifically for Cards and interactive containers to "lift" them off the page.

## Shapes

The shape language is defined as **Rounded**. This approach avoids the "sharpness" of institutional hospitals while maintaining the structure required for a professional SaaS platform.

- **Components (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Cards & Large Containers:** 1rem (16px) corner radius.
- **Outer Containers (Modals):** 1.5rem (24px) corner radius.
- **Chips/Badges:** Pill-shaped (full radius) to distinguish them from interactive buttons.

## Components

### Buttons
- **Default:** Background `#5FA8A6`, Text `#E6ECEB`.
- **Hover:** Background `#3E7C7A`. Transition duration 200ms.
- **Active:** Scale transform 0.98 for tactile feedback.
- **Ghost/Outline:** Border 1px `#5FA8A6`, Text `#5FA8A6`.

### Cards
- **Structure:** `radius_lg`, Background `Dark Surface 2` or White. 
- **Content:** Padding should be consistent at `spacing.md`. Avoid borders if using ambient shadows; use borders if the background is the same color as the card.

### Forms
- **Input Fields:** 1px border using `#2A3333`. Focus state uses `Accent/CTA` color for the border and a 2px outer glow.
- **Validation:** Errors use a soft red (not in palette, suggest `#E57373`) with icons. Success states use `#00C2B8`.

### Tables
- **Empty State:** Use a centered illustration in `Primary` #8FA7A8 with a clear CTA to "Add New Record."
- **Filtered State:** Highlight the active filter chip in `Secondary` #9EAA9F.
- **Styling:** Row height 56px, subtle border-bottom on every row. No vertical borders.

### Navbars by Role
1. **Public:** Transparent to solid on scroll. Links: Find a Psych, Services, Fees, Login (Primary CTA).
2. **Patient:** Focus on accessibility. Links: My Appointments, Messages, Care Plan, Billing.
3. **Psychologist:** Focus on utility. Links: Schedule, Patient List, Case Notes, Supervision.
4. **Manager:** Focus on oversight. Links: Clinic Analytics, Practitioner Performance, Payouts.
5. **Admin:** Full access. Links: User Management, System Config, Audit Logs, Integration Settings.

### Additional Components
- **Progress Stepper:** For onboarding patients; uses `#8FA7A8` for completed steps.
- **Status Badges:** For appointment status (e.g., "Confirmed," "Completed," "Cancelled").