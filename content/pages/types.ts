export type FeatureItem = {
  title: string
  description: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type PublicHeroAction = {
  label: string
  href: string
  variant?: "default" | "outline"
}

export type PublicCtaBlock = {
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
}

export type PublicDetailPageContent = {
  hero: {
    eyebrow: string
    title: string
    description: string
    /** Short line under the description (e.g. reassurance). */
    kicker?: string
    /** Optional hero buttons above the fold. */
    actions?: PublicHeroAction[]
  }
  split: {
    eyebrow?: string
    title: string
    description: string
    imageSrc: string
    imageAlt: string
    imageOnLeft?: boolean
    action?: { href: string; label: string }
  }
  highlights: {
    title: string
    items: FeatureItem[]
    muted?: boolean
  }
  faq: {
    title: string
    items: FaqItem[]
  }
  /** Centered brand mark strip before FAQ (e.g. tailored logo on About). */
  brandBand?: {
    title: string
    body?: string
    imageSrc: string
    imageAlt: string
    /** `mark` = compact logo-style (default). `photo` = wide editorial crop for photographs. */
    layout?: "mark" | "photo"
  }
  /** Bottom call-to-action; defaults in `PublicDetailPage` when omitted. */
  cta?: PublicCtaBlock
}
