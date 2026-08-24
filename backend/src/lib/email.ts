import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { AppError } from '../utils/AppError';
import {
  buildAdminEmail,
  buildCustomerEmail,
  getAdminEmail,
  INQUIRY_TYPE_LABELS,
  inquiryBadgeColor,
} from './email-templates';
import { getEmailFrom, getEmailProvider, isEmailConfigured } from './email-config';
import { getResendApiKey } from './email-settings';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

async function sendViaResend(options: EmailOptions): Promise<void> {
  const apiKey = await getResendApiKey();
  if (!apiKey) throw new Error('Resend API key not configured');
  const resend = new Resend(apiKey);
  const to = Array.isArray(options.to) ? options.to : [options.to];
  const { error } = await resend.emails.send({
    from: getEmailFrom('resend'),
    to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
  if (error) {
    throw new Error(error.message);
  }
}

async function sendViaSmtp(options: EmailOptions): Promise<void> {
  await createTransporter().sendMail({
    from: getEmailFrom('smtp'),
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!(await isEmailConfigured())) {
    const msg = `[Email] NOT SENT — set RESEND_API_KEY or SMTP_USER/SMTP_PASS. Would send "${options.subject}" → ${options.to}`;
    console.error(msg);
    if (process.env.NODE_ENV === 'production') {
      throw new AppError('Email service is not configured', 503);
    }
    return;
  }

  const provider = await getEmailProvider();

  try {
    if (provider === 'resend') {
      await sendViaResend(options);
    } else {
      await sendViaSmtp(options);
    }
    console.log(`[Email] Sent via ${provider}: "${options.subject}" → ${options.to}`);
  } catch (err) {
    console.error(`[Email] Failed to send via ${provider}:`, options.subject, err);
    throw err;
  }
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const typeLabel = data.subject || 'Contact Message';
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] New Contact — ${data.name}`,
    replyTo: data.email,
    html: buildAdminEmail({
      preheader: `New contact message from ${data.name}`,
      badge: 'Contact Form',
      badgeColor: '#0b6e4f',
      title: 'New Contact Message',
      intro: 'Someone submitted the contact form on your website.',
      rows: [
        { label: 'Name', value: data.name, highlight: true },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone || 'Not provided' },
        { label: 'Subject', value: typeLabel },
        { label: 'Received', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
      message: data.message,
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/leads`,
      actionLabel: 'Open Leads Hub',
    }),
  });
}

export async function sendContactCustomerConfirmation(data: {
  name: string;
  email: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: 'Green Rock — We Received Your Message',
    html: buildCustomerEmail({
      title: 'Message Received',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0;">Thank you for contacting Green Rock. Our team has received your message and will reply within 1–2 business days.</p>
        <p style="margin:12px 0 0;">For urgent matters, call us at <strong>+250 785 652 011</strong>.</p>`,
    }),
  });
}

export async function sendInquiryCustomerConfirmation(data: {
  name: string;
  email: string;
  type: string;
}): Promise<void> {
  const typeLabel = INQUIRY_TYPE_LABELS[data.type] || data.type;
  await sendEmail({
    to: data.email,
    subject: `Green Rock — Your ${typeLabel} Request is Received`,
    html: buildCustomerEmail({
      title: 'Request Received',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0;">We received your <strong>${typeLabel}</strong> request. A Green Rock team member will follow up with you shortly.</p>`,
    }),
  });
}

