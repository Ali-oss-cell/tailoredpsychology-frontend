"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import { Rows } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  state: "expanded" | "collapsed"
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  storageKey?: string
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  storageKey,
  className,
  ...props
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const hasLoadedStoredPreference = React.useRef(false)
  const open = controlledOpen ?? uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen)
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen)
      }
    },
    [controlledOpen, onOpenChange],
  )

  const toggleSidebar = React.useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  React.useEffect(() => {
    if (controlledOpen !== undefined || !storageKey || typeof window === "undefined") {
      return
    }

    if (hasLoadedStoredPreference.current) {
      return
    }

    const stored = window.localStorage.getItem(storageKey)
    if (stored !== null) {
      setUncontrolledOpen(stored === "1")
    }
    hasLoadedStoredPreference.current = true
  }, [controlledOpen, storageKey])

  React.useEffect(() => {
    if (controlledOpen !== undefined || !storageKey || typeof window === "undefined") {
      return
    }

    if (!hasLoadedStoredPreference.current) {
      return
    }

    window.localStorage.setItem(storageKey, open ? "1" : "0")
  }, [controlledOpen, open, storageKey])

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, toggleSidebar, state: open ? "expanded" : "collapsed" }}
    >
      <div className={cn("group/sidebar-wrapper flex min-h-screen w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

type SidebarProps = React.ComponentProps<"aside"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}

export function Sidebar({
  className,
  children,
  collapsible = "icon",
  variant = "sidebar",
  ...props
}: SidebarProps) {
  const { state } = useSidebar()
  const collapsed = collapsible === "icon" && state === "collapsed"

  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      data-collapsible={collapsible}
      data-variant={variant}
      className={cn(
        "group/sidebar bg-surface-2/80 border-border/70 hidden border-r transition-[width] duration-200 lg:flex lg:flex-col",
        collapsed ? "w-18 p-3" : "w-64 p-5",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("mb-6", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex-1 overflow-auto", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("mt-auto", className)} {...props} />
}

export function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-inset" className={cn("min-w-0 flex-1", className)} {...props} />
}

export type SidebarTriggerVariant = "default" | "minimal" | "soft"

type SidebarTriggerProps = React.ComponentProps<"button"> & {
  /** Patient vs psychologist (and ops) use different chrome so portals feel distinct. */
  variant?: SidebarTriggerVariant
}

export function SidebarTrigger({ className, variant = "default", ...props }: SidebarTriggerProps) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      data-trigger-variant={variant}
      aria-expanded={open}
      onClick={toggleSidebar}
      className={cn(
        "inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        variant === "default" &&
          "border-border hover:bg-muted h-8 w-8 rounded-md border",
        variant === "minimal" &&
          "text-foreground hover:bg-muted/70 h-9 w-9 rounded-lg border-0 bg-transparent shadow-none",
        variant === "soft" &&
          "bg-muted/80 ring-border/45 hover:bg-muted h-9 w-9 rounded-xl border-0 shadow-none ring-1",
        className,
      )}
      {...props}
    >
      <Rows
        aria-hidden
        className={cn(
          "text-foreground pointer-events-none shrink-0",
          variant === "minimal" ? "size-[1.125rem]" : "size-5",
        )}
        weight="bold"
      />
      <span className="sr-only">Toggle navigation sidebar</span>
    </button>
  )
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("space-y-2", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={className} {...props} />
}

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
}

export function SidebarMenuButton({
  className,
  asChild = false,
  isActive = false,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "text-muted-foreground hover:bg-muted/70 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        "data-[active=true]:bg-muted data-[active=true]:text-foreground data-[active=true]:font-medium",
        "group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-2",
        className,
      )}
      {...props}
    />
  )
}

