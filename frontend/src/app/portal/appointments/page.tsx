"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";

type Appointment = {
  id: string;
  date: string;
  time: string;
  service: string | null;
  isConfirmed: boolean;
};

export default function AppointmentsPage() {
  const { data, loading } = usePortalData<Appointment>("/portal/appointments");

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (data.length === 0) {
    return (
      <PortalEmptyState
        title="No appointments scheduled"
        description="Book a consultation or site visit through our contact page."
        action={<Button asChild><Link href="/contact?type=APPOINTMENT">Book Appointment</Link></Button>}
      />
    );
  }

  return (
    <PortalDataList
      items={data.map((a) => ({
        id: a.id,
        title: a.service ?? "Site visit / consultation",
        subtitle: `${formatDate(a.date)} at ${a.time}`,
        status: a.isConfirmed ? "Confirmed" : "Pending",
      }))}
      emptyTitle=""
      emptyDescription=""
    />
  );
}
