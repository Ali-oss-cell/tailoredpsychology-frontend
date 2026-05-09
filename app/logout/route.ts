import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { SESSION_ROLE_COOKIE } from "@/src/auth/session"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.trim()
  const forwardedProto = requestHeaders.get("x-forwarded-proto")?.trim()
  const host = forwardedHost && forwardedHost.length > 0 ? forwardedHost : requestHeaders.get("host") ?? requestUrl.host
  const protocol = forwardedProto && forwardedProto.length > 0 ? forwardedProto : requestUrl.protocol.replace(":", "")
  const url = new URL("/login", `${protocol}://${host}`)
  const response = NextResponse.redirect(url)

  response.cookies.set({
    name: SESSION_ROLE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  })

  return response
}
