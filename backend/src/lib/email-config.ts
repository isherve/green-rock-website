import { getAdminEmail } from './email-templates';
import { getResendApiKey } from './email-settings';

export type EmailProvider = 'resend' | 'smtp' | null;

export async function getEmailProvider(): Promise<EmailProvider> {
  if (await getResendApiKey()) return 'resend';
  if (process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()) return 'smtp';
  return null;
}

export async function isEmailConfigured(): Promise<boolean> {
  return (await getEmailProvider()) !== null;
}

function extractEmailAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] || from).trim().toLowerCase();
}

function isPublicInboxDomain(from: string): boolean {
  const domain = extractEmailAddress(from).split('@')[1];
  const publicDomains = new Set([
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'icloud.com',
    'aol.com',
  ]);
  return !domain || publicDomains.has(domain);
}

export function getEmailFrom(provider: EmailProvider): string {
  const from = process.env.EMAIL_FROM?.trim();

  if (provider === 'resend') {
    // Resend rejects gmail/yahoo etc. — use onboarding address until a custom domain is verified.
    if (from && !isPublicInboxDomain(from)) {
      if (from.includes('<')) return from;
      return `Green Rock <${from}>`;
    }
    return 'Green Rock <onboarding@resend.dev>';
  }

  if (from) {
    if (from.includes('<')) return from;
    return `Green Rock <${from}>`;
  }
  const smtpUser = process.env.SMTP_USER?.trim();
  if (smtpUser) return `Green Rock <${smtpUser}>`;
  return 'Green Rock <notifications@greenrock.rw>';
}

export async function getEmailConfigStatus() {
  const provider = await getEmailProvider();
  const configured = provider !== null;
  const smtpUser = process.env.SMTP_USER?.trim() || null;
  const hasResendKeyEnv = Boolean(process.env.RESEND_API_KEY?.trim());
  const hasResendKeyDb = Boolean(!hasResendKeyEnv && (await getResendApiKey()));
  const hasResendKey = hasResendKeyEnv || hasResendKeyDb;
  const hasSmtpPass = Boolean(process.env.SMTP_PASS?.trim());
  const resendSource = hasResendKeyEnv ? 'env' : hasResendKeyDb ? 'database' : null;

  let hint: string;
  if (configured && provider === 'resend') {
    hint = `Email is ready via Resend (${resendSource === 'database' ? 'saved in admin settings' : 'Vercel env'}). Notifications go to ${getAdminEmail()}.`;
  } else if (configured && provider === 'smtp') {
    hint = `Email is ready via Gmail SMTP. Notifications will be sent to ${getAdminEmail()}.`;
  } else if (smtpUser && !hasSmtpPass && !hasResendKey) {
    hint =
      'Add a Resend API key below (recommended) or SMTP_PASS in Vercel. Messages save in admin but emails are NOT sent yet.';
  } else {
    hint =
      'Paste your Resend API key below, or set RESEND_API_KEY in Vercel. Messages save in admin but emails are NOT sent yet.';
  }

  return {
    configured,
    provider,
    adminEmail: getAdminEmail(),
    from: getEmailFrom(provider),
    hasResendKey,
    resendSource,
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser,
    hasSmtpPass,
    hint,
  };
}
