"use client";

import { AdminCRUD } from "@/components/admin/AdminCRUD";
import { ADMIN_LIST_ALL, PARTNER_FIELDS } from "@/lib/admin-resources";

export default function AdminPartnersPage() {
  return (
    <AdminCRUD
      title="Partner"
      endpoint="/partners"
      listParams={ADMIN_LIST_ALL}
      fields={PARTNER_FIELDS}
      createLabel="Add Partner"
      columns={[
        { key: "name", label: "Name" },
        { key: "order", label: "Order" },
        { key: "isActive", label: "Active", render: (p) => (p.isActive ? "Yes" : "No") },
      ]}
    />
  );
}
