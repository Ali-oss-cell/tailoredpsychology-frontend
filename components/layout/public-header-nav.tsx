"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { PublicNavMegaMenuDropdown } from "@/components/layout/public-nav-mega-menu"
import {
  isNavLinkActive,
  PUBLIC_PRIMARY_NAV_ITEMS,
  PUBLIC_SECONDARY_NAV_ITEMS,
} from "@/content/public-nav"
import { cn } from "@/lib/utils"

const linkBase =
  "inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-4xl px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function PublicHeaderNav() {
  const pathname = usePathname() ?? ""
  const [activeSection, setActiveSection] = React.useState("")
  const isHome = pathname === "/"

  React.useEffect(() => {
    const onSection = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail
      setActiveSection(detail?.id ?? "")
    }
    window.addEventListener("home-section-change", onSection)
    setActiveSection(document.body.dataset.homeActiveSection ?? "")
    return () => window.removeEventListener("home-section-change", onSection)
  }, [])

  return (
    <div className="hidden min-h-0 min-w-0 flex-1 items-center justify-start lg:flex">
      <nav aria-label="Primary" className="flex max-w-full items-center gap-0.5 xl:gap-1">
        {PUBLIC_PRIMARY_NAV_ITEMS.map((item) => {
          if (item.type === "mega") {
            return <PublicNavMegaMenuDropdown key={item.id} menu={item} pathname={pathname} />
          }
          const active = isNavLinkActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                linkBase,
                active
                  ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          )
        })}
        <span className="bg-border/60 mx-0.5 hidden h-5 w-px xl:inline-block" aria-hidden />
        {PUBLIC_SECONDARY_NAV_ITEMS.map((item) => {
          const isAnchor = item.href.startsWith("/#")
          const sectionId = isAnchor ? item.href.slice(2) : ""
          const active = isAnchor
            ? isHome && activeSection === sectionId
            : isNavLinkActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                linkBase,
                active
                  ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              aria-current={active ? (isAnchor ? "true" : "page") : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
