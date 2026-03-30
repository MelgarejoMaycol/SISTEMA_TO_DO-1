# 🚀 Sistema TODO - Modo Demo con localStorage

## Descripción

El proyecto ahora está configurado para funcionar en **dos modos**:

### 1. **Modo Mock (Demo - localStorage)**
- ✅ No requiere backend ejecutándose
- ✅ Usa `localStorage` para guardar datos
- ✅ Perfecto para despliegue en producción sin backend
- ✅ Datos persisten en el navegador

### 2. **Modo Real (Backend API)**
- ✅ Se conecta al backend real (Render o local)
- ✅ Mantiene sincronización con servidor
- ✅ Para desarrollo con backend activo

---

## 🔑 Credenciales de Prueba

**Email:** `prueba@example.com`  
**Contraseña:** `prueba12345678`

Estas credenciales funcionan automáticamente en modo Mock. También puedes crear nuevas cuentas mientras uses localStorage.

---

## 🎛️ Cómo Cambiar de Modo

### Activar Modo Mock (localStorage)

**Opción 1: Archivo `.env.local`**

```bash
# En /frontend/.env.local
REACT_APP_USE_MOCK=true
```

**Opción 2: Variables de entorno**

```bash
cd frontend
REACT_APP_USE_MOCK=true npm start
```

### Desactivar Modo Mock (Usar Backend Real)

```bash
# En /frontend/.env.local
REACT_APP_USE_MOCK=false
# O deja vacío y usa el backend por defecto
```

---

## 📋 Características del Modo Mock

| Feature | Implementado |
|---------|-------------|
| ✅ Login/Registro | Sí |
| ✅ CRUD Tareas | Sí |
| ✅ Categorías | Sí |
| ✅ Estados (Pendiente, En Proceso, Completada) | Sí |
| ✅ Fechas de entrega | Sí |
| ✅ Calendario | Sí |
| ✅ Estadísticas | Sí |
| ✅ Persistencia localStorage | Sí |

---

## 🔄 Migración Backend ↔ Mock

Si en el futuro necesitas cambiar entre modos:

1. **El frontend detecta automáticamente** el modo en tiempo de inicio
2. **La estructura de datos es compatible** en ambos modos
3. **Exportación/importación posterior** de datos es posible

---

## 📁 Estructura de Datos en localStorage

```javascript
// Les datos se guardan en: localStorage.getItem("mockData")
{
  "users": [
    {
      "id": 1,
      "email": "prueba@example.com",
      "nombre": "Usuario Demo",
      "rol": "usuario"
    }
  ],
  "tareas": [
    {
      "id_tarea": 1,
      "titulo": "Mi Tarea",
      "descripcion": "Descripción",
      "estado": "pendiente",
      "fecha_entrega": "2024-12-31",
      "categoria": "trabajo"
    }
  ]
}
```

---

## 🚀 Despliegue en Producción

### Con Modo Mock (Recomendado para MVP)

```bash
cd frontend
REACT_APP_USE_MOCK=true npm run build
```

- Sube el contenido de `/build` a Vercel, Netlify, etc.
- **Sin necesidad de backend ejecutándose**

### Con Backend Real

```bash
cd frontend
REACT_APP_USE_MOCK=false npm run build
```

- Necesitas que el backend esté activo en Render/Heroku/etc.
- Configura `REACT_APP_API_URL` si es diferente

---

## 🐛 Debugging

### Ver si está en modo Mock:
Abre la consola del navegador (F12) y busca el mensaje:
- 🟡 `Modo Mock API (localStorage)` = Modo Mock activo
- 🟢 `Modo Real API` = Conectando con backend

### Limpiar datos de Mock:
```javascript
// En la consola del navegador:
localStorage.removeItem("mockData");
localStorage.removeItem("access_token");
location.reload();
```

---

## 📝 Archivos Modificados

- ✅ `frontend/src/services/api.js` - Agregado soporte para modo mock
- ✅ `frontend/src/services/mockApi.js` - Nuevo servicio mock
- ✅ `frontend/src/pages/login.jsx` - UI para credenciales de prueba
- ✅ `frontend/.env.local` - Configuración local habilitada
- ✅ `frontend/.env.example` - Documentación de variables

---

## 💡 Próximos Pasos

1. **Desarrollo local**: Usa modo Mock para tests rápidos
2. **Con backend**: Desactiva mode Mock cuando el backend esté listo
3. **Producción**: Elige según tus necesidades (MVP con Mock, full con Backend)

---

## ❓ Preguntas Frecuentes

**P: ¿Se pierden datos al refrescar la página?**  
R: No, están guardados en `localStorage` del navegador.

**P: ¿Puedo usar el backend después de empezar en Mock?**  
R: Sí, solo cambia `REACT_APP_USE_MOCK=false` y reinicia.

**P: ¿Qué pasa si cambio de navegador?**  
R: Los datos están por navegador. Cada navegador tiene su propio localStorage.

**P: ¿Cómo migro datos de Mock a Backend?**  
R: Implementaremos exportación en el futuro. Ahora es manual.

---

**Estado:** ✅ Listo para producción en modo Mock  
**Última actualización:** 2024
