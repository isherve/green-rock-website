# Green Rock Platform Architecture

Green Rock General Supply Ltd runs as a **unified business platform** with three portals sharing one backend API and PostgreSQL database.

## Portals

| Portal | URL | Roles | Purpose |
|--------|-----|-------|---------|
| **Public Website** | `/` | Everyone | Marketing, listings, contact, careers, search |
| **Customer Portal** | `/portal` | `USER` | Saved properties, quotes, orders, support, invoices, payments |
| **Admin** | `/admin` | `ADMIN`, `MANAGER`, `SUPER_ADMIN`, `MANAGING_DIRECTOR` | CMS, leads, operations, finance |

## Public Website

- Home, About, Services, Projects, Properties, Materials, Gallery, Testimonials, Blog, Careers, Contact, FAQ
- Global search at `/search`
- Property inquiries tied to listings; mortgage estimator on properties pages
- WhatsApp lead capture on property pages

## Customer Portal

| Feature | Route | API |
|---------|-------|-----|
| Registration | `/portal/register` | `POST /api/auth/register` |
| Login | `/portal/login` | `POST /api/auth/login` |
| Dashboard | `/portal/dashboard` | `GET /api/portal/dashboard` |
| Saved Properties | `/portal/saved-properties` | `GET /api/portal/favorites` |
| Material Orders | `/portal/material-orders` | `GET/POST /api/portal/material-orders` |
| Invoices + Pay | `/portal/invoices` | `GET /api/portal/invoices`, `POST /api/payments/initiate` |
| Payments | `/portal/payments` | `GET /api/portal/payments` |
| Support | `/portal/support` | `GET/POST /api/portal/tickets` |
| Documents | `/portal/documents` | `GET /api/portal/documents` |
| Profile | `/portal/profile` | `PATCH /api/portal/profile` |

## Admin (Operations + CMS)

**Sales & Operations:** Leads & Inquiries, Material Orders, Support Tickets, Appointments, Invoices, Documents

**Content:** Properties, Projects, Services, Products, Blog, Gallery, Careers, Users, Newsletter

**Key workflows:**
- Convert quote/lead → invoice (one click)
- Assign staff to leads
- Record payments / customer MoMo-card initiation
- Share documents with customers
- Email + in-app notifications on orders, tickets, invoices

## Payment Integration

Set in backend environment:
- `FLUTTERWAVE_PUBLIC_KEY` / `FLUTTERWAVE_SECRET_KEY` for card payments
- `MOMO_MERCHANT_CODE` for MoMo instructions (fallback manual flow)
- Webhook: `POST /api/payments/webhook/flutterwave`

## Email

Configure `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`, `FRONTEND_URL` in backend `.env`.

## Demo Accounts (after seed)

| Portal | Email | Password |
|--------|-------|----------|
| Admin | admin@greenrock.com | Admin@123456 |
| Customer | customer@greenrock.com | Customer@123 |

Production admin: `ishimwehervin10@gmail.com`

## Stack

Next.js 16 · React · TypeScript · TailwindCSS · Express · Prisma · PostgreSQL · JWT · Cloudinary · Vercel

## Roadmap note

Full ERP modules (payroll, fleet, GL accounting) are **deferred** until the business requires them. The current system targets website + CRM-lite + customer portal + invoicing.
