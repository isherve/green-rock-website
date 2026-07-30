"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

type Inquiry = { id: string; type: string; name: string; email: string; phone: string | null; message: string; status: string; createdAt: string };
type Contact = { id: string; name: string; email: string; subject: string | null; message: string; isRead: boolean; createdAt: string };

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tab, setTab] = useState<"inquiries" | "contact">("inquiries");

  useEffect(() => {
    api.get("/inquiries", { params: { limit: 50 } }).then((r) => setInquiries(r.data.data.items ?? [])).catch(() => {});
    api.get("/contact", { params: { limit: 50 } }).then((r) => setContacts(r.data.data.items ?? [])).catch(() => {});
  }, []);

  return (
    <>
      <div className="flex gap-2 mb-6">
        <Button variant={tab === "inquiries" ? "default" : "outline"} size="sm" onClick={() => setTab("inquiries")}>
          Inquiries ({inquiries.length})
        </Button>
        <Button variant={tab === "contact" ? "default" : "outline"} size="sm" onClick={() => setTab("contact")}>
          Contact ({contacts.length})
        </Button>
      </div>

      <div className="space-y-4">
        {tab === "inquiries" ? (
          inquiries.length ? inquiries.map((inq) => (
            <div key={inq.id} className="bg-white border rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{inq.name} · {inq.email}</p>
                  {inq.phone && <p className="text-xs text-muted-foreground">{inq.phone}</p>}
                </div>
                <Badge>{inq.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{inq.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(inq.createdAt).toLocaleString()}</p>
            </div>
          )) : <p className="text-muted-foreground text-sm">No inquiries yet</p>
        ) : (
          contacts.length ? contacts.map((msg) => (
            <div key={msg.id} className="bg-white border rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{msg.name} · {msg.email}</p>
                  {msg.subject && <p className="text-sm">{msg.subject}</p>}
                </div>
                {!msg.isRead && <Badge variant="warning">New</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          )) : <p className="text-muted-foreground text-sm">No contact messages yet</p>
        )}
      </div>
    </>
  );
}
