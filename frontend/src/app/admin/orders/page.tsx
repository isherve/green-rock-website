"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  deliveryAddress: string | null;
  notes: string | null;
  items: { name?: string; description?: string; quantity: number; unitPrice: number }[];
  createdAt: string;
  user?: { name: string; email: string; phone: string | null };
};

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "DELIVERED", "CANCELLED"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/material-orders", { params: { limit: 100 } });
      setOrders(res.data.data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/material-orders/${id}`, { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">
        Customer material orders from the portal — update status as you confirm, process, and deliver.
      </p>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No material orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="clean-card p-5">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm">{order.user?.name} · {order.user?.email}</p>
                  {order.user?.phone && <p className="text-xs text-muted-foreground">{order.user.phone}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{formatPrice(order.totalAmount, order.currency)}</Badge>
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 mb-2">
                {(Array.isArray(order.items) ? order.items : []).map((item, i) => (
                  <li key={i}>
                    · {(item.name ?? item.description ?? "Item")} × {item.quantity} @ {formatPrice(item.unitPrice, order.currency)}
                  </li>
                ))}
              </ul>
              {order.deliveryAddress && (
                <p className="text-xs"><span className="font-medium">Delivery:</span> {order.deliveryAddress}</p>
              )}
              {order.notes && <p className="text-xs text-muted-foreground mt-1">{order.notes}</p>}
              <p className="text-xs text-muted-foreground mt-2">{formatDate(order.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
