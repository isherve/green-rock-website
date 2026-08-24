import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Heart,
  FileText,
  HardHat,
  Package,
  Calendar,
  Receipt,
  CreditCard,
  LifeBuoy,
  FolderOpen,
  Bell,
  MessageSquare,
  User,
} from "lucide-react";

export const CUSTOMER_NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Saved Properties", href: "/portal/saved-properties", icon: Heart },
  { label: "Request Quotes", href: "/portal/quotes", icon: FileText },
  { label: "Construction Requests", href: "/portal/construction-requests", icon: HardHat },
  { label: "Material Orders", href: "/portal/material-orders", icon: Package },
  { label: "Appointments", href: "/portal/appointments", icon: Calendar },
  { label: "Invoices", href: "/portal/invoices", icon: Receipt },
  { label: "Payments", href: "/portal/payments", icon: CreditCard },
  { label: "Support Tickets", href: "/portal/support", icon: LifeBuoy },
  { label: "Documents", href: "/portal/documents", icon: FolderOpen },
  { label: "Notifications", href: "/portal/notifications", icon: Bell },
  { label: "Messages", href: "/portal/messages", icon: MessageSquare },
  { label: "Profile", href: "/portal/profile", icon: User },
];
