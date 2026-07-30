"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Calendar, MessageSquare, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalStatCard } from "@/components/portal/PortalWidgets";
import api from "@/lib/api";

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    api.get("/employee/dashboard").then((res) => setStats(res.data.data.stats)).catch(() => setStats({}));
  }, []);

  return (
    <div className="space-y-8">
      <div className="pro-card p-6 bg-gradient-to-r from-emerald-900/5 to-primary/5">
        <h2 className="text-lg font-semibold font-display">Employee workspace</h2>
        <p className="text-sm text-muted-foreground mt-1">Projects, tasks, attendance, leave, and internal communications.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PortalStatCard label="Total Tasks" value={stats?.taskCount ?? "—"} icon={CheckSquare} />
        <PortalStatCard label="Pending Tasks" value={stats?.pendingTasks ?? "—"} icon={FileText} />
        <PortalStatCard label="Leave Pending" value={stats?.leavePending ?? "—"} icon={Calendar} />
        <PortalStatCard label="Unread Messages" value={stats?.unreadMessages ?? "—"} icon={MessageSquare} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/employee/attendance">Check In / Out</Link></Button>
        <Button asChild variant="outline"><Link href="/employee/tasks">View Tasks</Link></Button>
      </div>
    </div>
  );
}
