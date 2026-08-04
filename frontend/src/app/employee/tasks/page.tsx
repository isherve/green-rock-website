"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import api from "@/lib/api";

type Task = { id: string; title: string; status: string; priority: string; dueDate: string | null };

const STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

export default function EmployeeTasksPage() {
  const { data, loading, refetch } = usePortalData<Task>("/employee/tasks");

  async function updateStatus(id: string, status: string) {
    await api.patch(`/employee/tasks/${id}/status`, { status });
    refetch();
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No tasks assigned" description="Your manager will assign tasks here." />;

  return (
    <div className="pro-card divide-y divide-border">
      {data.map((t) => (
        <div key={t.id} className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-muted-foreground capitalize">{t.priority.toLowerCase()} · {t.status.replace(/_/g, " ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.filter((s) => s !== t.status).map((s) => (
              <Button key={s} size="sm" variant="outline" onClick={() => updateStatus(t.id, s)}>
                {s.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
