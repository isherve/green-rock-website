"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

type AttendanceRow = { id: string; date: string; checkIn: string | null; checkOut: string | null; status: string };

export default function AttendancePage() {
  const { data, loading } = usePortalData<AttendanceRow>("/employee/attendance");
  const [actionLoading, setActionLoading] = useState(false);

  async function checkIn() {
    setActionLoading(true);
    try { await api.post("/employee/attendance/check-in"); window.location.reload(); } finally { setActionLoading(false); }
  }

  async function checkOut() {
    setActionLoading(true);
    try { await api.post("/employee/attendance/check-out"); window.location.reload(); } finally { setActionLoading(false); }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={checkIn} disabled={actionLoading}>Check In</Button>
        <Button variant="outline" onClick={checkOut} disabled={actionLoading}>Check Out</Button>
      </div>
      {data.length === 0 ? (
        <PortalEmptyState title="No attendance records" description="Check in to start tracking your attendance." />
      ) : (
        <div className="pro-card divide-y divide-border">
          {data.map((r) => (
            <div key={r.id} className="p-4 flex justify-between text-sm">
              <span>{formatDate(r.date)}</span>
              <span className="text-muted-foreground">{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
