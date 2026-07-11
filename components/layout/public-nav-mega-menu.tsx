"use client"

import Link from "next/link"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import * as React from "react"

import type { PublicNavMegaMenu } from "@/content/public-nav"
import { isNavLinkActive, isNavMegaActive } from "@/content/public-nav"
import { cn } from "@/lib/utils"

const triggerBase =
  "inline-flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-4xl px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

type PublicNavMegaMenuProps = {
  menu: PublicNavMegaMenu
  pathname: string
}

export function PublicNavMegaMenuDropdown({ menu, pathname }: PublicNavMegaMenuProps) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const panelId = `nav-mega-${menu.id}`
  const active = isNavMegaActive(pathname, menu)

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          triggerBase,
          active
            ? "bg-primary/10 text-primary ring-1 ring-primary/15"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          open && "bg-muted/60 text-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        {menu.label}
        {open ? (
          <CaretUp
            size={14}
            aria-hidden
            data-testid={`nav-mega-chevron-${menu.id}-open`}
            className="shrink-0 transition-transform duration-200"
          />
        ) : (
          <CaretDown
            size={14}
            aria-hidden
            data-testid={`nav-mega-chevron-${menu.id}-closed`}
            className="shrink-0 transition-transform duration-200"
          />
        )}
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label={`${menu.label} menu`}
          className="border-border/60 bg-card absolute start-0 top-[calc(100%+0.25rem)] z-50 w-[min(100vw-2rem,22rem)] rounded-2xl border p-1.5 shadow-e2 transition-[box-shadow,opacity] duration-200 sm:w-[min(100vw-2rem,24rem)]"
        >
          {menu.description ? (
            <p className="text-muted-foreground px-3 py-2 text-xs leading-relaxed">{menu.description}</p>
          ) : null}
          <ul className="grid gap-0.5 sm:grid-cols-2">
            {menu.items.map((item) => {
              const itemActive = isNavLinkActive(pathname, item.href)
              return (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:bg-muted/60 block rounded-4xl px-3 py-2 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                      itemActive && "bg-primary/8 ring-1 ring-primary/10",
                    )}
                    aria-current={itemActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-foreground block text-sm font-medium">{item.label}</span>
                    {item.description ? (
                      <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
                        {item.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="border-border/60 mt-2 border-t px-3 pt-2">
            <Link
              href={menu.href}
              className="text-primary hover:text-primary/80 inline-flex min-h-9 items-center text-sm font-medium transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              View all {menu.label.toLowerCase()} →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
