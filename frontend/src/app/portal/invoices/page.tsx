"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function InvoicesPage() {
  const { data, loading } = usePortalData<Invoice>("/portal/invoices");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  return (
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
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
