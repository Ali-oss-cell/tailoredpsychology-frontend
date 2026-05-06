import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { hasAllPermissions, type Role } from "@/src/auth/access-control"
import { APP_ROUTES } from "@/src/routes/route-config"
import { getDefaultRouteForRole, parseRole, SESSION_ROLE_COOKIE } from "@/src/auth/session"

const AUTH_GUEST_ONLY_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"]

function normalizePath(pathname: string): string {
  if (pathname === "/") {
    return pathname
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
}

function toPattern(path: string): RegExp {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const withDynamicSegments = escaped.replace(/:[^/]+/g, "[^/]+")
  return new RegExp(`^${withDynamicSegments}$`)
}

function getCurrentRole(request: NextRequest): Role {
  const cookieValue = request.cookies.get(SESSION_ROLE_COOKIE)?.value
  return parseRole(cookieValue) ?? "guest"
}

function isGuestOnlyPath(pathname: string): boolean {
  return AUTH_GUEST_ONLY_PATHS.includes(pathname)
}

function getRedirectResponse(request: NextRequest, role: Role, fallback?: string): NextResponse {
  const redirectTarget = fallback ?? getDefaultRouteForRole(role)
  const url = new URL(redirectTarget, request.url)
  return NextResponse.redirect(url)
}

export function proxy(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname)
  const role = getCurrentRole(request)

  if (isGuestOnlyPath(pathname) && role !== "guest") {
    return getRedirectResponse(request, role)
  }

  const matchedRoute = APP_ROUTES.find((route) => toPattern(route.path).test(pathname))
  if (!matchedRoute) {
    return NextResponse.next()
  }

  if (matchedRoute.allowGuests && role === "guest") {
    return NextResponse.next()
  }

  if (role === "guest") {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const hasRoleAccess = matchedRoute.allowedRoles.includes(role)
  const hasPermissionAccess = hasAllPermissions(role, matchedRoute.requiredPermissions)

  if (!hasRoleAccess || !hasPermissionAccess) {
    return getRedirectResponse(request, role)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|.*\\..*).*)"],
}
