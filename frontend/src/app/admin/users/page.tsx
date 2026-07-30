"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { USER_FIELDS, userToPayload } from "@/lib/admin-resources";

export default function AdminUsersPage() {
  return (
    <AdminCRUD
      title="User"
      endpoint="/users"
      fields={USER_FIELDS}
      toPayload={(f, isEdit) => userToPayload(f, isEdit)}
      createLabel="Add User"
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role", render: (u) => <Badge variant="secondary">{u.role}</Badge> },
        { key: "isActive", label: "Active", render: (u) => <Badge>{u.isActive ? "Yes" : "No"}</Badge> },
      ]}
    />
  );
}
