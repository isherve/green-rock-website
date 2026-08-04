"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { PortalFormCard } from "@/components/portal/PortalFormCard";
import { formatDate, formatPrice } from "@/lib/utils";
import api from "@/lib/api";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
};

export default function MaterialOrdersPage() {
  const { data, loading, refetch } = usePortalData<Order>("/portal/material-orders");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      await api.post("/portal/material-orders", {
        items: [{ name, quantity: Number(quantity), unitPrice: Number(unitPrice) }],
        deliveryAddress: address || undefined,
        notes: notes || undefined,
      });
      setName("");
      setQuantity("1");
      setUnitPrice("");
      setAddress("");
      setNotes("");
      setMsg("Order placed successfully.");
      refetch();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <PortalFormCard title="Place Material Order" description="Request building materials for delivery to your site.">
        <form onSubmit={submitOrder} className="space-y-4 max-w-lg">
          <Input placeholder="Material / product name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" min={1} placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <Input type="number" min={0} placeholder="Unit price (RWF)" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
          </div>
          <Input placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Order"}
          </Button>
        </form>
      </PortalFormCard>

      {data.length === 0 ? (
        <PortalEmptyState
          title="No orders yet"
          description="Your material orders will appear here after submission."
          action={<Button asChild variant="outline"><Link href="/materials">Browse catalog</Link></Button>}
        />
      ) : (
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
      )}
    </div>
  );
}
