"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { INQUIRY_ADMIN_FIELDS } from "@/lib/admin-resources";
import { formatDate } from "@/lib/utils";

type Row = { id: string; name: string; email: string; type: string; status: string; message: string; createdAt: string };

export default function AdminQuotationsPage() {
  return (
    <AdminCRUD<Row>
      title="Quotations & Quotes"
      endpoint="/inquiries"
      listParams={{ type: "QUOTE" }}
      hideCreate
      updateMethod="patch"
      columns={[
        { key: "name", label: "Client" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
        { key: "createdAt", label: "Date", render: (r) => formatDate(r.createdAt) },
      ]}
      fields={INQUIRY_ADMIN_FIELDS}
    />
  );
}
