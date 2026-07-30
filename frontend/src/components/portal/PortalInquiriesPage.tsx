"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalDataList, PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatDate } from "@/lib/utils";

type Inquiry = {
  id: string;
  type: string;
  status: string;
  message: string;
  createdAt: string;
};

export function PortalInquiriesPage({ type, title, contactType }: { type?: string; title: string; contactType: string }) {
  const endpoint = type ? `/portal/inquiries?type=${type}` : "/portal/inquiries";
  const { data, loading } = usePortalData<Inquiry>(endpoint);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (data.length === 0) {
    return (
      <PortalEmptyState
        title={`No ${title.toLowerCase()} yet`}
        description="Submit a request from the contact page and it will appear here."
        action={<Button asChild><Link href={`/contact?type=${contactType}`}>New Request</Link></Button>}
      />
    );
  }

  return (
    <PortalDataList
      items={data.map((i) => ({
        id: i.id,
        title: i.message.slice(0, 80) + (i.message.length > 80 ? "…" : ""),
        subtitle: formatDate(i.createdAt),
        status: i.status,
      }))}
      emptyTitle=""
      emptyDescription=""
    />
  );
}
