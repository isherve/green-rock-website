"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";
import api from "@/lib/api";
import { Loader2, CheckCircle, Mail, AlertCircle, Send } from "lucide-react";

type EmailStatus = {
  configured: boolean;
  provider?: "resend" | "smtp" | null;
  adminEmail: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string | null;
  hasResendKey?: boolean;
  hasSmtpPass?: boolean;
  missing?: string[];
  from: string | null;
  hint: string;
  events?: { event: string; recipient: string; customerCopy: boolean }[];
};

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
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/settings"),
      api.get("/settings/email/status").catch(() => null),
    ])
      .then(([settingsRes, emailRes]) => {
        const data = settingsRes.data.data as Record<string, Record<string, string>>;
        if (data.site) setSite((s) => ({ ...s, ...data.site }));
        if (data.contact) setContact((c) => ({ ...c, ...data.contact }));
        if (emailRes?.data?.data) setEmailStatus(emailRes.data.data as EmailStatus);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleTestEmail() {
    setTestingEmail(true);
    setEmailTestResult("");
    try {
      const res = await api.post("/settings/email/test");
      setEmailTestResult(res.data.message || "Test email sent!");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to send test email";
      setEmailTestResult(msg || "Failed to send test email");
    } finally {
      setTestingEmail(false);
    }
  }

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailStatus && (
            <>
              <div
                className={`rounded-lg border p-4 text-sm ${
                  emailStatus.configured
                    ? "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100"
                    : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
                }`}
              >
                <p className="font-semibold flex items-center gap-2">
                  {emailStatus.configured ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {emailStatus.configured ? "Email is active" : "Email not configured"}
                </p>
                <p className="mt-1 opacity-90">{emailStatus.hint}</p>
                {emailStatus.configured && emailStatus.provider && (
                  <p className="mt-1 text-xs opacity-80">
                    Provider: <strong>{emailStatus.provider === "resend" ? "Resend" : "Gmail SMTP"}</strong>
                    {emailStatus.from && <> · From: <strong>{emailStatus.from}</strong></>}
                  </p>
                )}
                <p className="mt-2 text-xs opacity-80">
                  Notifications go to: <strong>{emailStatus.adminEmail}</strong>
                </p>
                {!emailStatus.configured && (
                  <ul className="mt-3 space-y-1 text-xs">
                    <li>
                      RESEND_API_KEY:{" "}
                      {emailStatus.hasResendKey ? (
                        <span className="text-green-700 dark:text-green-400">✓ set</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">✗ missing — recommended</span>
                      )}
                    </li>
                    <li>
                      SMTP (fallback):{" "}
                      {emailStatus.smtpUser && emailStatus.hasSmtpPass ? (
                        <span className="text-green-700 dark:text-green-400">✓ configured</span>
                      ) : (
                        <span className="text-muted-foreground">optional Gmail App Password</span>
                      )}
                    </li>
                  </ul>
                )}
              </div>

              {!emailStatus.configured && (
                <div className="text-sm text-muted-foreground space-y-4 rounded-lg border p-4 bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Setup Resend (recommended, ~2 min):</p>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                      <li>Sign up free at <a href="https://resend.com/signup" className="text-primary underline" target="_blank" rel="noreferrer">resend.com</a> with <strong>{emailStatus.adminEmail}</strong></li>
                      <li>Create an API key at <a href="https://resend.com/api-keys" className="text-primary underline" target="_blank" rel="noreferrer">resend.com/api-keys</a></li>
                      <li>In Vercel → Settings → Environment Variables, add <code className="text-xs bg-muted px-1 rounded">RESEND_API_KEY</code> = your key (starts with <code className="text-xs bg-muted px-1 rounded">re_</code>)</li>
                      <li>Redeploy, then click &quot;Send Test Email&quot; below</li>
                    </ol>
                    <p className="text-xs mt-2 opacity-80">Without a custom domain, emails send from <code className="bg-muted px-1 rounded">onboarding@resend.dev</code>. Later you can verify your domain at resend.com/domains for branded emails.</p>
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium text-foreground">Alternative: Gmail SMTP</summary>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                      <li>Enable 2-Step Verification on Google</li>
                      <li>Create App Password at <a href="https://myaccount.google.com/apppasswords" className="text-primary underline" target="_blank" rel="noreferrer">myaccount.google.com/apppasswords</a></li>
                      <li>Add <code className="bg-muted px-1 rounded">SMTP_PASS</code> in Vercel</li>
                    </ol>
                  </details>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={handleTestEmail} disabled={testingEmail || !emailStatus.configured}>
                  {testingEmail ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Test Email
                </Button>
              </div>
              {emailTestResult && (
                <p className={`text-sm ${emailTestResult.includes("sent") ? "text-primary" : "text-red-500"}`}>
                  {emailTestResult}
                </p>
              )}

              {emailStatus.events && (
                <div>
                  <p className="text-sm font-medium mb-2">You receive an email when:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {emailStatus.events.map((e) => (
                      <li key={e.event} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{e.event} <span className="text-xs">→ {e.recipient}</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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
