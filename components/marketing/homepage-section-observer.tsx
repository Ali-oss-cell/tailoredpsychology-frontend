"use client"

import * as React from "react"

const HOMEPAGE_SECTIONS = [
  { id: "how-it-works", label: "How it works" },
  { id: "services", label: "Services" },
  { id: "psychologists", label: "Psychologists" },
  { id: "why-us", label: "Why us" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
] as const

/**
 * Tracks which homepage section is in view and exposes it on `document.body`
 * for header nav active states.
 */
export function HomepageSectionObserver() {
  React.useEffect(() => {
    if (window.location.pathname !== "/") return

    const sections = HOMEPAGE_SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )
    if (!sections.length) return

    let activeId = ""

    const setActive = (id: string) => {
      if (id === activeId) return
      activeId = id
      document.body.dataset.homeActiveSection = id
      window.dispatchEvent(new CustomEvent("home-section-change", { detail: { id } }))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.55] },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      delete document.body.dataset.homeActiveSection
    }
  }, [])

  return null
}

export { HOMEPAGE_SECTIONS }
