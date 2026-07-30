"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { PROPERTY_FIELDS, propertyToForm, propertyToPayload } from "@/lib/admin-resources";

export default function AdminPropertiesPage() {
  return (
    <AdminCRUD
      title="Property"
      endpoint="/properties"
      fields={PROPERTY_FIELDS}
      toForm={propertyToForm}
      toPayload={(f) => propertyToPayload(f)}
      createLabel="Add Property"
      columns={[
        { key: "title", label: "Title" },
        { key: "location", label: "Location" },
        { key: "price", label: "Price", render: (p) => `${Number(p.price).toLocaleString()} ${p.currency}` },
        { key: "propertyType", label: "Type" },
        { key: "status", label: "Status", render: (p) => <Badge variant="secondary">{p.status}</Badge> },
      ]}
    />
  );
}
