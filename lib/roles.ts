import type { MembershipContext } from "@/lib/app-data";
import type { RoleKey } from "@/lib/product-model";

export function isStaffRole(role: RoleKey) {
  return role === "staff";
}

export function isStaffMembership(membership: MembershipContext) {
  return isStaffRole(membership.role);
}

export function canManageBusiness(role: RoleKey) {
  return role === "business_owner" || role === "admin";
}

export function canManageMembership(membership: MembershipContext) {
  return canManageBusiness(membership.role);
}
