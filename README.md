# 📋 Sistema de Gestión de Tareas

![CI/CD Pipeline](https://github.com/MelgarejoMaycol/SISTEMA_TO_DO-1/workflows/CI%2FCD%20Pipeline%20-%20Sistema%20TO%20DO/badge.svg)

Sistema completo de gestión de tareas con backend Django REST Framework y frontend React, incluyendo CI/CD con pruebas automáticas.

## 🚀 Características

- ✅ **Backend Django REST Framework** - API RESTful completa
- ✅ **Frontend React** - Interfaz moderna y responsive
- ✅ **Autenticación JWT** - Sistema de autenticación seguro
- ✅ **Docker** - Contenedorización completa con PostgreSQL local
- ✅ **CI/CD** - Integración y despliegue continuo con GitHub Actions
- ✅ **Pruebas Automáticas** - Backend y Frontend testeados
- ✅ **PostgreSQL** - Base de datos robusta

## 🏗️ Arquitectura Docker

```
┌─────────────────────────────────────────────────┐
│              Docker Compose                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │ Frontend │◄───┤ Backend  │◄───┤   DB     │ │
│  │  React   │    │  Django  │    │PostgreSQL│ │
│  │  :3000   │    │  :8000   │    │  :5432   │ │
│  └──────────┘    └──────────┘    └──────────┘ │
│                        ▲                        │
│                        │                        │
│                  ┌──────────┐                   │
│                  │  Tests   │                   │
│                  │  (pytest)│                   │
│                  └──────────┘                   │
└─────────────────────────────────────────────────┘
```

## 📦 Tecnologías

### Backend
- Python 3.10+
- Django 4.x
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- Jest & React Testing Library

### DevOps
- Docker & Docker Compose
- GitHub Actions
- Codecov (Coverage reporting)

## 🛠️ Instalación

### Con Docker (Recomendado) 🐳

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/SISTEMA_TO_DO.git
cd SISTEMA_TO_DO

# Iniciar todos los servicios (API + DB + Frontend)
docker-compose up --build

# O usar el script helper de PowerShell
.\docker-manager.ps1 up
```

### Ejecutar Pruebas con Docker

```bash
# Ejecutar todas las pruebas
docker-compose --profile testing run --rm tests

# O usar el script helper
.\docker-manager.ps1 test
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Base de datos PostgreSQL: localhost:5432
- API Docs: http://localhost:8000/api/

**Comandos útiles:**
```bash
# Ver estado de los servicios
.\docker-manager.ps1 status

# Ver logs
.\docker-manager.ps1 logs

# Ejecutar migraciones
.\docker-manager.ps1 migrate

# Detener servicios
.\docker-manager.ps1 down
```

📖 **Ver [DOCKER_README.md](DOCKER_README.md) para más detalles**

### Sin Docker

#### Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

#### Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

## 🧪 Pruebas

### Backend
```bash
cd backend

# Ejecutar todas las pruebas
python manage.py test

# Ejecutar pruebas con coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report

# Ejecutar pruebas de una app específica
python manage.py test tareas
python manage.py test usuarios
```

### Frontend
```bash
cd frontend

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm test -- --coverage --watchAll=false

# Ejecutar pruebas en modo watch
npm test -- --watch
```

## 📊 Cobertura de Pruebas

### Backend
- ✅ Modelos de Tareas (4 tests)
- ✅ API de Tareas CRUD (7 tests)
- ✅ Autenticación y permisos
- ✅ Estadísticas de tareas

### Frontend
- ✅ Componentes principales (App, Modales)
- ✅ Interacciones de usuario
- ✅ Formularios y validaciones

## 📚 Documentación

- [Configuración de CI/CD](./GUIA_GITHUB_CICD.md) - Guía completa para configurar GitHub Actions
- [CI/CD README](./CI_CD_README.md) - Documentación detallada del pipeline
- [Docker README](./DOCKER_README.md) - Guía de Docker

## 🔄 CI/CD Pipeline

El proyecto incluye un pipeline completo de CI/CD que se ejecuta automáticamente:

### En cada Push/PR:
1. **Test Backend**: Ejecuta pruebas en Python 3.10 y 3.11
2. **Test Frontend**: Ejecuta pruebas en Node.js 18.x y 20.x
3. **Build Docker**: Construye imágenes Docker
4. **Security Scan**: Escanea vulnerabilidades
5. **Coverage Report**: Genera reportes de cobertura

### Ver estado del pipeline:
1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow más reciente
3. Revisa los resultados de cada job

## 🗂️ Estructura del Proyecto

```
SISTEMA_TO_DO/
├── .github/
│   └── workflows/
│       └── ci.yml              # Configuración CI/CD
├── backend/
│   ├── tareas/                 # App de tareas
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── tests.py            # 11 pruebas
│   ├── usuarios/               # App de usuarios
│   │   ├── models.py
│   │   ├── views.py
│   │   └── tests.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ModalEditarTarea.jsx
│   │   │   ├── ModalEditarTarea.test.jsx
│   │   │   ├── ModalCrearTarea.jsx
│   │   │   └── ModalCrearTarea.test.jsx
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.test.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🎯 API Endpoints

### Autenticación
- `POST /api/auth/register/` - Registrar usuario
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión

### Tareas
- `GET /api/tareas/` - Listar tareas
- `POST /api/tareas/` - Crear tarea
- `GET /api/tareas/{id}/` - Obtener tarea
- `PUT /api/tareas/{id}/` - Actualizar tarea
- `DELETE /api/tareas/{id}/` - Eliminar tarea
- `GET /api/tareas/estadisticas/` - Estadísticas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Nota**: Todas las pruebas deben pasar antes de hacer merge.

## 📝 Desarrollo

### Agregar nuevas funcionalidades

1. **Escribe las pruebas primero** (TDD)
2. Implementa la funcionalidad
3. Asegúrate de que todas las pruebas pasen
4. Haz commit y push
5. El CI/CD verificará automáticamente tu código

### Convenciones de commits

```
feat: Nueva funcionalidad
fix: Corrección de bugs
test: Agregar o actualizar pruebas
docs: Actualizar documentación
refactor: Refactorización de código
style: Cambios de formato
```

## 🐛 Reporte de Bugs

Si encuentras un bug:
1. Verifica que no esté ya reportado en Issues
2. Crea un nuevo Issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autores

- **Camila Ojeda**
- **Maycol Melgarejo** - [MelgarejoMaycol](https://github.com/MelgarejoMaycol)

🔗 **Repositorio**: [SISTEMA_TO_DO-1](https://github.com/MelgarejoMaycol/SISTEMA_TO_DO-1)

## 🙏 Agradecimientos

- Django REST Framework
- React Team
- GitHub Actions
- Toda la comunidad de código abierto

---

**¿Necesitas ayuda?** Revisa la [Guía de CI/CD](./GUIA_GITHUB_CICD.md) o abre un Issue.
