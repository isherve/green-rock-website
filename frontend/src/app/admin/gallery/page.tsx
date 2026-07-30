"use client";

import { AdminCRUD } from "@/components/admin/AdminCRUD";
import { GALLERY_FIELDS } from "@/lib/admin-resources";

export default function AdminGalleryPage() {
  return (
    <AdminCRUD
      title="Gallery Item"
      endpoint="/gallery"
      fields={GALLERY_FIELDS}
      createLabel="Add Media"
      columns={[
        { key: "title", label: "Title" },
        { key: "type", label: "Type" },
        { key: "category", label: "Category" },
        { key: "featured", label: "Featured", render: (g) => g.featured ? "⭐" : "—" },
      ]}
    />
  );
}
