import 'dotenv/config';
import prisma from './lib/prisma';
import app from './app';
import { getEmailConfigStatus } from './lib/email-config';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const emailStatus = await getEmailConfigStatus();
    if (emailStatus.configured) {
      console.log(`Email configured (${emailStatus.provider}) → notifications to ${emailStatus.adminEmail}`);
    } else {
      console.error('\n⚠️  EMAIL NOT CONFIGURED');
      console.error('   Messages/bookings save in admin, but NO emails are sent.');
      console.error('   Set RESEND_API_KEY (recommended) or SMTP_USER + SMTP_PASS in backend/.env.');
      console.error(`   Notifications will go to: ${emailStatus.adminEmail}\n`);
    }

    app.listen(PORT, () => {
      console.log(`Green Rock API running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
