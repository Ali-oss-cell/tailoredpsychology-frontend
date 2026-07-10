"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { List, X } from "@phosphor-icons/react"

import { HOMEPAGE_SECTIONS } from "@/components/marketing/homepage-section-observer"
import { isNavItemActive, PUBLIC_NAV_ITEMS } from "@/content/public-nav"
import { cn } from "@/lib/utils"

const linkBase =
  "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function PublicHeaderMobileNav() {
  const pathname = usePathname() ?? ""
  const [open, setOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("")

  React.useEffect(() => {
    const onSection = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail
      setActiveSection(detail?.id ?? "")
    }
    window.addEventListener("home-section-change", onSection)
    setActiveSection(document.body.dataset.homeActiveSection ?? "")
    return () => window.removeEventListener("home-section-change", onSection)
  }, [])

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isHome = pathname === "/"

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="text-foreground hover:bg-muted/60 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls="public-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
      </button>
      {open ? (
        <nav
          id="public-mobile-nav"
          aria-label="Mobile navigation"
          className="border-border/70 bg-card absolute inset-x-0 top-full z-50 border-b shadow-e2"
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            <Link
              href="/get-matched"
              className={cn(
                linkBase,
                "bg-primary text-primary-foreground justify-center shadow-primary-glow hover:bg-primary/90",
              )}
            >
              Find a psychologist
            </Link>
            {PUBLIC_NAV_ITEMS.map((item) => {
              const active = isNavItemActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    linkBase,
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
            {isHome
              ? HOMEPAGE_SECTIONS.map((section) => {
                  const active = activeSection === section.id
                  return (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      className={cn(
                        linkBase,
                        active
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                      aria-current={active ? "true" : undefined}
                    >
                      {section.label}
                    </Link>
                  )
                })
              : null}
          </div>
        </nav>
      ) : null}
    </div>
  )
}
