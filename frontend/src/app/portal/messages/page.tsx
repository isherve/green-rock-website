"use client";

import { Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";

type Message = { id: string; subject: string | null; body: string; createdAt: string; isRead: boolean };

export default function MessagesPage() {
  const { data, loading } = usePortalData<Message>("/portal/messages");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No messages" description="Direct messages with Green Rock staff will appear here." />;

  return (
    <div className="pro-card divide-y divide-border">
      {data.map((m) => (
        <div key={m.id} className={`p-4 ${!m.isRead ? "bg-primary/5" : ""}`}>
          <p className="font-medium">{m.subject ?? "Message"}</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.body}</p>
          <p className="text-xs text-muted-foreground mt-2">{formatDate(m.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
