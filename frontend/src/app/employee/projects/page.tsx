"use client";

import { Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";

type Project = { id: string; title: string; location: string; status: string };

export default function EmployeeProjectsPage() {
  const { data, loading } = usePortalData<Project>("/employee/projects");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No assigned projects" description="Projects assigned to you will appear here." />;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {data.map((p) => (
        <div key={p.id} className="pro-card p-5">
          <p className="font-semibold">{p.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{p.location}</p>
          <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wide text-primary">{p.status}</span>
        </div>
      ))}
    </div>
  );
}
