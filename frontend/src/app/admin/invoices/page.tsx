"use client";

import { AdminInvoicesManager } from "@/components/admin/AdminInvoicesManager";

export default function AdminInvoicesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-display mb-2">Invoices</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Generate invoices for customers who purchase materials, properties, or services. Download PDF copies anytime.
      </p>
      <AdminInvoicesManager />
    </div>
  );
}
