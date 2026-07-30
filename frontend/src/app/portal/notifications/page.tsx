"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

type Notification = { id: string; title: string; message: string; isRead: boolean; createdAt: string };

export default function NotificationsPage() {
  const { data, loading } = usePortalData<Notification>("/portal/notifications");

  async function markAllRead() {
    await api.patch("/portal/notifications/read-all");
    window.location.reload();
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No notifications" description="Account updates and order status changes will appear here." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
      </div>
      <div className="pro-card divide-y divide-border">
        {data.map((n) => (
          <div key={n.id} className={`p-4 ${!n.isRead ? "bg-primary/5" : ""}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm">{n.title}</p>
              {!n.isRead && <span className="text-[10px] font-bold uppercase text-primary">New</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(n.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
