"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { PROJECT_FIELDS, projectToForm, projectToPayload } from "@/lib/admin-resources";

export default function AdminProjectsPage() {
  return (
    <AdminCRUD
      title="Project"
      endpoint="/projects"
      fields={PROJECT_FIELDS}
      toForm={projectToForm}
      toPayload={(f) => projectToPayload(f)}
      createLabel="Add Project"
      columns={[
        { key: "title", label: "Title" },
        { key: "location", label: "Location" },
        { key: "client", label: "Client", render: (p) => p.client ?? "N/A" },
        { key: "status", label: "Status", render: (p) => <Badge variant="secondary">{p.status}</Badge> },
      ]}
    />
  );
}
