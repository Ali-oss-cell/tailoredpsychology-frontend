"use client"

import * as React from "react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

type PublicPageEnterProps = {
  children: React.ReactNode
  className?: string
}

/**
 * One-shot enter on marketing pages. Skipped when `prefers-reduced-motion: reduce`.
 * Home (`/`) uses `HomepageObserver` instead — do not nest both on the same main.
 */
export function PublicPageEnter({ children, className }: PublicPageEnterProps) {
  const innerRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return

    const mq =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null
    if (mq?.matches) {
      gsap.set(el, { clearProps: "opacity,transform" })
      return
    }

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" },
    )
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div
      ref={innerRef}
      className={cn(
        "motion-safe:translate-y-1.5 motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  )
}
