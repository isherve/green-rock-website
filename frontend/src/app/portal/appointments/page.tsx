"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList } from "@/components/portal/PortalWidgets";
import { PortalFormCard } from "@/components/portal/PortalFormCard";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

type Appointment = {
  id: string;
  date: string;
  time: string;
  service: string | null;
  isConfirmed: boolean;
};

export default function AppointmentsPage() {
  const { data, loading, refetch } = usePortalData<Appointment>("/portal/appointments");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [service, setService] = useState("Property viewing");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const iso = new Date(`${date}T${time}:00`).toISOString();
      await api.post("/portal/appointments", { date: iso, time, service, message });
      setMessage("");
      refetch();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <PortalFormCard title="Book Appointment" description="Schedule a site visit, consultation, or property viewing.">
        <form onSubmit={book} className="space-y-4 max-w-lg">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          <Input placeholder="Service type" value={service} onChange={(e) => setService(e.target.value)} />
          <Textarea placeholder="Additional details" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
          <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book Appointment"}</Button>
        </form>
      </PortalFormCard>

      <PortalDataList
        items={data.map((a) => ({
          id: a.id,
          title: a.service ?? "Consultation",
          subtitle: `${formatDate(a.date)} at ${a.time}`,
          status: a.isConfirmed ? "Confirmed" : "Pending",
        }))}
        emptyTitle="No appointments yet"
        emptyDescription="Book your first appointment using the form above."
      />
    </div>
  );
}
