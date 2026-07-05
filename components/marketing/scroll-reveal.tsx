"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  delayMs?: number
  /** Stagger direct children when the block enters view. */
  staggerChildren?: boolean
  staggerStepMs?: number
}

/**
 * Fade+rise on enter viewport. Respects prefers-reduced-motion via globals.css.
 * Landing page uses GSAP ScrollTrigger via `ScrollSection` instead.
 */
export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  staggerChildren = false,
  staggerStepMs = 80,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      node.setAttribute("data-reveal", "visible")
      if (staggerChildren) node.setAttribute("data-reveal-stagger", "visible")
      return
    }

    node.setAttribute("data-reveal", "")
    if (delayMs > 0) node.style.setProperty("--reveal-delay", `${delayMs}ms`)

    if (staggerChildren) {
      node.setAttribute("data-reveal-stagger", "")
      Array.from(node.children).forEach((child, index) => {
        ;(child as HTMLElement).style.setProperty("--reveal-stagger", `${index * staggerStepMs}ms`)
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.setAttribute("data-reveal", "visible")
          if (staggerChildren) node.setAttribute("data-reveal-stagger", "visible")
          observer.disconnect()
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [delayMs, staggerChildren, staggerStepMs])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
