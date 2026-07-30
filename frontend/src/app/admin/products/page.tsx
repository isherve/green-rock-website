"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { PRODUCT_FIELDS, productToForm, productToPayload } from "@/lib/admin-resources";

export default function AdminProductsPage() {
  return (
    <AdminCRUD
      title="Product"
      endpoint="/products"
      fields={PRODUCT_FIELDS}
      toForm={productToForm}
      toPayload={(f) => productToPayload(f)}
      createLabel="Add Product"
      columns={[
        { key: "name", label: "Name" },
        { key: "category", label: "Category", render: (p) => p.category?.name ?? "—" },
        { key: "price", label: "Price", render: (p) => `${Number(p.price).toLocaleString()} ${p.currency}` },
        { key: "stock", label: "Stock" },
        { key: "availability", label: "Available", render: (p) => <Badge>{p.availability ? "Yes" : "No"}</Badge> },
      ]}
    />
  );
}
