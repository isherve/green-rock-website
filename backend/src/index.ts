import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { getEmailConfigStatus } from './lib/email-config';
import prisma from './lib/prisma';
import apiRoutes from './routes';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10_000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== 'production',
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Green Rock API is running',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      email: getEmailConfigStatus(),
    },
  });
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Green Rock API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const emailStatus = getEmailConfigStatus();
    if (emailStatus.configured) {
      console.log(`Email configured → notifications to ${emailStatus.adminEmail}`);
    } else {
      console.error('\n⚠️  EMAIL NOT CONFIGURED');
      console.error('   Messages/bookings save in admin, but NO emails are sent.');
      console.error('   Set SMTP_USER and SMTP_PASS in backend/.env (Gmail App Password).');
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

export default app;
