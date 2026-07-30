"use client";

import { Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate, formatPrice } from "@/lib/utils";

type Invoice = { id: string; invoiceNumber: string; title: string; amount: number; currency: string; status: string; dueDate: string | null };

export default function InvoicesPage() {
  const { data, loading } = usePortalData<Invoice>("/portal/invoices");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No invoices" description="Invoices from Green Rock will appear here when issued." />;

  return (
    <PortalDataList
      items={data.map((i) => ({
        id: i.id,
        title: `${i.invoiceNumber} — ${i.title}`,
        subtitle: i.dueDate ? `Due ${formatDate(i.dueDate)}` : undefined,
        meta: formatPrice(i.amount, i.currency),
        status: i.status,
      }))}
      emptyTitle=""
      emptyDescription=""
    />
  );
}
