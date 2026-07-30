"use client";

import { Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";

type Task = { id: string; title: string; status: string; priority: string; dueDate: string | null };

export default function EmployeeTasksPage() {
  const { data, loading } = usePortalData<Task>("/employee/tasks");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No tasks assigned" description="Your manager will assign tasks here." />;

  return (
    <PortalDataList
      items={data.map((t) => ({ id: t.id, title: t.title, subtitle: t.priority, status: t.status }))}
      emptyTitle=""
      emptyDescription=""
    />
  );
}
