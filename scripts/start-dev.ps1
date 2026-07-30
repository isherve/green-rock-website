$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

function Stop-Port($port) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
}

Write-Host "Starting Green Rock dev servers..." -ForegroundColor Cyan

Stop-Port 5000
Stop-Port 3000
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backend'; npx tsx src/index.ts" -WindowStyle Normal
Start-Sleep -Seconds 4
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "  Website:  http://localhost:3000" -ForegroundColor Green
Write-Host "  Admin:    http://localhost:3000/admin/login" -ForegroundColor Green
Write-Host "  API:      http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "  Admin login: admin@greenrock.com / Admin@123456" -ForegroundColor Yellow
Write-Host "  Two PowerShell windows opened (backend + frontend)." -ForegroundColor Gray
