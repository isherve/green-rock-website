"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { FileText, Loader2 } from "lucide-react";

type Inquiry = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
  metadata?: { assignedToId?: string; assignedToName?: string; invoiceNumber?: string } | null;
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

type Staff = { id: string; name: string; email: string; role: string };

const INQUIRY_STATUS = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export default function AdminLeadsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tab, setTab] = useState<"all" | "quotes" | "contact">("all");
  const [loading, setLoading] = useState(true);
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertInquiry, setConvertInquiry] = useState<Inquiry | null>(null);
  const [convertAmount, setConvertAmount] = useState("");
  const [convertTitle, setConvertTitle] = useState("");
  const [converting, setConverting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inqRes, contactRes, usersRes] = await Promise.all([
        api.get("/inquiries", { params: { limit: 100 } }),
        api.get("/contact", { params: { limit: 100 } }),
        api.get("/users", { params: { limit: 100 } }),
      ]);
      setInquiries(inqRes.data.data.items ?? []);
      setContacts(contactRes.data.data.items ?? []);
      const users = usersRes.data.data.items ?? usersRes.data.data ?? [];
      setStaff(
        (Array.isArray(users) ? users : []).filter((u: Staff) =>
          ["ADMIN", "MANAGER", "SALES_MANAGER", "AGENT", "CUSTOMER_SUPPORT"].includes(u.role)
        )
      );
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

  const assignInquiry = async (id: string, assignedToId: string | null) => {
    await api.patch(`/inquiries/${id}`, { assignedToId });
    const member = staff.find((s) => s.id === assignedToId);
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              metadata: {
                ...i.metadata,
                assignedToId: assignedToId ?? undefined,
                assignedToName: member?.name,
              },
            }
          : i
      )
    );
  };

  const markContactRead = async (id: string) => {
    await api.patch(`/contact/${id}/read`);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
  };

  const openConvert = (inq: Inquiry) => {
    setConvertInquiry(inq);
    setConvertTitle(inq.property?.title ? `Quote — ${inq.property.title}` : `Quote for ${inq.name}`);
    setConvertAmount("");
    setConvertOpen(true);
  };

  const handleConvert = async () => {
    if (!convertInquiry || !convertAmount) return;
    setConverting(true);
    try {
      const res = await api.post(`/inquiries/${convertInquiry.id}/convert-invoice`, {
        title: convertTitle.trim() || undefined,
        amount: Number(convertAmount),
      });
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === convertInquiry.id
            ? {
                ...i,
                status: "RESOLVED",
                metadata: {
                  ...i.metadata,
                  invoiceNumber: res.data.data.invoiceNumber,
                },
              }
            : i
        )
      );
      setConvertOpen(false);
      alert(`Invoice ${res.data.data.invoiceNumber} created and sent to customer.`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setConverting(false);
    }
  };

  const filteredInquiries =
    tab === "quotes"
      ? inquiries.filter((i) => i.type === "QUOTE" || i.type === "CONSTRUCTION" || i.type === "PROPERTY")
      : tab === "all"
        ? inquiries
        : [];

  const quoteCount = inquiries.filter((i) => ["QUOTE", "CONSTRUCTION", "PROPERTY"].includes(i.type)).length;
  const newContacts = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">
        Manage leads, convert quotes to invoices, assign staff, and review contact messages.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={tab === "all" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setTab("all")}>
          All Inquiries ({inquiries.length})
        </Button>
        <Button variant={tab === "quotes" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setTab("quotes")}>
          Quotes & Leads ({quoteCount})
        </Button>
        <Button variant={tab === "contact" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setTab("contact")}>
          Contact Messages ({contacts.length}{newContacts ? ` · ${newContacts} new` : ""})
        </Button>
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto rounded-full">
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
              <div key={msg.id} className="clean-card p-5">
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
              <div key={inq.id} className="clean-card p-5">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                  <div>
                    <p className="font-medium">{inq.name} · {inq.email}</p>
                    {inq.phone && <p className="text-xs text-muted-foreground">{inq.phone}</p>}
                    {(inq.property || inq.product) && (
                      <p className="text-xs text-primary mt-1">
                        Re: {inq.property?.title ?? inq.product?.name}
                      </p>
                    )}
                    {inq.metadata?.assignedToName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Assigned: {inq.metadata.assignedToName}
                      </p>
                    )}
                    {inq.metadata?.invoiceNumber && (
                      <p className="text-xs text-green-700 mt-1">
                        Invoice: {inq.metadata.invoiceNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{inq.type}</Badge>
                    <Select
                      value={inq.metadata?.assignedToId ?? "unassigned"}
                      onValueChange={(v) => assignInquiry(inq.id, v === "unassigned" ? null : v)}
                    >
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    {!inq.metadata?.invoiceNumber && (
                      <Button variant="outline" size="sm" onClick={() => openConvert(inq)}>
                        <FileText className="w-4 h-4 mr-1" /> To Invoice
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{inq.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(inq.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      )}

      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to Invoice</DialogTitle>
          </DialogHeader>
          {convertInquiry && (
            <div className="grid gap-4 py-2">
              <p className="text-sm text-muted-foreground">
                Create an invoice for {convertInquiry.name} ({convertInquiry.email})
              </p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Invoice title</label>
                <Input value={convertTitle} onChange={(e) => setConvertTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Amount (RWF) *</label>
                <Input type="number" min={1} value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertOpen(false)}>Cancel</Button>
            <Button onClick={handleConvert} disabled={converting || !convertAmount}>
              {converting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
