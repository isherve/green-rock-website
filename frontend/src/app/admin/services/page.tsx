"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { SERVICE_FIELDS } from "@/lib/admin-resources";

export default function AdminServicesPage() {
  return (
    <AdminCRUD
      title="Service"
      endpoint="/services"
      fields={SERVICE_FIELDS}
      createLabel="Add Service"
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "featured", label: "Featured", render: (s) => s.featured ? "⭐" : "—" },
        { key: "isActive", label: "Active", render: (s) => <Badge>{s.isActive ? "Yes" : "No"}</Badge> },
      ]}
    />
  );
}
