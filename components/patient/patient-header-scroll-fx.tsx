"use client"

import * as React from "react"

/**
 * Glass elevation on the patient portal header once the main pane scrolls.
 */
export function PatientHeaderScrollFx() {
  React.useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-patient-header]")
    const main = document.querySelector<HTMLElement>("[data-tutorial='shell.main']")
    if (!header || !main) return

    const update = () => {
      header.setAttribute("data-scrolled", main.scrollTop > 8 ? "true" : "false")
    }
    update()
    main.addEventListener("scroll", update, { passive: true })
    return () => main.removeEventListener("scroll", update)
  }, [])

  return null
}