export async function sendInquiryNotification(data: {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
  propertyTitle?: string;
  productName?: string;
}): Promise<void> {
  const typeLabel = INQUIRY_TYPE_LABELS[data.type] || data.type;
  const isOrder = data.type === 'MATERIAL';

  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] ${isOrder ? 'New Order' : 'New Inquiry'} — ${typeLabel} from ${data.name}`,
    replyTo: data.email,
    html: buildAdminEmail({
      preheader: `${typeLabel} from ${data.name}`,
      badge: isOrder ? 'Materials Order' : typeLabel,
      badgeColor: inquiryBadgeColor(data.type),
      title: isOrder ? 'New Materials Order Request' : `New ${typeLabel}`,
      intro: isOrder
        ? 'A customer requested building materials or a supply quote.'
        : 'A new inquiry was submitted through the website.',
      rows: [
        { label: 'Customer', value: data.name, highlight: true },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone || 'Not provided' },
        { label: 'Type', value: typeLabel },
        ...(data.propertyTitle ? [{ label: 'Property', value: data.propertyTitle, highlight: true }] : []),
        ...(data.productName ? [{ label: 'Product', value: data.productName, highlight: true }] : []),
        { label: 'Received', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
      message: data.message,
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/leads`,
      actionLabel: 'View in Admin',
    }),
  });
}

export async function sendAppointmentAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  service?: string;
  message?: string;
}): Promise<void> {
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] New Booking — ${data.name} on ${data.date.toLocaleDateString()}`,
    replyTo: data.email,
    html: buildAdminEmail({
      preheader: `Appointment booking from ${data.name}`,
      badge: 'New Booking',
      badgeColor: '#0891b2',
      title: 'New Appointment Booking',
      intro: 'A client booked an appointment on your website.',
      rows: [
        { label: 'Client', value: data.name, highlight: true },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Date', value: data.date.toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), highlight: true },
        { label: 'Time', value: data.time, highlight: true },
        { label: 'Service', value: data.service || 'General consultation' },
        { label: 'Booked', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
      message: data.message,
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/appointments`,
      actionLabel: 'Manage Appointments',
    }),
  });
}

export async function sendAppointmentCustomerConfirmation(data: {
  name: string;
  email: string;
  date: Date;
  time: string;
  service?: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: 'Green Rock — Your Appointment Request is Received',
    html: buildCustomerEmail({
      title: 'Booking Received',
      greeting: `Dear ${data.name},`,
      body: `
        <p style="margin:0 0 12px;">We have received your appointment request and our team will confirm shortly.</p>
        <table role="presentation" style="width:100%;background:#f8fafc;border-radius:12px;padding:16px;margin:16px 0;">
          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Date</td><td style="padding:6px 0;font-weight:600;">${data.date.toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Time</td><td style="padding:6px 0;font-weight:600;">${data.time}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Service</td><td style="padding:6px 0;">${data.service || 'General consultation'}</td></tr>
        </table>
        <p style="margin:0;">If you need to make changes, reply to this email or call us at <strong>+250 785 652 011</strong>.</p>
      `,
    }),
  });
}

export async function sendNewsletterAdminNotification(email: string): Promise<void> {
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] New Newsletter Subscriber`,
    html: buildAdminEmail({
      preheader: `New subscriber: ${email}`,
      badge: 'Newsletter',
      badgeColor: '#7c3aed',
      title: 'New Newsletter Subscriber',
      intro: 'Someone subscribed to your newsletter.',
      rows: [
        { label: 'Email', value: email, highlight: true },
        { label: 'Subscribed', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
    }),
  });
}

export async function sendCareerApplicationAdminNotification(data: {
  applicantName: string;
  applicantEmail: string;
  phone: string;
  jobTitle: string;
  coverLetter?: string;
  resumeUrl?: string;
}): Promise<void> {
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] Job Application — ${data.jobTitle} (${data.applicantName})`,
    replyTo: data.applicantEmail,
    html: buildAdminEmail({
      preheader: `Application for ${data.jobTitle}`,
      badge: 'Career Application',
      badgeColor: '#b45309',
      title: 'New Job Application',
      intro: 'A candidate submitted an application through the careers page.',
      rows: [
        { label: 'Applicant', value: data.applicantName, highlight: true },
        { label: 'Email', value: data.applicantEmail },
        { label: 'Phone', value: data.phone },
        { label: 'Position', value: data.jobTitle, highlight: true },
        { label: 'Resume', value: data.resumeUrl || 'Attached via upload' },
        { label: 'Submitted', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
      message: data.coverLetter,
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/applications`,
      actionLabel: 'View Applications',
    }),
  });
}

export async function sendCareerApplicationConfirmation(data: {
  name: string;
  email: string;
  jobTitle: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: `Green Rock — Application Received for ${data.jobTitle}`,
    html: buildCustomerEmail({
      title: 'Application Received',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0;">Thank you for applying for the position of <strong>${data.jobTitle}</strong>. Our HR team will review your application and contact you if you are shortlisted.</p>`,
    }),
  });
}

