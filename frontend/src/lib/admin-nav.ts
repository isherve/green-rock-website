import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Home,
  Building2,
  Package,
  FileText,
  Briefcase,
  ImageIcon,
  Star,
  Handshake,
  Wrench,
  MessageSquare,
  Users,
  Settings,
  Calendar,
  Target,
  Warehouse,
  Truck,
  ShoppingCart,
  UserCog,
  Wallet,
  Receipt,
  FileSignature,
  Megaphone,
  LineChart,
  Shield,
  ClipboardList,
} from "lucide-react";

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };
export type AdminNavGroup = { title: string; items: AdminNavItem[] };

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "ERP Dashboard", href: "/admin/dashboard", icon: BarChart3 },
      { label: "Analytics", href: "/admin/analytics", icon: LineChart },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
    ],
  },
  {
    title: "CRM & Sales",
    items: [
      { label: "CRM / Leads", href: "/admin/crm", icon: Target },
      { label: "Messages & Inquiries", href: "/admin/messages", icon: MessageSquare },
      { label: "Appointments", href: "/admin/appointments", icon: Calendar },
      { label: "Quotations", href: "/admin/quotations", icon: ClipboardList },
      { label: "Contracts", href: "/admin/contracts", icon: FileSignature },
    ],
  },
  {
    title: "Real Estate",
    items: [
      { label: "Properties", href: "/admin/properties", icon: Home },
      { label: "Projects", href: "/admin/projects", icon: Building2 },
      { label: "Services", href: "/admin/services", icon: Wrench },
    ],
  },
  {
    title: "Inventory & Supply",
    items: [
      { label: "Products / Materials", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Package },
      { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
      { label: "Procurement", href: "/admin/procurement", icon: ShoppingCart },
      { label: "Fleet & Delivery", href: "/admin/fleet", icon: Truck },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Finance", href: "/admin/finance", icon: Wallet },
      { label: "Invoices", href: "/admin/invoices", icon: Receipt },
    ],
  },
  {
    title: "Human Resources",
    items: [
      { label: "HR", href: "/admin/hr", icon: UserCog },
      { label: "Payroll", href: "/admin/payroll", icon: Receipt },
      { label: "Careers", href: "/admin/careers", icon: Briefcase },
      { label: "Users & Roles", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Marketing & CMS",
    items: [
      { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export const ADMIN_NAV = ADMIN_NAV_GROUPS.flatMap((g) => g.items);

export const PAGE_TITLES = Object.fromEntries(ADMIN_NAV.map((item) => [item.href, item.label]));
