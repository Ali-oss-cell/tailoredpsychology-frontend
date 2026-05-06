"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { isNavItemActive, PUBLIC_NAV_ITEMS } from "@/content/public-nav"
import { cn } from "@/lib/utils"

const navScrollHide =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" as const

const linkBase =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-2.5"

export function PublicHeaderNav() {
  const pathname = usePathname() ?? ""

  return (
    <div className="flex min-h-0 min-w-0 flex-1 items-center justify-start">
      <nav
        aria-label="Primary"
        className={cn(
          "flex max-w-full items-center gap-0.5 overflow-x-auto py-0.5 sm:gap-1 md:overflow-visible md:py-0",
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
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
