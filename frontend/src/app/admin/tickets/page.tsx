"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  user?: { name: string; email: string; phone: string | null };
  replies?: { id: string; message: string; isStaff: boolean; authorName: string; createdAt: string }[];
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/support-tickets", { params: { limit: 100 } });
      setTickets(res.data.data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openTicket = async (id: string) => {
    const res = await api.get(`/support-tickets/${id}`);
    setSelected(res.data.data);
    setReply("");
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      await api.post(`/support-tickets/${selected.id}/replies`, { message: reply.trim() });
      await openTicket(selected.id);
      setReply("");
      load();
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/support-tickets/${id}`, { status });
    if (selected?.id === id) setSelected({ ...selected, status });
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">
        Respond to customer support tickets from the portal.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Open tickets</h2>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : tickets.length === 0 ? (
            <p className="text-muted-foreground text-sm">No support tickets yet.</p>
          ) : (
            tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => openTicket(t.id)}
                className={`w-full text-left clean-card p-5 hover:border-primary/40 transition-colors ${selected?.id === t.id ? "border-primary ring-1 ring-primary/20" : ""}`}
              >
                <div className="flex justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{t.ticketNumber}</span>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
                <p className="text-sm font-medium truncate">{t.subject}</p>
                <p className="text-xs text-muted-foreground">{t.user?.name}, {formatDate(t.createdAt)}</p>
              </button>
            ))
          )}
        </div>

        <div className="clean-card p-5 min-h-[320px]">
          {!selected ? (
            <p className="text-muted-foreground text-sm">Select a ticket to view and reply.</p>
          ) : (
            <>
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-semibold">{selected.subject}</h3>
                  <p className="text-xs text-muted-foreground">{selected.user?.name}, {selected.user?.email}</p>
                </div>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 max-h-[280px] overflow-y-auto mb-4">
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="text-xs font-medium mb-1">{selected.user?.name}</p>
                  <p>{selected.message}</p>
                </div>
                {selected.replies?.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-lg p-3 text-sm ${r.isStaff ? "bg-primary/10 ml-4" : "bg-muted/50 mr-4"}`}
                  >
                    <p className="text-xs font-medium mb-1">{r.authorName}</p>
                    <p>{r.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
              <Textarea
                placeholder="Type your reply to the customer…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
              />
              <Button className="mt-2" onClick={sendReply} disabled={sending || !reply.trim()}>
                {sending ? "Sending…" : "Send reply"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
