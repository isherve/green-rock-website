/** Role-based access control helpers — shared logic for backend */

export const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'MANAGING_DIRECTOR',
] as const;

export const STAFF_ROLES = [
  ...ADMIN_ROLES,
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
  'AGENT',
  'EMPLOYEE',
] as const;

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

export function isAdminRole(role: string): boolean {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}

export function isStaffRole(role: string): boolean {
  return (STAFF_ROLES as readonly string[]).includes(role);
}

export function isCustomerRole(role: string): boolean {
  return role === 'USER';
}

export function canAccessEmployeePortal(role: string): boolean {
  return (EMPLOYEE_PORTAL_ROLES as readonly string[]).includes(role);
}

export function generateNumber(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}${rand}`;
}
