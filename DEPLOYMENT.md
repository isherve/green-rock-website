# Deployment Guide — Vercel (All-in-One)

Everything runs on **one Vercel project**: Next.js frontend, Express API (serverless), and PostgreSQL (Vercel Postgres or Neon).

Repository: https://github.com/isherve/green-rock-website

---

## Architecture

| Component | Where it runs |
|-----------|----------------|
| Website + portals (Next.js) | Vercel |
| REST API (Express) | Vercel serverless (`frontend/api/server.ts`) |
| PostgreSQL | Vercel Postgres **or** Neon (linked in Vercel) |
| File uploads | Cloudinary (required on Vercel) |

API routes are served at **`/api/*`** on the same domain as the site — no separate backend host.

---

## 1. Create Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) → Import **green-rock-website**
2. **Root Directory:** leave **empty** (repo root — required so `backend/` is included in the build)
3. Framework: Next.js (uses root `vercel.json`)
4. Deploy once (will fail or use mocks until `DATABASE_URL` is set)

---

## 2. Add PostgreSQL

**Option A — Vercel Postgres (recommended)**

1. Vercel project → **Storage** → **Create Database** → Postgres
2. Connect to project — Vercel sets `DATABASE_URL` automatically

**Option B — Neon**

1. [neon.tech](https://neon.tech) → create project
2. Vercel → **Integrations** → Neon → link repo
3. `DATABASE_URL` is injected into the project

After the database exists, redeploy so the build runs `prisma db push`.

---

## 3. Environment variables

Set in **Vercel → Project → Settings → Environment Variables**:

| Variable | Required | Example / notes |
|----------|----------|-------------------|
| `DATABASE_URL` | Yes | Auto from Vercel Postgres / Neon |
| `JWT_SECRET` | Yes | Random 32+ char string |
| `JWT_REFRESH_SECRET` | Yes | Random 32+ char string |
| `ADMIN_EMAIL` | Yes | `ishimwehervin10@gmail.com` |
| `RESEND_API_KEY` | For email (recommended) | From [resend.com/api-keys](https://resend.com/api-keys) |
| `SMTP_USER` | For email (fallback) | Gmail address |
| `SMTP_PASS` | For email (fallback) | Gmail App Password |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary dashboard |
| `NEXT_PUBLIC_SITE_URL` | Recommended | `https://your-app.vercel.app` |
| `FRONTEND_URL` | Recommended | Same as site URL (CORS) |
| `SETUP_SECRET` | Recommended | One-time seed via `POST /api/setup/seed` |
| `EMAIL_FROM` | For email | Custom from address after verifying domain on Resend |
| `SMTP_HOST` | For email (fallback) | `smtp.gmail.com` |
| `SMTP_PORT` | For email (fallback) | `587` |
| `SMTP_USER` | For email (fallback) | Gmail address |
| `SMTP_PASS` | For email (fallback) | Gmail App Password ([create here](https://myaccount.google.com/apppasswords)) |
| `MOMO_MERCHANT_CODE` | For MoMo pay | e.g. `785652011` (manual payment instructions) |
| `FLUTTERWAVE_PUBLIC_KEY` | Optional | Card payments via Flutterwave |
| `FLUTTERWAVE_SECRET_KEY` | Optional | Card payments webhook |

**Optional:** `NEXT_PUBLIC_API_URL` — leave unset to auto-use `https://<your-domain>/api` on Vercel.

---

## 4. Seed the database (once)

**Option A — HTTP (easiest on Vercel)**

After deploy, with `SETUP_SECRET` set in env vars:

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/setup/seed \
  -H "x-setup-secret: YOUR_SETUP_SECRET"
```

Check status: `GET https://YOUR-PROJECT.vercel.app/api/setup/status`

**Option B — Local CLI**

```bash
cd backend
npm ci
npx prisma db push
npm run db:seed
```

Generate env secrets locally: `npm run env:generate` (in `backend/`).

---

## 5. Verify deployment

| Check | URL |
|-------|-----|
| Website | `https://YOUR-APP.vercel.app` |
| API health | `https://YOUR-APP.vercel.app/health` |
| API docs | `https://YOUR-APP.vercel.app/api/docs` |
| Admin | `https://YOUR-APP.vercel.app/admin/login` |

---

## Demo accounts (after seed)

| Portal | Email | Password |
|--------|-------|----------|
| Admin | admin@greenrock.com | Admin@123456 |
| Customer | customer@greenrock.com | Customer@123 |
| Employee | employee@greenrock.com | Employee@123 |

---

## Local development

Still uses separate processes (unchanged):

```powershell
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/api  

---

## How it works

- `backend/src/app.ts` — Express app (shared)
- `api/server.ts` — Vercel serverless entry (repo root)
- `frontend/vercel.json` — rewrites `/api/*` → serverless function
- Build: compiles backend, runs `prisma db push`, then `next build`

Pushes to `main` auto-deploy on Vercel when the GitHub integration is connected.
