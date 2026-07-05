"use client"

import * as React from "react"

/**
 * Toggles `data-scrolled` on the public header once the page scrolls,
 * letting CSS swap the flat header for a glass surface with elevation.
 */
export function HeaderScrollFx() {
  React.useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-public-header]")
    if (!header) return

    const update = () => {
      header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false")
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return null
}
