"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Stats {
  overview: {
    totalUsers: number;
    totalProperties: number;
    totalProjects: number;
    totalProducts: number;
    totalInquiries: number;
    newInquiries: number;
    newsletterSubscribers: number;
    unreadMessages: number;
  };
  trends: { inquiryGrowthPercent: number };
  recent: {
    inquiries: { id: string; type: string; name: string; email: string; status: string; createdAt: string }[];
  };
}

const QUICK_LINKS = [
  { label: "Leads & Inquiries", href: "/admin/leads" },
  { label: "Material Orders", href: "/admin/orders" },
  { label: "Support Tickets", href: "/admin/tickets" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Documents", href: "/admin/documents" },
  { label: "Job Applications", href: "/admin/applications" },
  { label: "Newsletter", href: "/admin/subscribers" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

  const overview = stats?.overview;

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Properties", value: overview?.totalProperties ?? "—" },
          { label: "Projects", value: overview?.totalProjects ?? "—" },
          { label: "New Inquiries", value: overview?.newInquiries ?? "—" },
          { label: "Subscribers", value: overview?.newsletterSubscribers ?? "—" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Link href="/admin/leads" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {stats?.recent.inquiries.length ? stats.recent.inquiries.map((inq) => (
              <div key={inq.id} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{inq.name}</p>
                  <p className="text-xs text-muted-foreground">{inq.email}</p>
                </div>
                <Badge variant="secondary">{inq.type}</Badge>
              </div>
            )) : <p className="text-muted-foreground text-sm">No inquiries yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Total Users</span><strong>{overview?.totalUsers ?? "—"}</strong></div>
            <div className="flex justify-between"><span>Products</span><strong>{overview?.totalProducts ?? "—"}</strong></div>
            <div className="flex justify-between"><span>Unread Messages</span><strong>{overview?.unreadMessages ?? "—"}</strong></div>
            <div className="flex justify-between"><span>Inquiry Growth</span><strong className="text-green-600">+{stats?.trends.inquiryGrowthPercent ?? 0}%</strong></div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Operations</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Button key={link.href} variant="outline" size="sm" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
