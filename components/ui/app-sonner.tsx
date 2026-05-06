"use client"

import * as React from "react"
import { useNextTheme } from "@space-man/react-theme-animation"
import { Toaster as SonnerToaster } from "sonner"

export function AppSonner() {
  const { resolvedTheme } = useNextTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <SonnerToaster
      theme={theme}
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  )
}