export async function sendMaterialOrderAdminNotification(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  itemCount: number;
}): Promise<void> {
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] Material Order ${data.orderNumber} from ${data.customerName}`,
    replyTo: data.customerEmail,
    html: buildAdminEmail({
      preheader: `Order ${data.orderNumber}`,
      badge: 'Material Order',
      badgeColor: '#0b6e4f',
      title: 'New Material Order',
      intro: 'A customer placed a material order through the portal.',
      rows: [
        { label: 'Order #', value: data.orderNumber, highlight: true },
        { label: 'Customer', value: data.customerName },
        { label: 'Email', value: data.customerEmail },
        { label: 'Items', value: String(data.itemCount) },
        { label: 'Total', value: `${data.totalAmount.toLocaleString()} ${data.currency}`, highlight: true },
      ],
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders`,
      actionLabel: 'Manage Orders',
    }),
  });
}

export async function sendMaterialOrderCustomerConfirmation(data: {
  name: string;
  email: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: `Green Rock — Order ${data.orderNumber} Received`,
    html: buildCustomerEmail({
      title: 'Order Received',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0 0 12px;">We received your material order <strong>${data.orderNumber}</strong> for <strong>${data.totalAmount.toLocaleString()} ${data.currency}</strong>. Our team will confirm availability and delivery details shortly.</p>`,
    }),
  });
}

export async function sendTicketAdminNotification(data: {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
}): Promise<void> {
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] Support Ticket ${data.ticketNumber} — ${data.subject}`,
    replyTo: data.customerEmail,
    html: buildAdminEmail({
      preheader: data.subject,
      badge: 'Support Ticket',
      badgeColor: '#dc2626',
      title: 'New Support Ticket',
      intro: 'A customer opened a support ticket in the portal.',
      rows: [
        { label: 'Ticket #', value: data.ticketNumber, highlight: true },
        { label: 'Customer', value: data.customerName },
        { label: 'Email', value: data.customerEmail },
        { label: 'Subject', value: data.subject, highlight: true },
      ],
      message: data.message,
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/tickets`,
      actionLabel: 'Reply in Admin',
    }),
  });
}

export async function sendTicketReplyCustomerNotification(data: {
  name: string;
  email: string;
  ticketNumber: string;
  subject: string;
  replyMessage: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: `Green Rock — Update on Ticket ${data.ticketNumber}`,
    html: buildCustomerEmail({
      title: 'Support Reply',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0 0 12px;">Our team replied to your ticket <strong>${data.ticketNumber}</strong> regarding <strong>${data.subject}</strong>:</p>
        <blockquote style="margin:0;padding:12px 16px;background:#f8fafc;border-left:4px solid #0b6e4f;border-radius:8px;">${data.replyMessage.replace(/</g, '&lt;')}</blockquote>
        <p style="margin:16px 0 0;">You can view the full conversation in your <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal/support">customer portal</a>.</p>`,
    }),
  });
}

