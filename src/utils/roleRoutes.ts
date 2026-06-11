import type { Role } from "@/store/slices/authSlice";

export const ROLES: Role[] = ["admin", "teacher", "faculty", "student"];

export function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
}

export function roleDashboardPath(role: Role) {
  return `/${role}/dashboard`;
}

export function roleProfilePath(role: Role) {
  return `/${role}/profile`;
}

export function rolePath(role: Role, ...segments: string[]) {
  const tail = segments.filter(Boolean).join("/");
  return tail ? `/${role}/${tail}` : `/${role}`;
}
