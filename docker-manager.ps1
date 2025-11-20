# Script para gestionar el proyecto Docker
# Sistema TO-DO - Gestión de Contenedores

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('up', 'down', 'build', 'test', 'logs', 'migrate', 'shell', 'clean', 'status')]
    [string]$Command = 'status'
)

Write-Host "=== Sistema TO-DO - Docker Manager ===" -ForegroundColor Cyan
Write-Host ""

switch ($Command) {
    'up' {
        Write-Host "Iniciando servicios..." -ForegroundColor Green
        docker-compose up -d
        Write-Host ""
        Write-Host "Servicios iniciados:" -ForegroundColor Green
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
        Write-Host "  Database: localhost:5432" -ForegroundColor Yellow
    }
    'down' {
        Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
        docker-compose down
    }
    'build' {
        Write-Host "Construyendo imágenes..." -ForegroundColor Green
        docker-compose build --no-cache
    }
    'test' {
        Write-Host "Ejecutando pruebas..." -ForegroundColor Magenta
        docker-compose --profile testing run --rm tests
    }
    'logs' {
        Write-Host "Mostrando logs..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    'migrate' {
        Write-Host "Ejecutando migraciones..." -ForegroundColor Green
        docker-compose exec backend python manage.py migrate
    }
    'shell' {
        Write-Host "Accediendo al shell de Django..." -ForegroundColor Green
        docker-compose exec backend python manage.py shell
    }
    'clean' {
        Write-Host "Limpiando contenedores y volúmenes..." -ForegroundColor Red
        $confirm = Read-Host "¿Estás seguro? Esto eliminará todos los datos (S/N)"
        if ($confirm -eq 'S' -or $confirm -eq 's') {
            docker-compose down -v
            docker system prune -f
            Write-Host "Limpieza completada" -ForegroundColor Green
        } else {
            Write-Host "Operación cancelada" -ForegroundColor Yellow
        }
    }
    'status' {
        Write-Host "Estado de los servicios:" -ForegroundColor Cyan
        docker-compose ps
    }
}

Write-Host ""
