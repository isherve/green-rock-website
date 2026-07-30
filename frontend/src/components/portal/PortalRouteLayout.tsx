"use client";

import { usePathname } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { CUSTOMER_NAV, EMPLOYEE_NAV } from "@/lib/portal-nav";
import { isCustomerRole, canAccessEmployeePortal } from "@/lib/roles";

const CUSTOMER_AUTH_PATHS = ["/portal/login", "/portal/register"];
const EMPLOYEE_AUTH_PATHS = ["/employee/login"];

const CUSTOMER_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/portal/dashboard": { title: "Customer Dashboard", subtitle: "Your projects, orders, and account at a glance" },
  "/portal/saved-properties": { title: "Saved Properties", subtitle: "Properties you have bookmarked" },
  "/portal/quotes": { title: "Request Quotes", subtitle: "Quotation requests and responses" },
  "/portal/construction-requests": { title: "Construction Requests", subtitle: "Building and renovation inquiries" },
  "/portal/material-orders": { title: "Material Orders", subtitle: "Building materials order history" },
  "/portal/appointments": { title: "Appointments", subtitle: "Scheduled site visits and consultations" },
  "/portal/invoices": { title: "Invoices", subtitle: "Billing and payment documents" },
  "/portal/payments": { title: "Payments", subtitle: "Payment history and receipts" },
  "/portal/support": { title: "Support Tickets", subtitle: "Get help from our support team" },
  "/portal/documents": { title: "Documents", subtitle: "Contracts, plans, and shared files" },
  "/portal/notifications": { title: "Notifications", subtitle: "Updates about your account and orders" },
  "/portal/messages": { title: "Messages", subtitle: "Direct messages with Green Rock staff" },
  "/portal/profile": { title: "Profile", subtitle: "Manage your account settings" },
};

const EMPLOYEE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/employee/dashboard": { title: "Employee Dashboard", subtitle: "Your work overview and quick actions" },
  "/employee/projects": { title: "Assigned Projects", subtitle: "Projects you are working on" },
  "/employee/tasks": { title: "Tasks", subtitle: "Your assigned tasks and deadlines" },
  "/employee/attendance": { title: "Attendance", subtitle: "Check-in, check-out, and attendance history" },
  "/employee/leave": { title: "Leave Requests", subtitle: "Request and track leave" },
  "/employee/payslips": { title: "Salary Slips", subtitle: "Payslips and compensation records" },
  "/employee/messages": { title: "Internal Messaging", subtitle: "Messages with colleagues and management" },
  "/employee/reports": { title: "Reports", subtitle: "Performance and activity summary" },
  "/employee/documents": { title: "Documents", subtitle: "HR and project documents" },
};

export function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (CUSTOMER_AUTH_PATHS.includes(pathname)) return <>{children}</>;

  const meta = CUSTOMER_TITLES[pathname] ?? { title: "Customer Portal" };

  return (
    <PortalShell
      title={meta.title}
      subtitle={meta.subtitle}
      nav={CUSTOMER_NAV}
      loginPath="/portal/login"
      allowedRoles={isCustomerRole}
      portalLabel="Customer Portal"
    >
      {children}
    </PortalShell>
  );
}

export function EmployeePortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (EMPLOYEE_AUTH_PATHS.includes(pathname)) return <>{children}</>;

  const meta = EMPLOYEE_TITLES[pathname] ?? { title: "Employee Portal" };

  return (
    <PortalShell
      title={meta.title}
      subtitle={meta.subtitle}
      nav={EMPLOYEE_NAV}
      loginPath="/employee/login"
      allowedRoles={canAccessEmployeePortal}
      portalLabel="Employee Portal"
      accentClass="bg-emerald-700"
    >
      {children}
    </PortalShell>
  );
}
