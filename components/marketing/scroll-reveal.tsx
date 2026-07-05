"use client"

import * as React from "react"

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  delayMs?: number
}

/**
 * Fade+rise on enter viewport. Respects prefers-reduced-motion via globals.css.
 */
export function ScrollReveal({ children, className, delayMs = 0 }: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      node.setAttribute("data-reveal", "visible")
      return
    }

    node.setAttribute("data-reveal", "")
    if (delayMs > 0) node.style.setProperty("--reveal-delay", `${delayMs}ms`)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.setAttribute("data-reveal", "visible")
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [delayMs])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
