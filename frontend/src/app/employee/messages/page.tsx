"use client";

import { Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";

type Message = { id: string; subject: string | null; body: string; createdAt: string };

export default function EmployeeMessagesPage() {
  const { data, loading } = usePortalData<Message>("/employee/messages");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No messages" description="Internal messages will appear here." />;

  return (
    <div className="pro-card divide-y divide-border">
      {data.map((m) => (
        <div key={m.id} className="p-4">
          <p className="font-medium">{m.subject ?? "Internal message"}</p>
          <p className="text-sm text-muted-foreground mt-1">{m.body}</p>
          <p className="text-xs text-muted-foreground mt-2">{formatDate(m.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
