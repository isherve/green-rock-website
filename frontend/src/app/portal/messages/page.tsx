"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { PortalFormCard } from "@/components/portal/PortalFormCard";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

type Message = { id: string; subject: string | null; body: string; createdAt: string; isRead: boolean; senderId: string };
type Contact = { id: string; name: string; role: string };

export default function MessagesPage() {
  const { data, loading, refetch } = usePortalData<Message>("/portal/messages");
  const { data: contacts } = usePortalData<Contact>("/portal/contacts");
  const [receiverId, setReceiverId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!receiverId) return;
    setSubmitting(true);
    try {
      await api.post("/portal/messages", { receiverId, subject, body });
      setSubject("");
      setBody("");
      refetch();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <PortalFormCard title="Send Message" description="Contact Green Rock staff directly from your portal.">
        <form onSubmit={sendMessage} className="space-y-4 max-w-lg">
          <select
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          >
            <option value="">Select recipient</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.role.replace(/_/g, " ")})</option>
            ))}
          </select>
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Textarea placeholder="Your message" value={body} onChange={(e) => setBody(e.target.value)} rows={4} required />
          <Button type="submit" disabled={submitting || contacts.length === 0}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Message"}
          </Button>
        </form>
      </PortalFormCard>

      {data.length === 0 ? (
        <PortalEmptyState title="No messages" description="Your conversation history with Green Rock will appear here." />
      ) : (
        <div className="clean-card divide-y divide-border">
          {data.map((m) => (
            <div key={m.id} className={`p-4 ${!m.isRead ? "bg-primary/5" : ""}`}>
              <p className="font-medium">{m.subject ?? "Message"}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{m.body}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatDate(m.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
