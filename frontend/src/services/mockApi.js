// localStorage Mock API - Para desarrollo y despliegue sin backend

// Usuario de prueba
const DEMO_USER = {
  id: 1,
  email: "prueba@example.com",
  password: "prueba12345678",
  nombre: "Usuario Demo",
  rol: "usuario",
  access: "demo_token_12345",
  refresh: "demo_refresh_token",
};

// Inicializar datos mock en localStorage
const initializeMockData = () => {
  const mockData = localStorage.getItem("mockData");
  if (!mockData) {
    localStorage.setItem(
      "mockData",
      JSON.stringify({
        users: [DEMO_USER],
        tareas: [],
        completadas: [],
      })
    );
  }
};

// ✅ Mock: Registrar usuario
export const mockRegisterUser = async (payload) => {
  initializeMockData();
  
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  
  // Verificar si el email ya existe
  if (mockData.users.some(u => u.email === payload.email)) {
    throw {
      response: {
        status: 400,
        data: { detail: "El email ya está registrado" }
      }
    };
  }

  const newUser = {
    id: mockData.users.length + 1,
    email: payload.email,
    password: payload.password,
    nombre: payload.nombre || "Nuevo Usuario",
    rol: "usuario",
    access: `demo_token_${Date.now()}`,
    refresh: `demo_refresh_${Date.now()}`,
  };

  mockData.users.push(newUser);
  localStorage.setItem("mockData", JSON.stringify(mockData));

  return {
    access: newUser.access,
    refresh: newUser.refresh,
    email: newUser.email,
    nombre: newUser.nombre,
    rol: newUser.rol,
  };
};

// ✅ Mock: Login usuario
export const mockLoginUser = async (payload) => {
  initializeMockData();
  
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  
  const user = mockData.users.find(
    u => u.email === payload.email && u.password === payload.password
  );

  if (!user) {
    throw {
      response: {
        status: 401,
        data: { detail: "Credenciales inválidas" }
      }
    };
  }

  return {
    access: user.access,
    refresh: user.refresh,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  };
};

// ✅ Mock: Obtener perfil con token
export const mockFetchProfile = async (accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  
  // En mock, todos los tokens válidos devuelven el usuario demo
  const user = mockData.users[0];
  if (!user) throw new Error("Usuario no encontrado");

  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  };
};

// ========== Mock APIs de Tareas ==========

// ✅ Mock: Obtener todas las tareas del usuario
export const mockGetTareas = async (accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  return mockData.tareas || [];
};

// ✅ Mock: Crear una nueva tarea
export const mockCreateTarea = async (tareaData, accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));

  const newTarea = {
    id_tarea: (mockData.tareas?.length || 0) + 1,
    ...tareaData,
    fecha_creacion: new Date().toISOString(),
  };

  if (!mockData.tareas) mockData.tareas = [];
  mockData.tareas.push(newTarea);
  localStorage.setItem("mockData", JSON.stringify(mockData));

  return newTarea;
};

// ✅ Mock: Actualizar una tarea
export const mockUpdateTarea = async (tareaId, tareaData, accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));

  const index = mockData.tareas?.findIndex(t => t.id_tarea === tareaId);
  if (index === -1 || index === undefined) {
    throw {
      response: {
        status: 404,
        data: { detail: "Tarea no encontrada" }
      }
    };
  }

  mockData.tareas[index] = { ...mockData.tareas[index], ...tareaData };
  localStorage.setItem("mockData", JSON.stringify(mockData));

  return mockData.tareas[index];
};

// ✅ Mock: Eliminar una tarea
export const mockDeleteTarea = async (tareaId, accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));

  const index = mockData.tareas?.findIndex(t => t.id_tarea === tareaId);
  if (index === -1 || index === undefined) {
    throw {
      response: {
        status: 404,
        data: { detail: "Tarea no encontrada" }
      }
    };
  }

  mockData.tareas.splice(index, 1);
  localStorage.setItem("mockData", JSON.stringify(mockData));

  return { success: true };
};

// ✅ Mock: Obtener tareas para calendario (rango de fechas)
export const mockGetTareasCalendario = async (accessToken, fechaInicio, fechaFin) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  
  // Filtrar tareas por rango de fechas
  return (mockData.tareas || []).filter(tarea => {
    if (!tarea.fecha_entrega) return false;
    const fecha = new Date(tarea.fecha_entrega);
    return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
  });
};

// ✅ Mock: Obtener instancias de tareas para una fecha específica
export const mockGetInstanciasPorFecha = async (accessToken, fecha) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  
  return (mockData.tareas || []).filter(tarea => {
    if (!tarea.fecha_entrega) return false;
    return tarea.fecha_entrega === fecha;
  });
};

// ✅ Mock: Obtener estadísticas de tareas
export const mockGetTareasEstadisticas = async (accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));
  const tareas = mockData.tareas || [];

  return {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === "pendiente").length,
    en_proceso: tareas.filter(t => t.estado === "en_proceso").length,
    completadas: tareas.filter(t => t.estado === "completada").length,
    hoy: tareas.filter(t => t.fecha_entrega === new Date().toISOString().split('T')[0]).length,
  };
};

// ✅ Mock: Marcar tarea como completada
export const mockMarkTareaCompleted = async (tareaId, accessToken) => {
  initializeMockData();
  const mockData = JSON.parse(localStorage.getItem("mockData"));

  const tarea = mockData.tareas?.find(t => t.id_tarea === tareaId);
  if (!tarea) {
    throw {
      response: {
        status: 404,
        data: { detail: "Tarea no encontrada" }
      }
    };
  }

  tarea.estado = "completada";
  localStorage.setItem("mockData", JSON.stringify(mockData));

  return tarea;
};
