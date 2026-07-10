"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { HOMEPAGE_SECTIONS } from "@/components/marketing/homepage-section-observer"
import { isNavItemActive, PUBLIC_NAV_ITEMS } from "@/content/public-nav"
import { cn } from "@/lib/utils"

const navScrollHide =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" as const

const linkBase =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

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
      <nav
        aria-label="Primary"
        className={cn(
          "flex max-w-full items-center gap-1 overflow-x-auto py-0.5",
          navScrollHide,
        )}
      >
        {PUBLIC_NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                linkBase,
                active
                  ? "bg-primary/10 font-semibold text-primary ring-1 ring-primary/15"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          )
        })}
        {isHome
          ? HOMEPAGE_SECTIONS.slice(0, 3).map((section) => {
              const active = activeSection === section.id
              return (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    linkBase,
                    active
                      ? "bg-primary/10 font-semibold text-primary ring-1 ring-primary/15"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                  aria-current={active ? "true" : undefined}
                >
                  {section.label}
                </Link>
              )
            })
          : null}
      </nav>
    </div>
  )
}
