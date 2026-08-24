# Green Rock — Resend email setup helper
# Usage:
#   .\scripts\setup-resend.ps1                    # opens signup + shows admin URL
#   .\scripts\setup-resend.ps1 -ApiKey re_xxxxx   # also adds to Vercel production env

param(
  [string]$ApiKey = ""
)

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "`nGreen Rock — Resend Email Setup" -ForegroundColor Cyan
Write-Host "================================`n"

Write-Host "Step 1: Create free account → https://resend.com/signup"
Write-Host "Step 2: Create API key     → https://resend.com/api-keys"
Write-Host "Step 3: Admin Settings     → https://green-rock-website.vercel.app/admin/settings"
Write-Host "        Paste key and click 'Save & Send Test Email'`n"

Start-Process "https://resend.com/signup"
Start-Sleep -Seconds 1
Start-Process "https://resend.com/api-keys"

if ($ApiKey) {
  if (-not $ApiKey.StartsWith("re_")) {
    Write-Host "Invalid API key — must start with re_" -ForegroundColor Red
    exit 1
  }
  Write-Host "Adding RESEND_API_KEY to Vercel production..." -ForegroundColor Yellow
  $ApiKey | npx vercel env add RESEND_API_KEY production
  Write-Host "Redeploying..." -ForegroundColor Yellow
  npx vercel --prod --yes
  Write-Host "Done. Test at /admin/settings" -ForegroundColor Green
} else {
  Write-Host "Tip: run with -ApiKey re_xxxxx to also set Vercel env var" -ForegroundColor DarkGray
}
