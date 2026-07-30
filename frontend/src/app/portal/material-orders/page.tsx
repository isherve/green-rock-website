"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate, formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
};

export default function MaterialOrdersPage() {
  const { data, loading } = usePortalData<Order>("/portal/material-orders");

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (data.length === 0) {
    return (
      <PortalEmptyState
        title="No material orders"
        description="Browse our catalog and place an order — it will show up here."
        action={<Button asChild><Link href="/materials">Browse Materials</Link></Button>}
      />
    );
  }

  return (
    <PortalDataList
      items={data.map((o) => ({
        id: o.id,
        title: o.orderNumber,
        subtitle: formatDate(o.createdAt),
        meta: formatPrice(o.totalAmount, o.currency),
        status: o.status,
      }))}
      emptyTitle=""
      emptyDescription=""
    />
  );
}