export async function sendInvoiceCustomerNotification(data: {
  name: string;
  email: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  dueDate?: Date | null;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: `Green Rock — Invoice ${data.invoiceNumber}`,
    html: buildCustomerEmail({
      title: 'New Invoice',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0 0 12px;">An invoice has been issued for you:</p>
        <table role="presentation" style="width:100%;background:#f8fafc;border-radius:12px;padding:16px;margin:16px 0;">
          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Invoice</td><td style="padding:6px 0;font-weight:600;">${data.invoiceNumber}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Description</td><td style="padding:6px 0;">${data.title}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Amount</td><td style="padding:6px 0;font-weight:600;">${data.amount.toLocaleString()} ${data.currency}</td></tr>
          ${data.dueDate ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Due</td><td style="padding:6px 0;">${data.dueDate.toLocaleDateString('en-RW')}</td></tr>` : ''}
        </table>
        <p style="margin:0;">View and download it in your <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal/invoices">customer portal</a>.</p>`,
    }),
  });
}

export async function sendOrderStatusCustomerNotification(data: {
  name: string;
  email: string;
  orderNumber: string;
  status: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: `Green Rock — Order ${data.orderNumber} is now ${data.status}`,
    html: buildCustomerEmail({
      title: 'Order Status Updated',
      greeting: `Dear ${data.name},`,
      body: `<p style="margin:0;">Your material order <strong>${data.orderNumber}</strong> status has been updated to <strong>${data.status.replace(/_/g, ' ')}</strong>. Check your portal for details.</p>`,
    }),
  });
}

export async function sendPaymentAdminNotification(data: {
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  reference: string;
  invoiceNumber?: string;
}): Promise<void> {
  await sendEmail({
    to: getAdminEmail(),
    subject: `[Green Rock] Payment Received — ${data.amount.toLocaleString()} ${data.currency}`,
    replyTo: data.customerEmail,
    html: buildAdminEmail({
      preheader: `Payment from ${data.customerName}`,
      badge: 'Payment',
      badgeColor: '#16a34a',
      title: 'Payment Received',
      intro: 'A customer completed an online payment.',
      rows: [
        { label: 'Customer', value: data.customerName, highlight: true },
        { label: 'Email', value: data.customerEmail },
        { label: 'Amount', value: `${data.amount.toLocaleString()} ${data.currency}`, highlight: true },
        { label: 'Reference', value: data.reference },
        ...(data.invoiceNumber ? [{ label: 'Invoice', value: data.invoiceNumber }] : []),
        { label: 'Received', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/invoices`,
      actionLabel: 'View Invoices',
    }),
  });
}

export async function sendTestEmail(): Promise<void> {
  const adminEmail = getAdminEmail();
  const provider = await getEmailProvider();
  await sendEmail({
    to: adminEmail,
    subject: '[Green Rock] Test Email — Notifications Working',
    html: buildAdminEmail({
      preheader: 'Email notifications are configured correctly',
      badge: 'Test',
      badgeColor: '#0b6e4f',
      title: 'Email Setup Successful',
      intro: `This is a test email from your Green Rock website. Email is sent via ${provider === 'resend' ? 'Resend' : 'Gmail SMTP'}.`,
      rows: [
        { label: 'Sent to', value: adminEmail, highlight: true },
        { label: 'Provider', value: provider === 'resend' ? 'Resend' : 'Gmail SMTP', highlight: true },
        { label: 'From', value: getEmailFrom(provider) },
        { label: 'Time', value: new Date().toLocaleString('en-RW', { dateStyle: 'full', timeStyle: 'short' }) },
      ],
      message: 'You will now receive emails when visitors submit contact forms, book appointments, place orders, open support tickets, subscribe to the newsletter, or apply for jobs.',
    }),
  });
}

/** Await email sends before responding (required on Vercel serverless). */
export async function notifyAll(tasks: { label: string; fn: () => Promise<void> }[]): Promise<void> {
  const results = await Promise.allSettled(tasks.map((t) => t.fn()));
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`[Email] ${tasks[i].label} failed:`, result.reason);
    }
  });
}

/** @deprecated Use notifyAll — fire-and-forget emails are dropped on Vercel serverless */
export function notifyAsync(label: string, fn: () => Promise<void>): void {
  fn().catch((err) => console.error(`[Email] ${label} failed:`, err));
}

