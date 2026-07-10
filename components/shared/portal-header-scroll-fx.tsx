"use client"

import * as React from "react"

type PortalHeaderScrollFxProps = {
  headerSelector: string
  mainSelector?: string
}

/**
 * Glass elevation on portal headers once the main pane scrolls.
 */
export function PortalHeaderScrollFx({
  headerSelector,
  mainSelector = "[data-tutorial='shell.main']",
}: PortalHeaderScrollFxProps) {
  React.useEffect(() => {
    const header = document.querySelector<HTMLElement>(headerSelector)
    const main = document.querySelector<HTMLElement>(mainSelector)
    if (!header || !main) return

    const update = () => {
      header.setAttribute("data-scrolled", main.scrollTop > 8 ? "true" : "false")
    }
    update()
    main.addEventListener("scroll", update, { passive: true })
    return () => main.removeEventListener("scroll", update)
  }, [headerSelector, mainSelector])

  return null
}
