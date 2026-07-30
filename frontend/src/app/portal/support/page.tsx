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

type Ticket = { id: string; ticketNumber: string; subject: string; status: string; createdAt: string };

export default function SupportPage() {
  const { data, loading } = usePortalData<Ticket>("/portal/tickets");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/portal/tickets", { subject, message });
      setSubject("");
      setMessage("");
      setShowForm(false);
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "New Ticket"}</Button>
      </div>

      {showForm && (
        <form onSubmit={submitTicket} className="pro-card p-6 space-y-4">
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <Textarea placeholder="Describe your issue..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Ticket"}
          </Button>
        </form>
      )}

      {data.length === 0 && !showForm ? (
        <PortalEmptyState title="No support tickets" description="Open a ticket and our support team will respond within 24 hours." />
      ) : (
        <PortalDataList
          items={data.map((t) => ({
            id: t.id,
            title: `${t.ticketNumber}: ${t.subject}`,
            subtitle: formatDate(t.createdAt),
            status: t.status,
          }))}
          emptyTitle=""
          emptyDescription=""
        />
      )}
    </div>
  );
}
