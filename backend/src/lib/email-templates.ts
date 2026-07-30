const BRAND = {
  name: 'Green Rock General Supply Ltd',
  shortName: 'Green Rock',
  primary: '#0b6e4f',
  gold: '#d4af37',
  dark: '#1f2937',
  muted: '#64748b',
  siteUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export const DEFAULT_ADMIN_EMAIL = 'ishimwehervin10@gmail.com';

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMultiline(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

export type EmailRow = { label: string; value: string; highlight?: boolean };

export function buildAdminEmail(options: {
  preheader: string;
  badge: string;
  badgeColor?: string;
  title: string;
  intro?: string;
  rows: EmailRow[];
  messageLabel?: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
}): string {
  const badgeColor = options.badgeColor || BRAND.primary;
  const rowsHtml = options.rows
    .filter((r) => r.value)
    .map(
      (r) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eef2f7;color:${BRAND.muted};font-size:13px;width:140px;vertical-align:top;">${escapeHtml(r.label)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eef2f7;color:${r.highlight ? BRAND.primary : BRAND.dark};font-size:14px;font-weight:${r.highlight ? '600' : '400'};">${formatMultiline(r.value)}</td>
      </tr>`
    )
    .join('');

  const messageBlock = options.message
    ? `
      <div style="margin-top:24px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.muted};">${escapeHtml(options.messageLabel || 'Message')}</p>
        <div style="background:#f8fafc;border-left:4px solid ${BRAND.gold};border-radius:8px;padding:16px 18px;color:${BRAND.dark};font-size:14px;line-height:1.7;">
          ${formatMultiline(options.message)}
        </div>
      </div>`
    : '';

  const actionBlock = options.actionUrl
    ? `
      <div style="margin-top:28px;text-align:center;">
        <a href="${escapeHtml(options.actionUrl)}" style="display:inline-block;background:${BRAND.primary};color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:600;">
          ${escapeHtml(options.actionLabel || 'View in Admin')}
        </a>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(options.preheader)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg, ${BRAND.primary} 0%, #094d38 100%);padding:28px 32px;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.75);">${BRAND.shortName} Admin</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.3;">${escapeHtml(options.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 12px;">
              <span style="display:inline-block;background:${badgeColor};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:6px 12px;border-radius:999px;">
                ${escapeHtml(options.badge)}
              </span>
              ${options.intro ? `<p style="margin:18px 0 0;color:${BRAND.muted};font-size:15px;line-height:1.6;">${escapeHtml(options.intro)}</p>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eef2f7;border-radius:14px;overflow:hidden;">
                ${rowsHtml}
              </table>
              ${messageBlock}
              ${actionBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #eef2f7;background:#fafbfc;">
              <p style="margin:0;color:${BRAND.muted};font-size:12px;line-height:1.6;text-align:center;">
                This notification was sent to <strong>${escapeHtml(getAdminEmail())}</strong><br>
                ${BRAND.name} · Kigali, Rwanda · +250 785 652 011
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildCustomerEmail(options: {
  title: string;
  greeting: string;
  body: string;
  footer?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg, ${BRAND.primary} 0%, #094d38 100%);padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;">${escapeHtml(options.title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:${BRAND.dark};font-size:15px;line-height:1.7;">
            <p style="margin:0 0 16px;">${escapeHtml(options.greeting)}</p>
            <div style="color:${BRAND.muted};">${options.body}</div>
            <p style="margin:24px 0 0;color:${BRAND.dark};">
              ${escapeHtml(options.footer || 'Thank you for choosing Green Rock General Supply Ltd.')}
            </p>
            <p style="margin:16px 0 0;font-weight:600;color:${BRAND.primary};">${BRAND.name}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const INQUIRY_TYPE_LABELS: Record<string, string> = {
  QUOTE: 'Quote Request',
  PROPERTY: 'Property Inquiry',
  MATERIAL: 'Materials Order',
  CONSTRUCTION: 'Construction Project',
  GENERAL: 'General Message',
  APPOINTMENT: 'Appointment Request',
};

export function inquiryBadgeColor(type: string): string {
  switch (type) {
    case 'MATERIAL': return '#2563eb';
    case 'PROPERTY': return '#7c3aed';
    case 'CONSTRUCTION': return '#b45309';
    case 'APPOINTMENT': return '#0891b2';
    case 'QUOTE': return BRAND.gold;
    default: return BRAND.primary;
  }
}
