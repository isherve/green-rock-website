/**
 * Test email delivery. Run after setting RESEND_API_KEY or SMTP credentials in .env:
 *   npm run test:email
 */
import 'dotenv/config';
import { getEmailConfigStatus } from '../src/lib/email-config';
import { sendEmail } from '../src/lib/email';
import { buildAdminEmail } from '../src/lib/email-templates';

async function main() {
  const status = getEmailConfigStatus();
  console.log('Email config:', status);

  if (!status.configured) {
    console.error('\n❌ Email is not configured.');
    console.error('Option A — Resend (recommended):');
    console.error('  RESEND_API_KEY=re_xxxxxxxx');
    console.error('  Sign up: https://resend.com/api-keys');
    console.error('\nOption B — Gmail SMTP:');
    console.error('  SMTP_USER=ishimwehervin10@gmail.com');
    console.error('  SMTP_PASS=your-16-char-gmail-app-password');
    process.exit(1);
  }

  try {
    await sendEmail({
      to: status.adminEmail,
      subject: '[Green Rock] Test Email — Setup OK',
      html: buildAdminEmail({
        preheader: 'Your email notifications are working',
        badge: 'Test',
        title: 'Email Setup Successful',
        intro: `If you received this, Green Rock will notify you for every message, order, and booking (via ${status.provider}).`,
        rows: [
          { label: 'Provider', value: status.provider || 'unknown', highlight: true },
          { label: 'From', value: status.from || '' },
          { label: 'Admin inbox', value: status.adminEmail, highlight: true },
          { label: 'Sent at', value: new Date().toLocaleString() },
        ],
        message: 'This is a test from the Green Rock website backend.',
      }),
    });
    console.log(`\n✅ Test email sent to ${status.adminEmail}`);
    console.log('Check your inbox (and spam folder).');
  } catch (err) {
    console.error('\n❌ Failed to send test email:', err);
    if (status.provider === 'resend') {
      console.error('\nResend tips:');
      console.error('  1. Verify API key at https://resend.com/api-keys');
      console.error('  2. Without a verified domain, use onboarding@resend.dev and send only to your Resend account email');
    } else {
      console.error('\nGmail SMTP tips:');
      console.error('  1. Use an App Password, NOT your normal Gmail password');
      console.error('  2. Enable 2-Step Verification first');
    }
    process.exit(1);
  }
}

main();
