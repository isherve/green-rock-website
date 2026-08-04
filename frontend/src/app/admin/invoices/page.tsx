"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { INVOICE_ADMIN_FIELDS } from "@/lib/admin-resources";
import { formatDate, formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  currency: string;
  dueDate: string | null;
  user?: { name: string; email: string };
};

export default function AdminInvoicesPage() {
  return (
    <AdminCRUD<Row>
      title="Invoices"
      endpoint="/invoices"
      hideCreate
      updateMethod="patch"
      columns={[
        { key: "invoiceNumber", label: "Invoice #" },
        { key: "user", label: "Customer", render: (r) => r.user?.name ?? "—" },
        { key: "amount", label: "Amount", render: (r) => formatPrice(r.amount, r.currency) },
        { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
        { key: "dueDate", label: "Due", render: (r) => (r.dueDate ? formatDate(r.dueDate) : "—") },
      ]}
      fields={INVOICE_ADMIN_FIELDS}
    />
  );
}
