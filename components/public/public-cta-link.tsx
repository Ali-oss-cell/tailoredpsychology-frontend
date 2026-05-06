"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { trackFrontendAnalyticsEvent } from "@/src/analytics/events"

type PublicCtaLinkProps = {
  href: string
  className?: string
  label: string
  eventName: "compare_cta_click" | "pricing_cta_click" | "condition_cta_click"
  metadata?: Record<string, string | number | boolean | null>
}

export function PublicCtaLink({ href, className, label, eventName, metadata }: PublicCtaLinkProps) {
  const searchParams = useSearchParams()
  const hrefWithUtm = useMemo(() => {
    const url = new URL(href, "https://clink.local")
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const value = searchParams.get(key)
      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value)
      }
    }
    return `${url.pathname}${url.search}`
  }, [href, searchParams])

  return (
    <Link
      href={hrefWithUtm}
      className={className}
      onClick={() => {
        void trackFrontendAnalyticsEvent({
          name: eventName,
          targetId: hrefWithUtm,
          idempotencyKey: `${eventName}:${hrefWithUtm}:${Date.now()}`,
          metadata,
        }).catch(() => undefined)
      }}
    >
      {label}
    </Link>
  )
}
