"use client"

import * as React from "react"
import gsap from "gsap"
import { Observer } from "gsap/Observer"

gsap.registerPlugin(Observer)

/**
 * Home-only: section intro + light hero parallax. Does not translate the sticky header
 * so the nav stays stable while scrolling.
 */
export function HomepageObserver() {
  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const heroPanel = document.querySelector<HTMLElement>("[data-hero-panel]")
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > *"))

    const intro = prefersReducedMotion
      ? gsap.set(sections, { autoAlpha: 1, y: 0 })
      : gsap.fromTo(
          sections,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
        )

    const observer = prefersReducedMotion
      ? null
      : Observer.create({
          id: "homepage-observer",
          target: window,
          type: "wheel,touch,pointer,scroll",
          tolerance: 8,
          onDown: () => {
            if (heroPanel) {
              gsap.to(heroPanel, { y: 6, duration: 0.28, ease: "power2.out" })
            }
          },
          onUp: () => {
            if (heroPanel) {
              gsap.to(heroPanel, { y: -4, duration: 0.26, ease: "power2.out" })
            }
          },
          onStop: () => {
            if (heroPanel) {
              gsap.to(heroPanel, { y: 0, duration: 0.35, ease: "power2.out" })
            }
          },
        })

    return () => {
      if (!prefersReducedMotion) {
        intro.kill()
      }
      observer?.kill()
      if (heroPanel) {
        gsap.set(heroPanel, { clearProps: "transform" })
      }
    }
  }, [])

  return null
}
