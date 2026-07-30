# Deployment Guide — Green Rock Platform

## Architecture

| Layer | Host | Notes |
|-------|------|-------|
| **Frontend** (Next.js) | **Vercel** or **Netlify** | Customer site + portals |
| **Backend** (Express API) | **Render** (recommended) | Needs PostgreSQL |
| **Database** | Render PostgreSQL / Neon / Supabase | Required for live data |
| **Code** | **GitHub** | Source of truth |

Vercel and Netlify host the **frontend only**. The Express API must run on a Node host (Render, Railway, Fly.io).

---

## 1. GitHub

Repository: push to `main` on GitHub. CI runs on every push (`.github/workflows/ci.yml`).

---

## 2. Vercel (Frontend — recommended)

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. **Root Directory:** `frontend`
3. Environment variables:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-APP.vercel.app` |

4. Deploy

---

## 3. Netlify (Frontend — alternative)

1. [app.netlify.com/start](https://app.netlify.com/start) → Import repo
2. **Base directory:** `frontend`
3. Build: `npm ci && npm run build` (see `netlify.toml`)
4. Same env vars as Vercel

---

## 4. Render (Backend API + Database)

1. [dashboard.render.com](https://dashboard.render.com) → **New Blueprint**
2. Connect repo — uses `render.yaml`
3. Set `FRONTEND_URL`, `SMTP_PASS`, and other secrets in dashboard
4. API health: `https://YOUR-SERVICE.onrender.com/health`

Then update frontend `NEXT_PUBLIC_API_URL` to your Render API URL.

---

## Demo accounts (after seed)

| Portal | Email | Password |
|--------|-------|----------|
| Admin | admin@greenrock.com | Admin@123456 |
| Customer | customer@greenrock.com | Customer@123 |
| Employee | employee@greenrock.com | Employee@123 |
