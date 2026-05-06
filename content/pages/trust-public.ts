import type { PublicCtaBlock } from "@/content/pages/types"

export const trustHero = {
  eyebrow: "Trust and safety",
  title: "Trust metrics and privacy controls",
  description:
    "We publish operational trust signals and governance controls so patients and referrers can see how care quality and privacy are protected—not only claimed.",
  kicker:
    "Metrics are operational summaries, not guarantees of outcomes. Sources and refresh dates appear on each card.",
  actions: [
    { label: "See comparison", href: "/why-clink?source=trust", variant: "outline" as const },
    { label: "Get matched", href: "/get-matched?source=trust", variant: "default" as const },
  ],
}

export const trustCta: PublicCtaBlock = {
  title: "Dig into pricing and pathways next",
  description: "Transparent fees and Medicare context sit alongside this page—book when you are ready.",
  primaryHref: "/pricing?source=trust",
  primaryLabel: "View pricing",
  secondaryHref: "/medicare-rebates?source=trust",
  secondaryLabel: "Medicare rebates",
}
