"use client"

import * as React from "react"
import Link from "next/link"

import { clearClientAuthSession } from "@/src/auth/backend-session"

type LogoutLinkProps = {
  href?: string
  className?: string
  children: React.ReactNode
}

/** Clears JWT mirror in sessionStorage before navigating to server logout (HttpOnly cookies cleared server-side). */
export const LogoutLink = React.forwardRef<HTMLAnchorElement, LogoutLinkProps>(function LogoutLink(
  { href = "/logout", className, children, ...rest },
  ref,
) {
  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      prefetch={false}
      onClick={() => clearClientAuthSession()}
      {...rest}
    >
      {children}
    </Link>
  )
})
