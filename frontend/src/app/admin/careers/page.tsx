"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { ADMIN_LIST_ALL, CAREER_FIELDS } from "@/lib/admin-resources";

export default function AdminCareersPage() {
  return (
    <AdminCRUD
      title="Career"
      endpoint="/careers"
      listParams={ADMIN_LIST_ALL}
      fields={CAREER_FIELDS}
      createLabel="Add Job"
      columns={[
        { key: "title", label: "Position" },
        { key: "department", label: "Department" },
        { key: "location", label: "Location" },
        { key: "type", label: "Type" },
        { key: "isActive", label: "Status", render: (c) => <Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? "Open" : "Closed"}</Badge> },
      ]}
    />
  );
}
