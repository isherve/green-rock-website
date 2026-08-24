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
  Receipt,
  Shield,
  ClipboardList,
  ShoppingBag,
  LifeBuoy,
  UserCheck,
  Mail,
} from "lucide-react";

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };
export type AdminNavGroup = { title: string; items: AdminNavItem[] };

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
    ],
  },
  {
    title: "Sales & Operations",
    items: [
      { label: "Leads & Inquiries", href: "/admin/leads", icon: MessageSquare },
      { label: "Material Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Support Tickets", href: "/admin/tickets", icon: LifeBuoy },
      { label: "Appointments", href: "/admin/appointments", icon: Calendar },
      { label: "Invoices", href: "/admin/invoices", icon: Receipt },
    ],
  },
  {
    title: "Real Estate & Projects",
    items: [
      { label: "Properties", href: "/admin/properties", icon: Home },
      { label: "Projects", href: "/admin/projects", icon: Building2 },
      { label: "Services", href: "/admin/services", icon: Wrench },
    ],
  },
  {
    title: "Materials",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Package },
    ],
  },
  {
    title: "People & Content",
    items: [
      { label: "Job Applications", href: "/admin/applications", icon: UserCheck },
      { label: "Careers", href: "/admin/careers", icon: Briefcase },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Newsletter", href: "/admin/subscribers", icon: Mail },
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

/** Legacy redirects for removed placeholder modules */
export const REMOVED_ADMIN_PATHS = [
  "/admin/crm",
  "/admin/inventory",
  "/admin/procurement",
  "/admin/fleet",
  "/admin/finance",
  "/admin/hr",
  "/admin/payroll",
  "/admin/contracts",
  "/admin/marketing",
  "/admin/analytics",
  "/admin/messages",
  "/admin/quotations",
];
