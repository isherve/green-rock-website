/**
 * Test email delivery. Run after setting SMTP_USER + SMTP_PASS in .env:
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
    console.error('\n❌ SMTP is not configured.');
    console.error('Edit backend/.env and set:');
    console.error('  SMTP_USER=ishimwehervin10@gmail.com');
    console.error('  SMTP_PASS=your-16-char-gmail-app-password');
    console.error('\nCreate App Password: https://myaccount.google.com/apppasswords');
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
        intro: 'If you received this, Green Rock will notify you for every message, order, and booking.',
        rows: [
          { label: 'SMTP User', value: status.smtpUser || '' },
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
    console.error('\nCommon fixes for Gmail:');
    console.error('  1. Use an App Password, NOT your normal Gmail password');
    console.error('  2. Enable 2-Step Verification on your Google account first');
    console.error('  3. SMTP_USER must be ishimwehervin10@gmail.com');
    process.exit(1);
  }
}

main();
