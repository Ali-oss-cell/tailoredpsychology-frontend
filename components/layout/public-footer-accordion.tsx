"use client"

import Link from "next/link"
import { CaretDown } from "@phosphor-icons/react"
import * as React from "react"

import type { FooterColumn } from "@/content/public-footer"
import { cn } from "@/lib/utils"

type PublicFooterAccordionProps = {
  columns: readonly FooterColumn[]
}

export function PublicFooterAccordion({ columns }: PublicFooterAccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(null)

  return (
    <div className="space-y-2 md:hidden">
      {columns.map((column) => {
        const isOpen = openId === column.id
        return (
          <div key={column.id} className="border-border/70 rounded-xl border">
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`footer-panel-${column.id}`}
              onClick={() => setOpenId(isOpen ? null : column.id)}
            >
              {column.title}
              <CaretDown
                size={16}
                aria-hidden
                className={cn("text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            {isOpen ? (
              <ul
                id={`footer-panel-${column.id}`}
                className="border-border/60 space-y-1 border-t px-4 py-3"
              >
                {column.links.map((link) => (
                  <li key={`${column.id}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
