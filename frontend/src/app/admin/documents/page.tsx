"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUpload } from "@/components/admin/ImageUpload";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Customer = { id: string; name: string; email: string };
type Document = {
  id: string;
  title: string;
  fileUrl: string;
  category: string;
  createdAt: string;
  user?: Customer;
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ userId: "", title: "", fileUrl: "", category: "contract" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [docRes, userRes] = await Promise.all([
        api.get("/documents", { params: { limit: 100 } }),
        api.get("/users", { params: { limit: 200 } }),
      ]);
      setDocuments(docRes.data.data.items ?? []);
      const users = userRes.data.data.items ?? userRes.data.data ?? [];
      setCustomers((Array.isArray(users) ? users : []).filter((u: Customer & { role?: string }) => u.role === "USER"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleShare = async () => {
    if (!form.userId || !form.title.trim() || !form.fileUrl) {
      alert("Customer, title, and file are required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/documents", form);
      setForm({ userId: "", title: "", fileUrl: "", category: "contract" });
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to share document");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this document from the customer portal?")) return;
    await api.delete(`/documents/${id}`);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">
        Share contracts, plans, and receipts with customers in their portal.
      </p>

      <div className="clean-card p-6 mb-8 space-y-4">
        <h3 className="font-semibold">Share Document</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Customer *</label>
            <Select value={form.userId} onValueChange={(v) => setForm((p) => ({ ...p, userId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="plan">Plan / Drawing</SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title *</label>
          <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Sales agreement for Kimihurura plot" />
        </div>
        <SingleImageUpload
          label="File URL (upload image or paste PDF link)"
          value={form.fileUrl}
          onChange={(url) => setForm((p) => ({ ...p, fileUrl: url }))}
          folder="green-rock/documents"
        />
        <Button onClick={handleShare} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Share with Customer
        </Button>
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      ) : documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No documents shared yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-3">
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {doc.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">{doc.user?.name ?? "N/A"}</td>
                  <td className="px-4 py-3 capitalize">{doc.category}</td>
                  <td className="px-4 py-3">{formatDate(doc.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
