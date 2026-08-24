import { getAdminEmail } from './email-templates';

export type EmailProvider = 'resend' | 'smtp' | null;

export function getEmailProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY?.trim()) return 'resend';
  if (process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()) return 'smtp';
  return null;
}

export function isEmailConfigured(): boolean {
  return getEmailProvider() !== null;
}

export function getEmailFrom(): string {
  const from = process.env.EMAIL_FROM?.trim();
  if (from) {
    if (from.includes('<')) return from;
    return `Green Rock <${from}>`;
  }
  if (getEmailProvider() === 'resend') {
    return 'Green Rock <onboarding@resend.dev>';
  }
  const smtpUser = process.env.SMTP_USER?.trim();
  if (smtpUser) return `Green Rock <${smtpUser}>`;
  return 'Green Rock <notifications@greenrock.rw>';
}

function getMissingVars(): string[] {
  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());
  const hasSmtp = Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
  if (hasResend || hasSmtp) return [];

  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY?.trim()) missing.push('RESEND_API_KEY');
  if (!process.env.SMTP_USER?.trim()) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASS?.trim()) missing.push('SMTP_PASS');
  return missing;
}

export function getEmailConfigStatus() {
  const provider = getEmailProvider();
  const configured = provider !== null;
  const smtpUser = process.env.SMTP_USER?.trim() || null;
  const hasResendKey = Boolean(process.env.RESEND_API_KEY?.trim());
  const hasSmtpPass = Boolean(process.env.SMTP_PASS?.trim());
  const missing = getMissingVars();

  let hint: string;
  if (configured && provider === 'resend') {
    hint = `Email is ready via Resend. Notifications will be sent to ${getAdminEmail()}.`;
  } else if (configured && provider === 'smtp') {
    hint = `Email is ready via Gmail SMTP. Notifications will be sent to ${getAdminEmail()}.`;
  } else if (hasResendKey) {
    hint = 'RESEND_API_KEY is set but invalid or incomplete. Check your Resend dashboard.';
  } else if (smtpUser && !hasSmtpPass) {
    hint =
      'Gmail SMTP is partially configured (SMTP_USER set, SMTP_PASS missing). Easiest fix: add RESEND_API_KEY in Vercel instead — no App Password needed.';
  } else {
    hint =
      'Add RESEND_API_KEY in Vercel (recommended) or SMTP_USER + SMTP_PASS for Gmail. Messages save in admin but emails are NOT sent yet.';
  }

  return {
    configured,
    provider,
    adminEmail: getAdminEmail(),
    from: getEmailFrom(),
    hasResendKey,
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser,
    hasSmtpPass,
    missing,
    hint,
  };
}
