"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Inquiry = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
  property?: { title: string };
  product?: { name: string };
};

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const INQUIRY_STATUS = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export default function AdminLeadsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tab, setTab] = useState<"all" | "quotes" | "contact">("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inqRes, contactRes] = await Promise.all([
        api.get("/inquiries", { params: { limit: 100 } }),
        api.get("/contact", { params: { limit: 100 } }),
      ]);
      setInquiries(inqRes.data.data.items ?? []);
      setContacts(contactRes.data.data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateInquiryStatus = async (id: string, status: string) => {
    await api.patch(`/inquiries/${id}`, { status });
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const markContactRead = async (id: string) => {
    await api.patch(`/contact/${id}/read`);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
  };

  const filteredInquiries =
    tab === "quotes"
      ? inquiries.filter((i) => i.type === "QUOTE")
      : tab === "all"
        ? inquiries
        : [];

  const quoteCount = inquiries.filter((i) => i.type === "QUOTE").length;
  const newContacts = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">
        Manage customer leads, quote requests, property inquiries, and contact form messages in one place.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={tab === "all" ? "default" : "outline"} size="sm" onClick={() => setTab("all")}>
          All Inquiries ({inquiries.length})
        </Button>
        <Button variant={tab === "quotes" ? "default" : "outline"} size="sm" onClick={() => setTab("quotes")}>
          Quotations ({quoteCount})
        </Button>
        <Button variant={tab === "contact" ? "default" : "outline"} size="sm" onClick={() => setTab("contact")}>
          Contact Messages ({contacts.length}{newContacts ? ` · ${newContacts} new` : ""})
        </Button>
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto">
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : tab === "contact" ? (
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No contact messages yet.</p>
          ) : (
            contacts.map((msg) => (
              <div key={msg.id} className="bg-white border rounded-xl p-4">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <p className="font-medium">{msg.name} · {msg.email}</p>
                    {msg.subject && <p className="text-sm">{msg.subject}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.isRead && <Badge variant="warning">New</Badge>}
                    {!msg.isRead && (
                      <Button variant="outline" size="sm" onClick={() => markContactRead(msg.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(msg.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <p className="text-muted-foreground text-sm">No inquiries yet.</p>
          ) : (
            filteredInquiries.map((inq) => (
              <div key={inq.id} className="bg-white border rounded-xl p-4">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                  <div>
                    <p className="font-medium">{inq.name} · {inq.email}</p>
                    {inq.phone && <p className="text-xs text-muted-foreground">{inq.phone}</p>}
                    {(inq.property || inq.product) && (
                      <p className="text-xs text-primary mt-1">
                        Re: {inq.property?.title ?? inq.product?.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{inq.type}</Badge>
                    <Select value={inq.status} onValueChange={(v) => updateInquiryStatus(inq.id, v)}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INQUIRY_STATUS.map((s) => (
                          <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{inq.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(inq.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
