"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, RefreshCw, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImageUpload, SingleImageUpload } from "@/components/admin/ImageUpload";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "boolean" | "images" | "image" | "password";
  required?: boolean;
  requiredOnCreate?: boolean;
  options?: { value: string; label: string }[];
  loadOptionsKey?: string;
  placeholder?: string;
  rows?: number;
  defaultValue?: unknown;
};

type AdminRow = { id: string; [key: string]: any };

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

interface AdminCRUDProps<T extends AdminRow = AdminRow> {
  title: string;
  endpoint: string;
  columns: Column<T>[];
  fields: FieldDef[];
  listParams?: Record<string, string>;
  toForm?: (item: T) => Record<string, unknown>;
  toPayload?: (form: Record<string, unknown>, isEdit: boolean) => Record<string, unknown>;
  createLabel?: string;
  hideCreate?: boolean;
  updateMethod?: "put" | "patch";
}

function getDefaults(fields: FieldDef[]) {
  return Object.fromEntries(
    fields.map((f) => [f.name, f.defaultValue ?? (f.type === "boolean" ? false : f.type === "images" ? [] : "")])
  );
}

export function AdminCRUD<T extends AdminRow = AdminRow>({
  title,
  endpoint,
  columns,
  fields,
  listParams = {},
  toForm,
  toPayload,
  createLabel = "Add New",
  hideCreate = false,
  updateMethod = "put",
}: AdminCRUDProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(getDefaults(fields));
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, { value: string; label: string }[]>>({});

  const listParamsKey = JSON.stringify(listParams);

  const fetchItems = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const params = { limit: 100, ...JSON.parse(listParamsKey) as Record<string, string> };
      const res = await api.get(endpoint, { params });
      const data = res.data.data;
      setItems(Array.isArray(data) ? data : data.items ?? []);
    } catch (err: unknown) {
      setError(err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to load");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [endpoint, listParamsKey]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  useEffect(() => {
    const loadCategories = async () => {
      if (fields.some((f) => f.loadOptionsKey === "categories")) {
        try {
          const res = await api.get("/categories", { params: { limit: 100 } });
          const cats = res.data.data.items ?? res.data.data ?? [];
          setDynamicOptions((prev) => ({
            ...prev,
            categories: cats.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name })),
          }));
        } catch { /* ignore */ }
      }
    };
    loadCategories();
  }, [fields]);

  const openCreate = () => {
    setEditing(null);
    setForm(getDefaults(fields));
    setOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setForm(toForm ? toForm(item) : { ...item });
    setOpen(true);
  };

  const setField = (name: string, value: unknown) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    for (const f of fields) {
      const req = editing ? f.required : (f.required || f.requiredOnCreate);
      if (req && !form[f.name] && form[f.name] !== false) {
        alert(`${f.label} is required`);
        return;
      }
    }
    setSaving(true);
    try {
      const payload = toPayload ? toPayload(form, !!editing) : form;
      if (editing) {
        if (updateMethod === "patch") {
          await api.patch(`${endpoint}/${editing.id}`, payload);
        } else {
          await api.put(`${endpoint}/${editing.id}`, payload);
        }
      } else {
        await api.post(endpoint, payload);
      }
      setOpen(false);
      fetchItems(true);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Save failed";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const renderField = (field: FieldDef) => {
    const val = form[field.name];
    const opts = field.loadOptionsKey ? dynamicOptions[field.loadOptionsKey] ?? [] : field.options ?? [];

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            value={String(val ?? "")}
            onChange={(e) => setField(field.name, e.target.value)}
            rows={field.rows ?? 3}
            placeholder={field.placeholder}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={val === "" || val === undefined ? "" : String(val)}
            onChange={(e) => setField(field.name, e.target.value === "" ? "" : Number(e.target.value))}
          />
        );
      case "select":
        return (
          <Select value={String(val ?? "")} onValueChange={(v) => setField(field.name, v)}>
            <SelectTrigger><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
            <SelectContent>
              {opts.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!val} onChange={(e) => setField(field.name, e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Yes</span>
          </label>
        );
      case "images":
        return (
          <ImageUpload
            value={(val as string[]) || []}
            onChange={(urls) => setField(field.name, urls)}
            multiple
            folder={title.toLowerCase()}
          />
        );
      case "image":
        return (
          <SingleImageUpload
            value={String(val ?? "")}
            onChange={(url) => setField(field.name, url)}
            folder={title.toLowerCase()}
          />
        );
      case "password":
        return (
          <Input
            type="password"
            value={String(val ?? "")}
            onChange={(e) => setField(field.name, e.target.value)}
            placeholder={editing ? "Leave blank to keep current" : field.placeholder}
          />
        );
      default:
        return (
          <Input
            value={String(val ?? "")}
            onChange={(e) => setField(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm">{items.length} {title.toLowerCase()}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchItems()} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          {!hideCreate && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1" /> {createLabel}
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto min-h-[280px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-medium text-muted-foreground">{col.label}</th>
                ))}
                <th className="px-4 py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No records — click Add New to create one</td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-medium">
                  {field.label}{field.required || (!editing && field.requiredOnCreate) ? " *" : ""}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { Badge };
