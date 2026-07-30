"use client";

import { Loader2, Download } from "lucide-react";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate, formatPrice } from "@/lib/utils";

type Slip = { id: string; period: string; netPay: number; currency: string; issuedAt: string; documentUrl: string | null };

export default function PayslipsPage() {
  const { data, loading } = usePortalData<Slip>("/employee/payslips");
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <PortalEmptyState title="No salary slips" description="Payslips issued by HR will appear here." />;

  return (
    <div className="pro-card divide-y divide-border">
      {data.map((s) => (
        <div key={s.id} className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">{s.period}</p>
            <p className="text-sm text-muted-foreground">{formatDate(s.issuedAt)} · {formatPrice(s.netPay, s.currency)}</p>
          </div>
          {s.documentUrl && (
            <a href={s.documentUrl} className="text-primary flex items-center gap-1 text-sm"><Download className="h-4 w-4" /> PDF</a>
          )}
        </div>
      ))}
    </div>
  );
}
