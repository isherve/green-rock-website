"use client";

import { Loader2 } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate, formatPrice } from "@/lib/utils";

type Payment = { id: string; amount: number; currency: string; status: string; method: string | null; createdAt: string };

export default function PaymentsPage() {
  const { data, loading } = usePortalData<Payment>("/portal/payments");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No payments recorded" description="Payment history will appear here after transactions are processed." />;

  return (
    <PortalDataList
      items={data.map((p) => ({
        id: p.id,
        title: p.method ?? "Payment",
        subtitle: formatDate(p.createdAt),
        meta: formatPrice(p.amount, p.currency),
        status: p.status,
      }))}
      emptyTitle=""
      emptyDescription=""
    />
  );
}
