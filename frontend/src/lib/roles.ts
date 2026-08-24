export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MANAGING_DIRECTOR'] as const;

export const CUSTOMER_ROLES = ['USER'] as const;

export function isCustomerRole(role: string) {
  return role === 'USER';
}

export function isAdminRole(role: string) {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function canAccessAdmin(role: string) {
  return (
    role === "ADMIN" ||
    role === "MANAGER" ||
    role === "SUPER_ADMIN" ||
    role === "MANAGING_DIRECTOR"
  );
}
