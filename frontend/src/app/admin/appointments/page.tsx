"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { APPOINTMENT_FIELDS } from "@/lib/admin-resources";
import { formatDate } from "@/lib/utils";

type Row = { id: string; name: string; email: string; date: string; time: string; service: string | null; isConfirmed: boolean };

export default function AdminAppointmentsPage() {
  return (
    <AdminCRUD<Row>
      title="Appointments"
      endpoint="/appointments"
      hideCreate
      updateMethod="patch"
      columns={[
        { key: "name", label: "Client" },
        { key: "email", label: "Email" },
        { key: "date", label: "Date", render: (r) => formatDate(r.date) },
        { key: "time", label: "Time" },
        { key: "service", label: "Service", render: (r) => r.service ?? "N/A" },
        { key: "isConfirmed", label: "Status", render: (r) => (
          <Badge variant={r.isConfirmed ? "default" : "secondary"}>{r.isConfirmed ? "Confirmed" : "Pending"}</Badge>
        ) },
      ]}
      fields={APPOINTMENT_FIELDS}
      toForm={(item) => ({
        ...item,
        date: item.date ? new Date(item.date as string).toISOString() : "",
      })}
      toPayload={(form) => ({
        isConfirmed: form.isConfirmed,
        date: form.date,
        time: form.time,
        service: form.service,
        message: form.message,
      })}
    />
  );
}
