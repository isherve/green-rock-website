"use client";

import { Target, Warehouse, Wallet, UserCog, Megaphone, LineChart, Shield, ClipboardList, FileSignature, Truck, ShoppingCart, Calendar } from "lucide-react";
import { ErpModulePage } from "@/components/admin/ErpModulePage";

const MODULES = {
  crm: {
    title: "Customer Relationship Management",
    description: "Manage leads, inquiries, and customer interactions across real estate, construction, and materials sales.",
    icon: Target,
    features: ["Lead pipeline", "Inquiry tracking", "Customer profiles", "Sales activity logs", "Follow-up reminders"],
    relatedLinks: [{ label: "View Messages", href: "/admin/messages" }],
  },
  inventory: {
    title: "Inventory Management",
    description: "Track stock levels, warehouses, and material availability for building supplies and timber.",
    icon: Warehouse,
    features: ["Stock levels", "Warehouse management", "Low-stock alerts", "Stock movements", "Product catalog sync"],
    relatedLinks: [{ label: "Products", href: "/admin/products" }],
  },
  procurement: {
    title: "Procurement & Suppliers",
    description: "Manage purchase orders, supplier relationships, and procurement workflows.",
    icon: ShoppingCart,
    features: ["Purchase orders", "Supplier database", "Approval workflows", "Cost tracking"],
  },
  fleet: {
    title: "Fleet & Delivery Management",
    description: "Coordinate vehicles, delivery routes, and site dispatch for materials and equipment.",
    icon: Truck,
    features: ["Vehicle registry", "Delivery scheduling", "Route planning", "Delivery status tracking"],
  },
  finance: {
    title: "Accounting & Finance",
    description: "Financial overview, revenue tracking, expenses, and accounting integration.",
    icon: Wallet,
    features: ["Revenue dashboard", "Expense tracking", "Financial reports", "Export PDF/Excel"],
    relatedLinks: [{ label: "Invoices", href: "/admin/invoices" }],
  },
  hr: {
    title: "Human Resources",
    description: "Employee records, attendance, leave management, and organizational structure.",
    icon: UserCog,
    features: ["Employee profiles", "Attendance", "Leave approvals", "Department management"],
    relatedLinks: [{ label: "Payroll", href: "/admin/payroll" }, { label: "Careers", href: "/admin/careers" }],
  },
  payroll: {
    title: "Payroll",
    description: "Salary processing, payslip generation, and compensation records.",
    icon: Wallet,
    features: ["Payslip generation", "Deductions", "Pay periods", "Employee self-service slips"],
  },
  quotations: {
    title: "Quotation Management",
    description: "Create, send, and track BOQs and project quotations for construction clients.",
    icon: ClipboardList,
    features: ["Quote builder", "BOQ templates", "Approval flow", "PDF export"],
  },
  contracts: {
    title: "Contract Management",
    description: "Store and manage client contracts, supplier agreements, and project contracts.",
    icon: FileSignature,
    features: ["Contract repository", "Expiry alerts", "Digital signatures", "Version history"],
  },
  marketing: {
    title: "Marketing Campaigns",
    description: "Plan campaigns, track newsletter subscribers, and manage promotional content.",
    icon: Megaphone,
    features: ["Campaign planner", "Newsletter", "Blog CMS", "Social integration"],
    relatedLinks: [{ label: "Blog", href: "/admin/blog" }],
  },
  analytics: {
    title: "Analytics & Reporting",
    description: "Business intelligence dashboards with charts, KPIs, and exportable reports.",
    icon: LineChart,
    features: ["Interactive dashboards", "Sales analytics", "Property metrics", "Export PDF/Excel"],
    relatedLinks: [{ label: "Dashboard", href: "/admin/dashboard" }],
  },
  audit: {
    title: "Audit Logs",
    description: "Security and compliance trail of all system actions and user activity.",
    icon: Shield,
    features: ["Action logging", "User activity", "Entity change history", "IP tracking"],
  },
  appointments: {
    title: "Appointment Scheduling",
    description: "Manage customer site visits, consultations, and property viewings.",
    icon: Calendar,
    features: ["Booking calendar", "Confirmations", "Email notifications", "Agent assignment"],
  },
  invoices: {
    title: "Invoice Management",
    description: "Issue invoices, track payments, and manage billing for customers.",
    icon: Wallet,
    features: ["Invoice creation", "Payment tracking", "Overdue alerts", "Customer portal sync"],
  },
} as const;

export function AdminModule({ module }: { module: keyof typeof MODULES }) {
  const m = MODULES[module];
  return (
    <ErpModulePage
      title={m.title}
      description={m.description}
      icon={m.icon}
      features={[...m.features]}
      relatedLinks={"relatedLinks" in m ? [...(m.relatedLinks ?? [])] : undefined}
    />
  );
}
