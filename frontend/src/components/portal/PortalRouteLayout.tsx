"use client";

import { usePathname } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { CUSTOMER_NAV } from "@/lib/portal-nav";
import { isCustomerRole } from "@/lib/roles";

const CUSTOMER_AUTH_PATHS = ["/portal/login", "/portal/register"];

const CUSTOMER_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/portal/dashboard": { title: "Customer Dashboard", subtitle: "Your projects, orders, and account at a glance" },
  "/portal/saved-properties": { title: "Saved Properties", subtitle: "Properties you have bookmarked" },
  "/portal/quotes": { title: "Request Quotes", subtitle: "Quotation requests and responses" },
  "/portal/construction-requests": { title: "Construction Requests", subtitle: "Building and renovation inquiries" },
  "/portal/material-orders": { title: "Material Orders", subtitle: "Building materials order history" },
  "/portal/appointments": { title: "Appointments", subtitle: "Scheduled site visits and consultations" },
  "/portal/invoices": { title: "Invoices", subtitle: "Billing documents. View and download PDFs" },
  "/portal/payments": { title: "Payments", subtitle: "Payment history and receipts" },
  "/portal/support": { title: "Support Tickets", subtitle: "Get help from our support team" },
  "/portal/documents": { title: "Documents", subtitle: "Contracts, plans, and shared files" },
  "/portal/notifications": { title: "Notifications", subtitle: "Updates about your account and orders" },
  "/portal/messages": { title: "Messages", subtitle: "Direct messages with Green Rock staff" },
  "/portal/profile": { title: "Profile", subtitle: "Manage your account settings" },
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
