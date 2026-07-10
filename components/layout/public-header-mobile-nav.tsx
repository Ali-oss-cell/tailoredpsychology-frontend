"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { ArrowRight, List, X } from "@phosphor-icons/react"

import {
  isNavLinkActive,
  isNavMegaActive,
  PUBLIC_MOBILE_SUPPORT_LINKS,
  PUBLIC_PRIMARY_NAV_ITEMS,
  PUBLIC_SECONDARY_NAV_ITEMS,
} from "@/content/public-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const linkBase =
  "inline-flex min-h-11 w-full items-center rounded-xl px-4 py-3 text-base font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function PublicHeaderMobileNav() {
  const pathname = usePathname() ?? ""
  const [open, setOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("")
  const panelRef = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

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

  React.useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    if (!panel) return

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      )

    const first = getFocusable()[0]
    first?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (event.key !== "Tab") return
      const focusable = getFocusable()
      if (!focusable.length) return
      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const isHome = pathname === "/"

  const renderLink = (href: string, label: string, active: boolean, anchor = false) => (
    <Link
      key={`${href}-${label}`}
      href={href}
      className={cn(
        linkBase,
        active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
      aria-current={active ? (anchor ? "true" : "page") : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  )

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="text-foreground hover:bg-muted/60 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/70 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls="public-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in-0"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <nav
            ref={panelRef}
            id="public-mobile-nav"
            aria-label="Mobile navigation"
            className="bg-background fixed inset-x-0 top-[var(--public-header-height,5.25rem)] bottom-0 z-50 flex flex-col motion-safe:animate-in motion-safe:slide-in-from-top-2 motion-safe:fade-in-0"
          >
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <section aria-labelledby="mobile-nav-primary" className="mb-6">
                <h2 id="mobile-nav-primary" className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                  Primary
                </h2>
                <div className="flex flex-col gap-1">
                  {PUBLIC_PRIMARY_NAV_ITEMS.flatMap((item) => {
                    if (item.type === "mega") {
                      const parentActive = isNavMegaActive(pathname, item)
                      return [
                        renderLink(item.href, item.label, parentActive),
                        ...item.items.map((child) =>
                          renderLink(
                            child.href,
                            child.label,
                            isNavLinkActive(pathname, child.href),
                            child.href.startsWith("/#"),
                          ),
                        ),
                      ]
                    }
                    return [renderLink(item.href, item.label, isNavLinkActive(pathname, item.href))]
                  })}
                </div>
              </section>
              <section aria-labelledby="mobile-nav-secondary" className="mb-6">
                <h2 id="mobile-nav-secondary" className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                  Secondary
                </h2>
                <div className="flex flex-col gap-1">
                  {PUBLIC_SECONDARY_NAV_ITEMS.map((item) => {
                    const isAnchor = item.href.startsWith("/#")
                    const sectionId = isAnchor ? item.href.slice(2) : ""
                    const active = isAnchor
                      ? isHome && activeSection === sectionId
                      : isNavLinkActive(pathname, item.href)
                    return renderLink(item.href, item.label, active, isAnchor)
                  })}
                </div>
              </section>
              <section aria-labelledby="mobile-nav-support">
                <h2 id="mobile-nav-support" className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                  Support
                </h2>
                <div className="flex flex-col gap-1">
                  {PUBLIC_MOBILE_SUPPORT_LINKS.map((item) =>
                    renderLink(item.href, item.label, isNavLinkActive(pathname, item.href)),
                  )}
                </div>
              </section>
            </div>
            <div className="border-border/70 bg-background/95 space-y-2 border-t p-4 backdrop-blur">
              <Button asChild className="marketing-cta h-12 w-full rounded-xl shadow-primary-glow transition-transform hover:-translate-y-0.5">
                <Link href="/get-matched" onClick={() => setOpen(false)}>
                  Find Your Psychologist
                  <ArrowRight size={18} className="ms-1" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 w-full rounded-xl">
                <Link href="/patient/book-appointment" onClick={() => setOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  )
}
