# Green Rock — Vercel one-shot setup (run after linking repo in dashboard)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Green Rock Vercel Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. In Vercel dashboard for project 'frontend':" -ForegroundColor Yellow
Write-Host "   Settings -> Build and Deployment -> Root Directory = frontend"
Write-Host "   Storage -> Create Database -> Postgres"
Write-Host "   Settings -> Environment Variables (use backend npm run env:generate)"
Write-Host ""
Write-Host "2. Redeploy from Deployments tab"
Write-Host ""
Write-Host "3. Generate env secrets:" -ForegroundColor Yellow
Push-Location (Join-Path $Root "backend")
npm run env:generate
Pop-Location
Write-Host ""
Write-Host "4. After deploy succeeds, seed production (replace URL and secret):" -ForegroundColor Yellow
Write-Host '   curl -X POST https://YOUR-PROJECT.vercel.app/api/setup/seed -H "x-setup-secret: YOUR_SETUP_SECRET"'
Write-Host ""
Write-Host "5. Verify:" -ForegroundColor Yellow
Write-Host "   https://YOUR-PROJECT.vercel.app/health"
Write-Host "   https://YOUR-PROJECT.vercel.app/admin/login"
Write-Host "   admin@greenrock.com / Admin@123456"
Write-Host ""

if (Get-Command vercel -ErrorAction SilentlyContinue) {
  Write-Host "Deploying via Vercel CLI..." -ForegroundColor Green
  Push-Location (Join-Path $Root "frontend")
  vercel deploy --prod
  Pop-Location
} else {
  Write-Host "Vercel CLI not installed. Push to GitHub main to trigger auto-deploy." -ForegroundColor Gray
  Write-Host "   git push origin main"
}
