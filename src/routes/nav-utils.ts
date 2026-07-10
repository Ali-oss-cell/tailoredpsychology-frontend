import type { Role } from "@/src/auth/access-control"
import type { NavIconKey } from "@/src/routes/nav-icons"
import { APP_ROUTES, type AppRoute, type AppShell } from "@/src/routes/route-config"

export type ShellNavItem = {
  key: string
  href: string
  label: string
  icon?: NavIconKey
  navGroup?: AppRoute["navGroup"]
  tutorialId?: string
}

function pathMatchesRoute(pathname: string, routePath: string): boolean {
  if (!routePath.includes(":")) {
    return pathname === routePath || pathname.startsWith(`${routePath}/`)
  }
  const pattern = routePath
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:[^/]+/g, "[^/]+")
  return new RegExp(`^${pattern}$`).test(pathname)
}

export function findRouteForPath(pathname: string): AppRoute | undefined {
  const normalized = pathname === "/" ? pathname : pathname.replace(/\/$/, "")
  return APP_ROUTES.find((route) => pathMatchesRoute(normalized, route.path))
}

export function getShellNavItems(shell: AppShell, opsMode?: "manager" | "admin"): ShellNavItem[] {
  return APP_ROUTES.filter((route) => {
    if (route.shell !== shell) return false
    if (!route.showInNav) return false
    if (!route.navLabel) return false
    if (shell === "ops" && opsMode) {
      if (opsMode === "manager" && !route.path.startsWith("/manager")) return false
      if (opsMode === "admin" && !route.path.startsWith("/admin")) return false
    }
    return true
  })
    .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0))
    .map((route) => ({
      key: route.navKey ?? route.path,
      href: route.path,
      label: route.navLabel!,
      icon: route.navIcon,
      navGroup: route.navGroup,
      tutorialId: route.tutorialId,
    }))
}

export function resolvePatientNavKey(pathname: string): string {
  const route = APP_ROUTES.find(
    (r) => r.shell === "patient" && pathMatchesRoute(pathname, r.path),
  )
  if (route?.navKey) return route.navKey
  if (pathname.startsWith("/patient/recordings")) return "resources"
  if (
    pathname.startsWith("/patient/appointments") ||
    pathname.startsWith("/patient/book-appointment")
  ) {
    return "appointments"
  }
  return "dashboard"
}

export function resolvePsychologistNavKey(pathname: string): string {
  const route = APP_ROUTES.find(
    (r) => r.shell === "psychologist" && pathMatchesRoute(pathname, r.path),
  )
  return route?.navKey ?? "dashboard"
}

export function resolveOpsNavKey(pathname: string, opsMode: "manager" | "admin"): string {
  const prefix = opsMode === "manager" ? "/manager" : "/admin"
  const routes = APP_ROUTES.filter(
    (r) => r.shell === "ops" && r.path.startsWith(prefix) && r.showInNav,
  )
  const sorted = [...routes].sort((a, b) => b.path.length - a.path.length)
  const match = sorted.find((route) => pathname.startsWith(route.path))
  return match?.navKey ?? (opsMode === "manager" ? "manager-dashboard" : "admin-dashboard")
}


export function opsSearchTarget(activeNavKey: string, opsMode: "manager" | "admin"): string {
  const prefix = opsMode === "manager" ? "/manager" : "/admin"
  if (activeNavKey === "admin-users") return "/admin/users"
  if (activeNavKey.endsWith("-staff")) return `${prefix}/staff`
  if (activeNavKey.endsWith("-appointments")) return `${prefix}/appointments`
  if (activeNavKey.endsWith("-resources")) return `${prefix}/resources`
  return `${prefix}/patients`
}

export function opsSearchPlaceholder(activeNavKey: string): string {
  if (activeNavKey === "admin-users") return "Search psychologist users by name or email…"
  if (activeNavKey.endsWith("-staff")) return "Search staff by name, email, or user ID…"
  if (activeNavKey.endsWith("-appointments")) return "Search appointments by patient, clinician, or ID…"
  if (activeNavKey.endsWith("-resources")) return "Search resources by title, owner, or ID…"
  return "Search patients by name or ID…"
}

export function opsComplianceHref(opsMode: "manager" | "admin"): string {
  return opsMode === "manager" ? "/manager/privacy-requests" : "/admin/audit-logs"
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  const route = findRouteForPath(pathname)
  if (!route) return true
  return route.allowedRoles.includes(role)
}
