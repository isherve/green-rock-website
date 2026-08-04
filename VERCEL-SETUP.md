# Green Rock — Vercel setup (do this once)

Your site is **not live yet** because the Vercel project was pointing at the wrong folder.

## Fix in 3 minutes

### Step 1 — Use the right Vercel project
Open: https://vercel.com/isherves-projects/green-rock-website/settings

- **Root Directory:** leave **blank**
- **Framework Preset:** Other (or Services if shown)
- **Save**

### Step 2 — Add database
Project → **Storage** → **Create Database** → **Postgres** → Connect

### Step 3 — Environment variables
Project → **Settings** → **Environment Variables**

Run locally to generate secrets:
```powershell
cd backend
npm run env:generate
```
Copy every line into Vercel. Also set:
- `FRONTEND_URL` = `https://green-rock-website.vercel.app`
- `NEXT_PUBLIC_SITE_URL` = same URL

### Step 4 — Redeploy
**Deployments** → **Redeploy** (or push to GitHub — auto-deploys)

### Step 5 — Seed database
After deploy succeeds:
```powershell
curl -X POST https://green-rock-website.vercel.app/api/setup/seed -H "x-setup-secret: YOUR_SETUP_SECRET"
```

### Step 6 — Log in
https://green-rock-website.vercel.app/admin/login  
**admin@greenrock.com** / **Admin@123456**

---

## Verify
| URL | Expected |
|-----|----------|
| `/` | Green Rock homepage |
| `/health` | JSON with `"database": { "status": "connected" }` |
| `/admin/login` | Green Rock admin login |

## "Network Error" on login?
Usually means **no database**. Check https://green-rock-website.vercel.app/health — if `"database": { "status": "missing" }`, complete **Step 2** (Postgres) and **Step 3** (env vars), redeploy, then seed.

## Still stuck?
Reply with a screenshot of **Deployments** (latest build log) and I will fix the next error.
