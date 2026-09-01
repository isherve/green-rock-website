"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Log = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
  user?: { name: string; email: string; role: string };
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/audit-logs", { params: { limit: "50" } })
      .then((res) => {
        const data = res.data.data;
        setLogs(Array.isArray(data) ? data : data?.items ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Audit Logs</h2>
      {logs.length === 0 ? (
        <p className="text-muted-foreground text-sm">No audit entries yet. Actions will be logged as staff use the system.</p>
      ) : (
        <div className="clean-card divide-y divide-border overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{log.action}</span>
                <span className="text-muted-foreground text-xs">{formatDate(log.createdAt)}</span>
              </div>
              <p className="text-muted-foreground mt-1">
                {log.entity}{log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}
                {log.user ? ` · ${log.user.name}` : ""}
                {log.ipAddress ? ` · ${log.ipAddress}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
