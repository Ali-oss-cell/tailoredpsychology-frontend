"use client"

import { useNextTheme } from "@space-man/react-theme-animation"
import { Moon, Sun } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme, ref } = useNextTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => void toggleTheme()}
      className="relative"
    >
      <Sun size={18} weight="duotone" className="hidden dark:block" />
      <Moon size={18} weight="duotone" className="block dark:hidden" />
    </Button>
  )
}
