import type { Role } from "@/src/auth/access-control"

export const SESSION_ROLE_COOKIE = "clink_role"

const ROLE_REDIRECT_MAP: Record<Role, string> = {
  guest: "/",
  patient: "/patient/dashboard",
  psychologist: "/psychologist/dashboard",
  practice_manager: "/manager/dashboard",
  admin: "/admin/dashboard",
}

const VALID_ROLES: Role[] = ["guest", "patient", "psychologist", "practice_manager", "admin"]

export function getDefaultRouteForRole(role: Role): string {
  return ROLE_REDIRECT_MAP[role]
}

export function parseRole(value: string | undefined): Role | null {
  if (!value) {
    return null
  }

  const decoded = decodeURIComponent(value)
  return VALID_ROLES.includes(decoded as Role) ? (decoded as Role) : null
}
