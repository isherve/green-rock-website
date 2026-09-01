"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  FileText,
  HardHat,
  Package,
  Calendar,
  LifeBuoy,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalStatCard } from "@/components/portal/PortalWidgets";
import api from "@/lib/api";

export default function CustomerDashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    api.get("/portal/dashboard").then((res) => setStats(res.data.data.stats)).catch(() => setStats({}));
  }, []);

  const cards = [
    { label: "Saved Properties", value: stats?.savedProperties ?? "N/A", icon: Heart, href: "/portal/saved-properties" },
    { label: "Quote Requests", value: stats?.quotes ?? "N/A", icon: FileText, href: "/portal/quotes" },
    { label: "Construction", value: stats?.constructionRequests ?? "N/A", icon: HardHat, href: "/portal/construction-requests" },
    { label: "Material Orders", value: stats?.materialOrders ?? "N/A", icon: Package, href: "/portal/material-orders" },
    { label: "Appointments", value: stats?.appointments ?? "N/A", icon: Calendar, href: "/portal/appointments" },
    { label: "Open Tickets", value: stats?.openTickets ?? "N/A", icon: LifeBuoy, href: "/portal/support" },
    { label: "Notifications", value: stats?.unreadNotifications ?? "N/A", icon: Bell, href: "/portal/notifications" },
  ];

  return (
    <div className="space-y-8">
      <div className="clean-card p-6 border-primary/20">
        <h2 className="text-lg font-semibold font-display mb-2">Welcome to your customer portal</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Manage property searches, construction quotes, material orders, appointments, invoices, and support in one place.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Button asChild size="sm">
            <Link href="/properties">Browse Properties</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Request a Quote</Link>
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="block hover:-translate-y-0.5 transition-transform">
            <PortalStatCard label={c.label} value={c.value} icon={c.icon} />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="clean-card p-6">
          <h3 className="font-semibold mb-4">Quick actions</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Save a property while browsing", href: "/properties" },
              { label: "Order building materials", href: "/materials" },
              { label: "Book a site visit", href: "/contact" },
              { label: "Open a support ticket", href: "/portal/support" },
            ].map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-3.5 w-3.5" /> {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="clean-card p-6">
          <h3 className="font-semibold mb-4">Need help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our team supports property buyers, construction clients, and material customers across Rwanda.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/portal/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
