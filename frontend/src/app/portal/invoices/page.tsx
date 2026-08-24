"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, Loader2, CreditCard } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { Button } from "@/components/ui/button";
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

type Invoice = {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
};

async function downloadPdf(endpoint: string, filename: string) {
  const res = await api.get(endpoint, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function InvoicesContent() {
  const { data, loading, refetch } = usePortalData<Invoice>("/portal/invoices");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState<"MOMO" | "CARD" | "BANK">("MOMO");
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState<{ instructions?: string; paymentLink?: string; reference?: string } | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <PortalEmptyState
        title="No invoices"
        description="Invoices from Green Rock will appear here when issued."
      />
    );
  }

  const handleDownload = async (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    try {
      await downloadPdf(`/portal/invoices/${invoice.id}/pdf`, `${invoice.invoiceNumber}.pdf`);
    } catch {
      alert("Could not download invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const openPay = (invoice: Invoice) => {
    setPayInvoice(invoice);
    setPayResult(null);
    setPayMethod("MOMO");
    setPayOpen(true);
  };

  const handlePay = async () => {
    if (!payInvoice) return;
    setPaying(true);
    try {
      const res = await api.post("/payments/initiate", {
        invoiceId: payInvoice.id,
        method: payMethod,
      });
      setPayResult(res.data.data);
      if (res.data.data.paymentLink) {
        window.open(res.data.data.paymentLink, "_blank");
      }
      refetch?.();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Payment initiation failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {data.map((invoice) => (
          <div key={invoice.id} className="pro-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                <Badge variant="outline">{invoice.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{invoice.title}</p>
              <p className="text-sm mt-1">
                {formatPrice(invoice.amount, invoice.currency)}
                {invoice.dueDate ? ` · Due ${formatDate(invoice.dueDate)}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
                <Button size="sm" onClick={() => openPay(invoice)}>
                  <CreditCard className="w-4 h-4 mr-2" /> Pay Now
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
                    <Download className="w-4 h-4 mr-2" /> PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Invoice</DialogTitle>
          </DialogHeader>
          {payInvoice && (
            <div className="space-y-4 py-2">
              <p className="text-sm">
                {payInvoice.invoiceNumber} — {formatPrice(payInvoice.amount, payInvoice.currency)}
              </p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Payment method</label>
                <Select value={payMethod} onValueChange={(v) => setPayMethod(v as typeof payMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOMO">MTN Mobile Money</SelectItem>
                    <SelectItem value="CARD">Card (Flutterwave)</SelectItem>
                    <SelectItem value="BANK">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {payResult && (
                <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                  {payResult.reference && <p><strong>Reference:</strong> {payResult.reference}</p>}
                  {payResult.instructions && <p>{payResult.instructions}</p>}
                  {payResult.paymentLink && (
                    <a href={payResult.paymentLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      Open payment page
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)}>Close</Button>
            <Button onClick={handlePay} disabled={paying}>
              {paying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {payResult ? "Done" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PaymentStatusBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  if (status !== "complete") return null;
  return (
    <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
      Payment submitted — we will confirm once processed.
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense>
      <PaymentStatusBanner />
      <InvoicesContent />
    </Suspense>
  );
}
