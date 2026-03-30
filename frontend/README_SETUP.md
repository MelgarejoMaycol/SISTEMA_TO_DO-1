# 📱 Frontend - Sistema TODO

## 🚀 Inicio Rápido

### Modo Demo (Sin Backend - Recomendado para Pruebas)

```bash
# 1. Instalar dependencias
npm install

# 2. Inicia el desarrollo
npm start
```

**Credenciales automáticas:**
- 📧 Email: `prueba@example.com`
- 🔐 Contraseña: `prueba12345678`

> El archivo `.env.local` ya está configurado con `REACT_APP_USE_MOCK=true`

---

## 🔄 Cambiar a Backend Real

Si tienes el backend corriendo en `localhost:8000`:

```bash
# Edita .env.local
REACT_APP_USE_MOCK=false
REACT_APP_API_URL=http://localhost:8000/api
```

Luego reinicia: `npm start`

---

## 📦 Scripts Disponibles

```bash
npm start              # Inicia dev server
npm build              # Crea versión production
npm test               # Ejecuta tests
npm eject              # ⚠️ No reversible
```

---

## 🎨 Tecnologías

- **React 18** - UI framework
- **Tailwind CSS** - Estilos
- **Axios** - HTTP client
- **React Router** - Navegación
- **localStorage** - Persistencia en Mock API

---

## 📂 Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
├── pages/            # Páginas (Login, Dashboard)
├── services/         # Servicios API
│   ├── api.js        # API real
│   └── mockApi.js    # API mock (localStorage)
└── index.js          # Entry point
```

---

## 🐛 Tips para Debugging

### Ver modo actual:
Abre la consola (F12) y busca:
- 🟡 "Modo Mock API (localStorage)"
- 🟢 "Modo Real API"

### Limpiar datos:
```javascript
// En la consola del navegador
localStorage.clear();
```

---

## ✨ Funcionalidades

- ✅ Autenticación con credenciales
- ✅ CRUD de tareas
- ✅ Categorizar tareas
- ✅ Cambiar estado de tareas
- ✅ Calendario de tareas
- ✅ Estadísticas
- ✅ Respuesta móvil

---

Para más detalles, ve a: [MOCK_API_GUIDE.md](../MOCK_API_GUIDE.md)
