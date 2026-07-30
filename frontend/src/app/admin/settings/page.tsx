"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";
import api from "@/lib/api";
import { Loader2, CheckCircle } from "lucide-react";

type SiteSettings = {
  name?: string;
  tagline?: string;
  description?: string;
  architectureNote?: string;
};

type ContactSettings = {
  email?: string;
  phone?: string;
  phone2?: string;
  address?: string;
  whatsapp?: string;
  workingHours?: string;
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [site, setSite] = useState<SiteSettings>({
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
    architectureNote: SITE_CONFIG.architectureNote,
  });
  const [contact, setContact] = useState<ContactSettings>({
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    whatsapp: SITE_CONFIG.whatsapp,
    address: SITE_CONFIG.address,
    workingHours: "Mon - Sat: 8:00 AM - 6:00 PM",
  });

  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        const data = res.data.data as Record<string, Record<string, string>>;
        if (data.site) setSite((s) => ({ ...s, ...data.site }));
        if (data.contact) setContact((c) => ({ ...c, ...data.contact }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.put("/settings/bulk", { site, contact });
      setSaved(true);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Company Name</label>
            <Input value={site.name ?? ""} onChange={(e) => setSite({ ...site, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tagline</label>
            <Input value={site.tagline ?? ""} onChange={(e) => setSite({ ...site, tagline: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea value={site.description ?? ""} onChange={(e) => setSite({ ...site, description: e.target.value })} rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Architecture & Drawings Note</label>
            <Textarea value={site.architectureNote ?? ""} onChange={(e) => setSite({ ...site, architectureNote: e.target.value })} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Phone</label>
            <Input value={contact.phone ?? ""} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">WhatsApp</label>
            <Input value={contact.whatsapp ?? ""} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" value={contact.email ?? ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Address</label>
            <Input value={contact.address ?? ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Working Hours</label>
            <Input value={contact.workingHours ?? ""} onChange={(e) => setContact({ ...contact, workingHours: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving}>
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Settings"}
      </Button>
      {saved && (
        <p className="text-sm text-primary flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Settings saved successfully
        </p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
