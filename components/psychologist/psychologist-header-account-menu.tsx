"use client"

import * as React from "react"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  Bell,
  CalendarDots,
  CaretRight,
  Key,
  Moon,
  NotePencil,
  Question,
  SignOut,
  Sun,
  SunHorizon,
  UserCircleGear,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr"
import { useNextTheme } from "@space-man/react-theme-animation"

import { getCurrentUser } from "@/src/auth/current-user"
import { cn } from "@/lib/utils"

function initialsFromDisplayName(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const itemClass =
  "focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

const menuSurface =
  "bg-popover text-popover-foreground border-border rounded-lg border shadow-md motion-safe:data-[state=open]:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200 motion-reduce:animate-none"

/** Tiny layered wave accent — Wave 14 style: subtle, respects reduced motion via opacity only. */
function MenuWaveAccent() {
  return (
    <div
      className="pointer-events-none -mx-1 mb-1 mt-0.5 h-4 shrink-0 opacity-40 motion-reduce:opacity-20"
      aria-hidden
    >
      <svg viewBox="0 0 120 16" className="text-primary h-full w-full fill-current" preserveAspectRatio="none">
        <path d="M0 12 Q15 6 30 12 T60 12 T90 12 T120 12 V16 H0Z" opacity="0.85" />
        <path d="M0 14 Q20 9 40 14 T80 14 T120 14 V16 H0Z" opacity="0.5" />
      </svg>
    </div>
  )
}

/**
 * Header avatar + account menu for the psychologist shell.
 *
 * Wave-style grouping: Account → Shortcuts → Preferences → Help → Appearance → Sign out.
 * Motion: contained fade/zoom on open (motion-safe), ~200ms.
 */
export function PsychologistHeaderAccountMenu() {
  const [label, setLabel] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const { resolvedTheme, switchTheme } = useNextTheme()
  const themeValue = resolvedTheme === "dark" ? "dark" : "light"

  React.useEffect(() => {
    let cancelled = false
    void getCurrentUser().then((user) => {
      if (!cancelled) {
        setLabel(user.displayName?.trim() || user.email || "")
        setEmail(user.email ?? "")
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const initials = label ? initialsFromDisplayName(label) : "…"

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className={cn(
            "bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            "ring-offset-background hover:bg-primary/25 focus-visible:ring-ring outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2",
            "motion-safe:transition-transform motion-safe:active:scale-[0.97] motion-reduce:active:scale-100",
          )}
        >
          {initials}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className={cn(
            menuSurface,
            "z-50 max-h-[min(28rem,85vh)] w-[min(18rem,92vw)] overflow-y-auto p-1",
          )}
        >
          <div className="border-border/60 border-b px-2 py-2">
            <p className="truncate text-sm font-medium leading-tight">{label || "Account"}</p>
            {email ? <p className="text-muted-foreground truncate text-xs">{email}</p> : null}
          </div>
          <MenuWaveAccent />

          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
            Account
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/psychologist/profile">
              <UserCircleGear size={16} className="shrink-0 opacity-80" aria-hidden />
              Profile &amp; public bio
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/psychologist/profile#psychologist-profile-security">
              <Key size={16} className="shrink-0 opacity-80" aria-hidden />
              Security &amp; password
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="bg-border/80 -mx-1 my-1 h-px" />

          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
            Shortcuts
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/psychologist/schedule">
              <CalendarDots size={16} className="shrink-0 opacity-80" aria-hidden />
              Schedule
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/psychologist/patients">
              <UsersThree size={16} className="shrink-0 opacity-80" aria-hidden />
              Patients
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/psychologist/notes">
              <NotePencil size={16} className="shrink-0 opacity-80" aria-hidden />
              Notes
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="bg-border/80 -mx-1 my-1 h-px" />

          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
            Preferences
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/psychologist/profile#psychologist-profile-notifications">
              <Bell size={16} className="shrink-0 opacity-80" aria-hidden />
              Notification settings
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="bg-border/80 -mx-1 my-1 h-px" />

          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
            Help
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={itemClass}>
            <a href="mailto:support@clink.test?subject=Tailored%20Psychology%20psychologist%20portal">
              <Question size={16} className="shrink-0 opacity-80" aria-hidden />
              Email support
            </a>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="bg-border/80 -mx-1 my-1 h-px" />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={cn(
                itemClass,
                "data-[state=open]:bg-accent cursor-default pr-1 data-[state=open]:text-accent-foreground",
              )}
            >
              <SunHorizon size={16} className="shrink-0 opacity-80" aria-hidden />
              Appearance
              <CaretRight size={14} className="ml-auto shrink-0 opacity-70" aria-hidden />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                sideOffset={6}
                alignOffset={-4}
                className={cn(menuSurface, "z-[60] min-w-[10.5rem] p-1")}
              >
                <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide">
                  Theme
                </DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  value={themeValue}
                  onValueChange={(v) => void switchTheme(v === "dark" ? "dark" : "light")}
                >
                  <DropdownMenu.RadioItem value="light" className={itemClass}>
                    <Sun size={16} className="shrink-0 opacity-80" aria-hidden />
                    Light
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="dark" className={itemClass}>
                    <Moon size={16} className="shrink-0 opacity-80" aria-hidden />
                    Dark
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="bg-border/80 -mx-1 my-1 h-px" />

          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/logout" className="text-destructive focus:text-destructive">
              <SignOut size={16} className="shrink-0 opacity-80" aria-hidden />
              Sign out
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
