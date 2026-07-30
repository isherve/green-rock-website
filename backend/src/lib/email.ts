import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';
import {
  buildAdminEmail,
  buildCustomerEmail,
  getAdminEmail,
  INQUIRY_TYPE_LABELS,
  inquiryBadgeColor,
} from './email-templates';
import { isEmailConfigured } from './email-config';

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

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!isEmailConfigured()) {
    const msg = `[Email] NOT SENT — SMTP_USER/SMTP_PASS missing in backend/.env. Would send "${options.subject}" → ${options.to}`;
    console.error(msg);
    if (process.env.NODE_ENV === 'production') {
      throw new AppError('Email service is not configured', 503);
    }
    return;
  }

  try {
    await createTransporter().sendMail({
      from: `"Green Rock" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
    console.log(`[Email] Sent: "${options.subject}" → ${options.to}`);
  } catch (err) {
    console.error('[Email] Failed to send:', options.subject, err);
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
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/messages`,
      actionLabel: 'Open Messages',
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
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/messages`,
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
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/messages`,
      actionLabel: 'Manage Bookings',
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
      actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/careers`,
      actionLabel: 'View Careers',
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

