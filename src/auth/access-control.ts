export const ROLES = [
  "guest",
  "patient",
  "psychologist",
  "practice_manager",
  "admin",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "marketing.read",
  "auth.guest-only",
  "patient.portal.read",
  "patient.booking.create",
  "psychologist.portal.read",
  "manager.portal.read",
  "admin.portal.read",
  "resources.manage",
  "recordings.read",
  "video-session.join",
  "privacy.requests.manage",
  "referrals.verify",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ["marketing.read", "auth.guest-only"],
  patient: [
    "marketing.read",
    "patient.portal.read",
    "patient.booking.create",
    "recordings.read",
    "video-session.join",
  ],
  psychologist: [
    "marketing.read",
    "psychologist.portal.read",
    "resources.manage",
    "recordings.read",
    "video-session.join",
  ],
  practice_manager: [
    "marketing.read",
    "manager.portal.read",
    "resources.manage",
    "recordings.read",
    "video-session.join",
    "privacy.requests.manage",
    "referrals.verify",
  ],
  admin: [
    "marketing.read",
    "manager.portal.read",
    "admin.portal.read",
    "resources.manage",
    "recordings.read",
    "video-session.join",
    "privacy.requests.manage",
    "referrals.verify",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => ROLE_PERMISSIONS[role].includes(permission));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => ROLE_PERMISSIONS[role].includes(permission));
}
