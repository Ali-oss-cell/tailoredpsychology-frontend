"use client"

import * as React from "react"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  CalendarDots,
  CaretRight,
  ClipboardText,
  CurrencyCircleDollar,
  Gear,
  House,
  Moon,
  Question,
  ShieldCheck,
  SignOut,
  Sun,
  SunHorizon,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr"
import { useNextTheme } from "@space-man/react-theme-animation"

import { LogoutLink } from "@/components/auth/logout-link"
import { getCurrentUser, type CurrentUser } from "@/src/auth/current-user"
import { cn } from "@/lib/utils"

type OpsHeaderAccountMenuProps = {
  mode: "manager" | "admin"
}

function initialsFromDisplayName(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function roleLabel(role: CurrentUser["role"]): string {
  if (role === "practice_manager") return "Practice manager"
  if (role === "admin") return "Administrator"
  return role
}

const itemClass =
  "focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

const menuSurface =
  "bg-popover text-popover-foreground border-border rounded-lg border shadow-md motion-safe:data-[state=open]:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200 motion-reduce:animate-none"

export function OpsHeaderAccountMenu({ mode }: OpsHeaderAccountMenuProps) {
  const [label, setLabel] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<CurrentUser["role"] | null>(null)
  const { resolvedTheme, switchTheme } = useNextTheme()
  const themeValue = resolvedTheme === "dark" ? "dark" : "light"

  React.useEffect(() => {
    let cancelled = false
    void getCurrentUser().then((user) => {
      if (!cancelled) {
        setLabel(user.displayName?.trim() || user.email || "")
        setEmail(user.email ?? "")
        setRole(user.role)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const initials = label ? initialsFromDisplayName(label) : "…"
  const dashboardHref = mode === "manager" ? "/manager/dashboard" : "/admin/dashboard"

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
          className={cn(menuSurface, "z-50 max-h-[min(28rem,85vh)] w-[min(18rem,92vw)] overflow-y-auto p-1")}
        >
          <div className="border-border/60 border-b px-2 py-2">
            <p className="truncate text-sm font-medium leading-tight">{label || "Account"}</p>
            {email ? <p className="text-muted-foreground truncate text-xs">{email}</p> : null}
            {role ? <p className="text-muted-foreground mt-0.5 text-xs">{roleLabel(role)}</p> : null}
          </div>

          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
            Shortcuts
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link href={dashboardHref}>
              <House size={16} className="shrink-0 opacity-80" aria-hidden />
              Dashboard
            </Link>
          </DropdownMenu.Item>
          {mode === "manager" ? (
            <>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/manager/staff">
                  <UsersThree size={16} className="shrink-0 opacity-80" aria-hidden />
                  Staff
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/manager/patients">
                  <ClipboardText size={16} className="shrink-0 opacity-80" aria-hidden />
                  Patients
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/manager/appointments">
                  <CalendarDots size={16} className="shrink-0 opacity-80" aria-hidden />
                  Appointments
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/manager/billing">
                  <CurrencyCircleDollar size={16} className="shrink-0 opacity-80" aria-hidden />
                  Billing
                </Link>
              </DropdownMenu.Item>
            </>
          ) : (
            <>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/admin/users">
                  <UsersThree size={16} className="shrink-0 opacity-80" aria-hidden />
                  Users
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/admin/patients">
                  <ClipboardText size={16} className="shrink-0 opacity-80" aria-hidden />
                  Patients
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/admin/settings">
                  <Gear size={16} className="shrink-0 opacity-80" aria-hidden />
                  Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className={itemClass}>
                <Link href="/admin/audit-logs">
                  <ShieldCheck size={16} className="shrink-0 opacity-80" aria-hidden />
                  Audit logs
                </Link>
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator className="bg-border/80 -mx-1 my-1 h-px" />

          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium tracking-wide uppercase">
            Help
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={itemClass}>
            <a href="mailto:support@clink.test?subject=Tailored%20Psychology%20operations%20portal">
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
            <LogoutLink className="text-destructive focus:text-destructive">
              <SignOut size={16} className="shrink-0 opacity-80" aria-hidden />
              Sign out
            </LogoutLink>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
