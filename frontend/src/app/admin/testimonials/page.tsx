"use client";

import { AdminCRUD } from "@/components/admin/AdminCRUD";
import { ADMIN_LIST_ALL, TESTIMONIAL_FIELDS, testimonialToPayload } from "@/lib/admin-resources";

export default function AdminTestimonialsPage() {
  return (
    <AdminCRUD
      title="Testimonial"
      endpoint="/testimonials"
      listParams={ADMIN_LIST_ALL}
      fields={TESTIMONIAL_FIELDS}
      toPayload={(f) => testimonialToPayload(f)}
      createLabel="Add Testimonial"
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role", render: (t) => t.role ?? "—" },
        { key: "rating", label: "Rating", render: (t) => "⭐".repeat(t.rating ?? 5) },
        { key: "featured", label: "Featured", render: (t) => t.featured ? "⭐" : "—" },
      ]}
    />
  );
}
