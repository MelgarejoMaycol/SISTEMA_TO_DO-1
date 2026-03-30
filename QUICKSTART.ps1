# Quick Start - Sistema TODO (Windows)

Write-Host "🚀 SISTEMA TODO - INICIO RÁPIDO (Windows)" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Opciones disponibles:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  MODO DEMO (localStorage - SIN BACKEND)" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host "   Credenciales: prueba@example.com / prueba12345678" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  MODO REAL (con Backend)" -ForegroundColor Yellow
Write-Host "   Terminal 1:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   python manage.py runserver" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   Edita .env.local:" -ForegroundColor Gray
Write-Host "   REACT_APP_USE_MOCK=false" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  DESPLIEGUE PRODUCCIÓN (Demo sin backend)" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   `$env:REACT_APP_USE_MOCK='true'; npm run build" -ForegroundColor White
Write-Host "   Sube /build a Vercel o Netlify" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 Documentación:" -ForegroundColor Cyan
Write-Host "   - MOCK_API_GUIDE.md (Detalles técnicos)" -ForegroundColor Gray
Write-Host "   - frontend/README_SETUP.md (Quick start)" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Sistema listo. ¡Comienza con la Opción 1!" -ForegroundColor Green
