# Green Rock Platform Architecture

Green Rock General Supply Ltd runs as a **unified enterprise platform** with four portals sharing one backend API and PostgreSQL database.

## Portals

| Portal | URL | Roles | Purpose |
|--------|-----|-------|---------|
| **Public Website** | `/` | Everyone | Marketing, listings, contact, careers |
| **Customer Portal** | `/portal` | `USER` | Saved properties, quotes, orders, support |
| **Employee Portal** | `/employee` | Staff roles | Tasks, attendance, leave, payslips |
| **Admin / ERP** | `/admin` | `ADMIN`, `MANAGER`, `SUPER_ADMIN`, `MANAGING_DIRECTOR` | Full business management |

## Public Website (Complete)

- Home, About, Services, Projects, Properties, Materials, Gallery, Testimonials, Blog, Careers, Contact, FAQ

## Customer Portal

| Feature | Route | API |
|---------|-------|-----|
| Registration | `/portal/register` | `POST /api/auth/register` |
| Login | `/portal/login` | `POST /api/auth/login` |
| Dashboard | `/portal/dashboard` | `GET /api/portal/dashboard` |
| Saved Properties | `/portal/saved-properties` | `GET /api/portal/favorites` |
| Quotes | `/portal/quotes` | `GET /api/portal/inquiries?type=QUOTE` |
| Construction | `/portal/construction-requests` | `GET /api/portal/inquiries?type=CONSTRUCTION` |
| Material Orders | `/portal/material-orders` | `GET/POST /api/portal/material-orders` |
| Appointments | `/portal/appointments` | `GET /api/portal/appointments` |
| Invoices | `/portal/invoices` | `GET /api/portal/invoices` |
| Payments | `/portal/payments` | `GET /api/portal/payments` |
| Support | `/portal/support` | `GET/POST /api/portal/tickets` |
| Documents | `/portal/documents` | `GET /api/portal/documents` |
| Notifications | `/portal/notifications` | `GET /api/portal/notifications` |
| Messages | `/portal/messages` | `GET /api/portal/messages` |
| Profile | `/portal/profile` | `PATCH /api/portal/profile` |

## Employee Portal

| Feature | Route | API |
|---------|-------|-----|
| Login | `/employee/login` | `POST /api/auth/login` |
| Dashboard | `/employee/dashboard` | `GET /api/employee/dashboard` |
| Projects | `/employee/projects` | `GET /api/employee/projects` |
| Tasks | `/employee/tasks` | `GET /api/employee/tasks` |
| Attendance | `/employee/attendance` | `GET/POST /api/employee/attendance/*` |
| Leave | `/employee/leave` | `GET/POST /api/employee/leave` |
| Payslips | `/employee/payslips` | `GET /api/employee/payslips` |
| Messages | `/employee/messages` | `GET /api/employee/messages` |
| Reports | `/employee/reports` | `GET /api/employee/reports/summary` |
| Documents | `/employee/documents` | `GET /api/employee/documents` |

## Admin ERP Modules

Grouped navigation in `/admin` covers:

- **CRM & Sales** — Leads, inquiries, appointments, quotations, contracts
- **Real Estate** — Properties, projects, services
- **Inventory & Supply** — Products, inventory, procurement, fleet
- **Finance** — Accounting, invoices, payments
- **HR** — Employees, payroll, careers, users & roles
- **Marketing & CMS** — Campaigns, blog, gallery, testimonials
- **System** — Settings, audit logs, analytics

## Roles (RBAC)

`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `MANAGING_DIRECTOR`, `FINANCE_MANAGER`, `HR_MANAGER`, `PROJECT_MANAGER`, `SALES_MANAGER`, `REAL_ESTATE_OFFICER`, `PROCUREMENT_OFFICER`, `INVENTORY_MANAGER`, `WAREHOUSE_OFFICER`, `DELIVERY_OFFICER`, `CUSTOMER_SUPPORT`, `MARKETING_OFFICER`, `AGENT`, `EMPLOYEE`, `USER`

## Database Models (Portal Extensions)

`EmployeeProfile`, `Task`, `Attendance`, `LeaveRequest`, `SalarySlip`, `SupportTicket`, `Invoice`, `Payment`, `MaterialOrder`, `Document`, `Notification`, `DirectMessage`, `AuditLog`

## Setup After Schema Changes

```bash
cd backend
npx prisma db push
npm run db:seed
```

## Demo Accounts (after seed)

| Portal | Email | Password | Role |
|--------|-------|----------|------|
| Admin | admin@greenrock.com | Admin@123456 | ADMIN |
| Customer | customer@greenrock.com | Customer@123 | USER |
| Employee | employee@greenrock.com | Employee@123 | EMPLOYEE |

## Stack

Next.js 16 · React · TypeScript · TailwindCSS · Shadcn UI · Express · Prisma · PostgreSQL · JWT · Cloudinary · Swagger · Docker · CI/CD
