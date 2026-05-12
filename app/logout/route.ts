import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { SESSION_ROLE_COOKIE } from "@/src/auth/session"

function stripPort(host: string): string {
  return host.replace(/:\d+$/, "")
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.trim()
  const forwardedProto = requestHeaders.get("x-forwarded-proto")?.trim()
  const hostWithPort =
    forwardedHost && forwardedHost.length > 0 ? forwardedHost : requestHeaders.get("host") ?? requestUrl.host
  const host = stripPort(hostWithPort)
  const protocol = forwardedProto && forwardedProto.length > 0 ? forwardedProto : requestUrl.protocol.replace(":", "")
  const url = new URL("/login", `${protocol}://${host}`)
  const response = NextResponse.redirect(url)

  const common = {
    name: SESSION_ROLE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax" as const,
    secure: protocol === "https",
    httpOnly: true,
  }

  // Clear host-only cookie variant.
  response.cookies.set(common)

  // Clear cookie variant scoped to current host.
  response.cookies.set({
    ...common,
    domain: host,
  })

  // Clear shared cookie used across subdomains (e.g. .tailoredpsychology.com.au).
  if (host.startsWith("www.")) {
    response.cookies.set({
      ...common,
      domain: host.slice(4),
    })
  }

  const parentDomain = process.env.COOKIE_DOMAIN?.trim()
  if (parentDomain && parentDomain.length > 0) {
    response.cookies.set({
      ...common,
      domain: parentDomain.startsWith(".") ? parentDomain : `.${parentDomain}`,
    })
  }

  return response
}
