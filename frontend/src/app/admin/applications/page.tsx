"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string | null;
  status: string;
  createdAt: string;
  career?: { title: string; slug: string; department: string };
};

const STATUSES = ["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"] as const;

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/careers/applications/list", { params: { limit: 100 } });
      setApplications(res.data.data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/careers/applications/${id}`, { status });
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">
        Review job applications submitted through the careers page.
      </p>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="text-muted-foreground text-sm">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border rounded-xl p-4">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                <div>
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.email} · {app.phone}</p>
                  {app.career && (
                    <p className="text-sm text-primary mt-1">
                      Applied for: {app.career.title} ({app.career.department})
                    </p>
                  )}
                </div>
                <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v)}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {app.coverLetter && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{app.coverLetter}</p>
              )}
              <div className="flex items-center gap-3 text-xs">
                <Badge variant="outline">{formatDate(app.createdAt)}</Badge>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <Link href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View resume
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
