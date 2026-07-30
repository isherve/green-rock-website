"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { CATEGORY_FIELDS } from "@/lib/admin-resources";

export default function AdminCategoriesPage() {
  return (
    <AdminCRUD
      title="Category"
      endpoint="/categories"
      fields={CATEGORY_FIELDS}
      createLabel="Add Category"
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "order", label: "Order" },
        { key: "isActive", label: "Active", render: (c) => <Badge>{c.isActive ? "Yes" : "No"}</Badge> },
      ]}
    />
  );
}
