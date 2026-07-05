"use client"

import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SCROLL_START = "top 84%"
const SCROLL_START_TIGHT = "top 78%"

function hideBeforeScroll(targets: gsap.TweenTarget, vars: gsap.TweenVars) {
  gsap.set(targets, vars)
}

/**
 * Home-only: GSAP ScrollTrigger section reveals + hero parallax.
 * Targets `[data-scroll-section]` wrappers from `ScrollSection`.
 */
export function HomepageObserver() {
  React.useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const heroSection = document.querySelector<HTMLElement>("[data-scroll-hero]")
    const heroPanel = document.querySelector<HTMLElement>("[data-hero-panel]")
    const heroCopy = document.querySelector<HTMLElement>("[data-hero-copy]")

    const ctx = gsap.context(() => {
      if (heroCopy) {
        const enterItems = heroCopy.querySelectorAll<HTMLElement>("[data-hero-enter]")
        gsap.from(enterItems, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          delay: 0.2,
        })
      }

      if (heroPanel && heroSection) {
        gsap.to(heroPanel, {
          y: -56,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 0.85,
          },
        })
      }

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="rise"]').forEach((el) => {
        hideBeforeScroll(el, { autoAlpha: 0, y: 64 })
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="rise-scale"]').forEach((el) => {
        hideBeforeScroll(el, { autoAlpha: 0, y: 80, scale: 0.92 })
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="split"]').forEach((el) => {
        const grid = el.querySelector<HTMLElement>(".lg\\:grid-cols-2")
        if (!grid) return
        const cols = Array.from(grid.children) as HTMLElement[]
        if (cols.length < 2) return

        hideBeforeScroll(cols, { autoAlpha: 0 })
        gsap.set(cols[0], { x: -72 })
        gsap.set(cols[1], { x: 72, scale: 0.94 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: SCROLL_START_TIGHT, once: true },
        })
        tl.to(cols[0], { x: 0, autoAlpha: 1, duration: 0.95, ease: "power3.out" }, 0)
          .to(cols[1], { x: 0, autoAlpha: 1, scale: 1, duration: 0.95, ease: "power3.out" }, 0.1)
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="cards"]').forEach((el) => {
        const header = el.querySelector<HTMLElement>(":scope h2")
        const items = el.querySelectorAll<HTMLElement>(":scope .grid > *")

        if (header) hideBeforeScroll(header, { autoAlpha: 0, y: 48 })
        if (items.length) hideBeforeScroll(items, { autoAlpha: 0, y: 56, scale: 0.9 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
        })
        if (header) {
          tl.to(header, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }
        if (items.length) {
          tl.to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              stagger: 0.12,
              ease: "power3.out",
            },
            header ? "-=0.4" : 0,
          )
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="process"]').forEach((el) => {
        const header = el.querySelector<HTMLElement>(":scope h2")
        const steps = el.querySelectorAll<HTMLElement>(":scope ol > li")
        const imageCol = el.querySelector<HTMLElement>(":scope .lg\\:grid-cols-2 > div:last-child")

        if (header) hideBeforeScroll(header, { autoAlpha: 0, y: 44 })
        if (steps.length) hideBeforeScroll(steps, { autoAlpha: 0, x: -40 })
        if (imageCol) hideBeforeScroll(imageCol, { autoAlpha: 0, x: 64, scale: 0.93 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: SCROLL_START_TIGHT, once: true },
        })
        if (header) tl.to(header, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" })
        if (steps.length) {
          tl.to(
            steps,
            { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.16, ease: "power3.out" },
            "-=0.35",
          )
        }
        if (imageCol) {
          tl.to(imageCol, { autoAlpha: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out" }, "-=0.55")
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="faq"]').forEach((el) => {
        const header = el.querySelector<HTMLElement>(":scope h2")
        const items = el.querySelectorAll<HTMLElement>(":scope details")

        if (header) hideBeforeScroll(header, { autoAlpha: 0, y: 40 })
        if (items.length) hideBeforeScroll(items, { autoAlpha: 0, y: 28 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
        })
        if (header) tl.to(header, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" })
        if (items.length) {
          tl.to(items, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power2.out" }, "-=0.3")
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-section="band"]').forEach((el) => {
        const inner = el.querySelector<HTMLElement>(":scope .rounded-3xl")
        const cards = el.querySelectorAll<HTMLElement>(":scope .grid > *")

        if (inner) hideBeforeScroll(inner, { autoAlpha: 0, y: 48, scale: 0.94 })
        if (cards.length) hideBeforeScroll(cards, { autoAlpha: 0, y: 36 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
        })
        if (inner) tl.to(inner, { autoAlpha: 1, y: 0, scale: 1, duration: 0.95, ease: "power3.out" })
        if (cards.length) {
          tl.to(cards, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.11, ease: "power2.out" }, "-=0.45")
        }
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
