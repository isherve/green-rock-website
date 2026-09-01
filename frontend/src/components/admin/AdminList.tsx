"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export { Badge };

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

interface AdminListProps<T extends { id: string }> {
  title: string;
  endpoint: string;
  columns: Column<T>[];
  onAdd?: () => void;
  addLabel?: string;
}

export function AdminList<T extends { id: string }>({
  title,
  endpoint,
  columns,
  onAdd,
  addLabel = "Add New",
}: AdminListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(endpoint, { params: { limit: 50 } });
      const data = res.data.data;
      setItems(Array.isArray(data) ? data : data.items ?? data.data ?? []);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message) : "Failed to load data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm">{items.length} records</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-1" /> {addLabel}
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-medium text-muted-foreground">{col.label}</th>
                ))}
                <th className="px-4 py-3 w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No records found</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "N/A")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
