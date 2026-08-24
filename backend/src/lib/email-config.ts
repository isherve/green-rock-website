import { getAdminEmail } from './email-templates';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

function getMissingSmtpVars(): string[] {
  const missing: string[] = [];
  if (!process.env.SMTP_USER?.trim()) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASS?.trim()) missing.push('SMTP_PASS');
  return missing;
}

export function getEmailConfigStatus() {
  const configured = isEmailConfigured();
  const smtpUser = process.env.SMTP_USER?.trim() || null;
  const hasSmtpPass = Boolean(process.env.SMTP_PASS?.trim());
  const missing = getMissingSmtpVars();

  let hint: string;
  if (configured) {
    hint = 'Email is ready. Notifications will be sent to ' + getAdminEmail();
  } else if (missing.length === 1 && missing[0] === 'SMTP_PASS' && smtpUser) {
    hint =
      `SMTP_USER is set (${smtpUser}) but SMTP_PASS is missing. Add a Gmail App Password as SMTP_PASS in Vercel → Settings → Environment Variables, then redeploy. Messages still save in admin but emails are NOT sent yet.`;
  } else {
    hint = `Missing: ${missing.join(', ')}. Set these in Vercel → Settings → Environment Variables (SMTP_PASS = Gmail App Password). Messages save to admin but emails are NOT sent.`;
  }

  return {
    configured,
    adminEmail: getAdminEmail(),
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser,
    hasSmtpPass,
    missing,
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || null,
    hint,
  };
}
