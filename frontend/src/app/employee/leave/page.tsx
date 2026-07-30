"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

type Leave = { id: string; startDate: string; endDate: string; reason: string; status: string };

export default function LeavePage() {
  const { data, loading } = usePortalData<Leave>("/employee/leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/employee/leave", { startDate, endDate, reason });
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="pro-card p-6 grid sm:grid-cols-2 gap-4">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <Textarea className="sm:col-span-2" placeholder="Reason for leave" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
        <Button type="submit" disabled={submitting} className="sm:col-span-2 w-fit">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Leave Request"}
        </Button>
      </form>
      {data.length === 0 ? (
        <PortalEmptyState title="No leave requests" description="Submit a leave request above." />
      ) : (
        <PortalDataList
          items={data.map((l) => ({
            id: l.id,
            title: `${formatDate(l.startDate)} → ${formatDate(l.endDate)}`,
            subtitle: l.reason.slice(0, 60),
            status: l.status,
          }))}
          emptyTitle=""
          emptyDescription=""
        />
      )}
    </div>
  );
}
