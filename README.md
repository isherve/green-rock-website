# Green Rock General Supply Ltd — Corporate Website

A production-ready full-stack corporate website for **Green Rock General Supply Ltd**, featuring real estate, construction, building materials, and professional services.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Shadcn UI |
| Backend | Node.js, Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (+ optional Google OAuth) |
| Storage | Cloudinary |
| Email | Nodemailer |
| Deploy | Docker, Vercel (frontend), Railway/DigitalOcean (backend) |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm

### 1. Clone & Install

```bash
cd green-rock-website
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` with your database URL and secrets.

### 3. Database

```bash
cd backend
npx prisma db push
npm run db:seed
```

### 4. Run Development

```bash
# From root
npm run dev

# Or separately:
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# API Docs: http://localhost:5000/api/docs
```

### 5. Docker (Alternative)

```bash
docker-compose up -d
```

## Default Admin Credentials

- **Email:** admin@greenrock.com
- **Password:** Admin@123456

## Project Structure

```
green-rock-website/
├── frontend/          # Next.js app (public site + admin)
│   ├── src/app/       # App Router pages
│   ├── src/components/# UI components
│   └── src/lib/       # Utils, API, constants
├── backend/           # Express API
│   ├── prisma/        # Schema & seed
│   └── src/routes/    # API routes
├── docker-compose.yml
└── .github/workflows/ # CI/CD
```

## Pages

- **Public:** Home, About, Services, Projects, Properties, Materials, Gallery, Blog, Careers, Testimonials, Contact
- **Admin:** Dashboard, Properties, Projects, Products, Blog, Careers, Gallery, Messages, Users
- **Legal:** Privacy Policy, Terms & Conditions

## API Documentation

Swagger UI available at `/api/docs` when backend is running.

## Deployment

### Frontend (Vercel)
1. Connect repo to Vercel
2. Set root directory to `frontend`
3. Add env vars from `.env.example`

### Backend (Railway / DigitalOcean)
1. Deploy `backend/` directory
2. Set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
3. Run `npx prisma migrate deploy`

## Features

- Luxury corporate design with glassmorphism
- Dark/Light mode
- Multi-language support (EN, FR, RW)
- Advanced property search & filters
- Admin dashboard with full CRUD
- SEO optimized (sitemap, robots, meta tags, Open Graph)
- Responsive design (mobile-first)
- JWT authentication with role-based access
- Rate limiting, Helmet, CORS, input validation
- GitHub Actions CI/CD pipeline

## License

Proprietary — Green Rock General Supply Ltd © 2026
