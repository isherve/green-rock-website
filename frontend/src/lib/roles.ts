export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MANAGING_DIRECTOR'] as const;

export const CUSTOMER_ROLES = ['USER'] as const;

export const EMPLOYEE_PORTAL_ROLES = [
  'EMPLOYEE',
  'AGENT',
  'FINANCE_MANAGER',
  'HR_MANAGER',
  'PROJECT_MANAGER',
  'SALES_MANAGER',
  'REAL_ESTATE_OFFICER',
  'PROCUREMENT_OFFICER',
  'INVENTORY_MANAGER',
  'WAREHOUSE_OFFICER',
  'DELIVERY_OFFICER',
  'CUSTOMER_SUPPORT',
  'MARKETING_OFFICER',
  'MANAGER',
  'MANAGING_DIRECTOR',
] as const;

export function isCustomerRole(role: string) {
  return role === 'USER';
}

export function isAdminRole(role: string) {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function canAccessEmployeePortal(role: string) {
  return (EMPLOYEE_PORTAL_ROLES as readonly string[]).includes(role);
}

export function canAccessAdmin(role: string) {
  return (
    role === "ADMIN" ||
    role === "MANAGER" ||
    role === "SUPER_ADMIN" ||
    role === "MANAGING_DIRECTOR"
  );
}
