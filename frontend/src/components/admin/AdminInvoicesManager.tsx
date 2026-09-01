"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, Plus, RefreshCw, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { formatDate, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Customer = { id: string; name: string; email: string };
type LineItem = { description: string; quantity: number; unitPrice: number };
type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  user?: { name: string; email: string };
};

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
];

async function downloadPdf(endpoint: string, filename: string) {
  const res = await api.get(endpoint, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminInvoicesManager() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceRow | null>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "Bank transfer", reference: "" });
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userId: "",
    title: "",
    dueDate: "",
    status: "SENT",
    items: [{ description: "", quantity: 1, unitPrice: 0 }] as LineItem[],
  });

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/invoices", { params: { limit: 100 } });
      const data = res.data.data;
      setInvoices(Array.isArray(data) ? data : data.items ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    api.get("/users", { params: { limit: 200 } })
      .then((res) => {
        const data = res.data.data;
        setCustomers(Array.isArray(data) ? data : data.items ?? []);
      })
      .catch(() => {});
  }, [fetchInvoices]);

  const total = form.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const updateItem = (index: number, patch: Partial<LineItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const handleCreate = async () => {
    if (!form.userId || !form.title.trim()) {
      alert("Customer and title are required");
      return;
    }
    const items = form.items.filter((i) => i.description.trim() && i.unitPrice > 0);
    if (items.length === 0) {
      alert("Add at least one line item with description and price");
      return;
    }

    setSaving(true);
    try {
      await api.post("/invoices", {
        userId: form.userId,
        title: form.title.trim(),
        dueDate: form.dueDate || undefined,
        status: form.status,
        items,
      });
      setOpen(false);
      setForm({
        userId: "",
        title: "",
        dueDate: "",
        status: "SENT",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
      });
      fetchInvoices();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/invoices/${id}`, { status });
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDownload = async (invoice: InvoiceRow) => {
    setDownloadingId(invoice.id);
    try {
      await downloadPdf(`/invoices/${invoice.id}/pdf`, `${invoice.invoiceNumber}.pdf`);
    } catch {
      alert("Failed to download invoice PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const openPaymentDialog = (invoice: InvoiceRow) => {
    setPaymentInvoice(invoice);
    setPaymentForm({
      amount: String(invoice.amount),
      method: "Bank transfer",
      reference: "",
    });
    setPaymentOpen(true);
  };

  const handleRecordPayment = async () => {
    if (!paymentInvoice) return;
    const amount = Number(paymentForm.amount);
    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    setRecordingPayment(true);
    try {
      await api.post("/payments", {
        invoiceId: paymentInvoice.id,
        amount,
        method: paymentForm.method.trim() || "Manual",
        reference: paymentForm.reference.trim() || undefined,
      });
      setPaymentOpen(false);
      setPaymentInvoice(null);
      fetchInvoices();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setRecordingPayment(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm">{invoices.length} invoices</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchInvoices} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Generate Invoice
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <div className="admin-table-wrap">
        <div className="overflow-x-auto min-h-[280px]">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due</th>
                <th className="px-4 py-3 w-52">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No invoices yet — generate one for a customer purchase or transaction.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <div>{invoice.user?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{invoice.user?.email}</div>
                    </td>
                    <td className="px-4 py-3">{invoice.title}</td>
                    <td className="px-4 py-3">{formatPrice(invoice.amount, invoice.currency)}</td>
                    <td className="px-4 py-3">
                      <Select value={invoice.status} onValueChange={(v) => handleStatusChange(invoice.id, v)}>
                        <SelectTrigger className="h-8 w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">{invoice.dueDate ? formatDate(invoice.dueDate) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
                          <Button variant="outline" size="sm" onClick={() => openPaymentDialog(invoice)}>
                            <Banknote className="w-4 h-4 mr-1" /> Pay
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(invoice)}
                          disabled={downloadingId === invoice.id}
                        >
                          {downloadingId === invoice.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-1" /> PDF
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
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
              <label className="text-sm font-medium">Invoice title / reference *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Building materials order — March 2026"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Due date</label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Line items *</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((p) => ({ ...p, items: [...p.items, { description: "", quantity: 1, unitPrice: 0 }] }))}
                >
                  Add item
                </Button>
              </div>
              {form.items.map((item, index) => (
                <div key={index} className="grid sm:grid-cols-[1fr_80px_120px] gap-2">
                  <Input
                    placeholder="Description (materials, property, service…)"
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                  />
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={item.quantity || ""}
                    onChange={(e) => updateItem(index, { quantity: Number(e.target.value) || 1 })}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Unit price (RWF)"
                    value={item.unitPrice || ""}
                    onChange={(e) => updateItem(index, { unitPrice: Number(e.target.value) || 0 })}
                  />
                </div>
              ))}
              <p className="text-sm font-semibold text-primary">Total: {formatPrice(total, "RWF")}</p>
            </div>

            <Textarea
              readOnly
              className="text-xs bg-muted/40"
              rows={2}
              value="The customer will see this invoice in their portal and can download the PDF once you save it."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {paymentInvoice && (
            <div className="grid gap-4 py-2">
              <p className="text-sm text-muted-foreground">
                {paymentInvoice.invoiceNumber} — {paymentInvoice.title} ({formatPrice(paymentInvoice.amount, paymentInvoice.currency)})
              </p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Amount (RWF) *</label>
                <Input
                  type="number"
                  min={1}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Payment method</label>
                <Select value={paymentForm.method} onValueChange={(v) => setPaymentForm((p) => ({ ...p, method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank transfer">Bank transfer</SelectItem>
                    <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Reference / transaction ID</label>
                <Input
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, reference: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment} disabled={recordingPayment}>
              {recordingPayment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
