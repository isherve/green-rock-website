import { getAdminEmail } from './email-templates';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

export function getEmailConfigStatus() {
  const configured = isEmailConfigured();
  return {
    configured,
    adminEmail: getAdminEmail(),
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER?.trim() || null,
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || null,
    hint: configured
      ? 'Email is ready. Notifications will be sent to ' + getAdminEmail()
      : 'SMTP_USER and SMTP_PASS are missing in backend/.env — messages save to admin but emails are NOT sent.',
  };
}
