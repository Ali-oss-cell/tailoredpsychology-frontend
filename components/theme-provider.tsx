"use client"

import * as React from "react"
import { NextThemeProvider, useNextTheme } from "@space-man/react-theme-animation"

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      colorThemes={["default"]}
      defaultColorTheme="default"
      defaultTheme="light"
      disableAnimationOnInit
      duration={420}
      storageKey="theme"
      colorStorageKey="clink-color-theme"
      themes={["light", "dark"]}
    >
      <ThemeHotkey />
      {children}
    </NextThemeProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { toggleTheme } = useNextTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const key = event.key
      if (typeof key !== "string" || key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      void toggleTheme(true)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [toggleTheme])

  return null
}

export { ThemeProvider }
