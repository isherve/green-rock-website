"use client";

import { Loader2, ExternalLink } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";

type Doc = { id: string; title: string; fileUrl: string; category: string; createdAt: string };

export default function EmployeeDocumentsPage() {
  const { data, loading } = usePortalData<Doc>("/employee/documents");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No documents" description="HR and project documents shared with you will appear here." />;

  return (
    <div className="pro-card divide-y divide-border">
      {data.map((d) => (
        <a key={d.id} href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-accent/50">
          <div>
            <p className="font-medium">{d.title}</p>
            <p className="text-xs text-muted-foreground">{d.category} · {formatDate(d.createdAt)}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-primary" />
        </a>
      ))}
    </div>
  );
}
