"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PortalStatCard } from "@/components/portal/PortalWidgets";
import { CheckSquare, Calendar, FileText } from "lucide-react";
import api from "@/lib/api";

export default function EmployeeReportsPage() {
  const [stats, setStats] = useState<{ completedTasks: number; attendanceDays: number; leaveTaken: number } | null>(null);

  useEffect(() => {
    api.get("/employee/reports/summary").then((res) => setStats(res.data.data)).catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <PortalStatCard label="Completed Tasks" value={stats.completedTasks} icon={CheckSquare} />
      <PortalStatCard label="Days Present" value={stats.attendanceDays} icon={Calendar} />
      <PortalStatCard label="Leave Approved" value={stats.leaveTaken} icon={FileText} />
    </div>
  );
}
