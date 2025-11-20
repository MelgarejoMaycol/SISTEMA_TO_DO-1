import axios from "axios";

const DEFAULT_BASE_URL = "https://api-proyecto-mzbi.onrender.com/api";
const rawBaseUrl = process.env.REACT_APP_API_URL || DEFAULT_BASE_URL;
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, "");
const apiBaseUrl = normalizedBaseUrl.replace(/\/(usuarios|tareas)$/, "");

const usuariosBaseUrl = `${apiBaseUrl}/usuarios`;
const tareasBaseUrl = `${apiBaseUrl}/tareas`;

const axiosInstance = axios.create({
  baseURL: usuariosBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const authHeaders = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const authJsonHeaders = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});

// ✅ Registrar usuario
export const registerUser = async (payload) => {
  const resp = await axiosInstance.post("/register/", payload);
  return resp.data;
};

// ✅ Login usuario (devuelve token JWT)
export const loginUser = async (payload) => {
  const resp = await axiosInstance.post("/login/", payload);
  return resp.data;
};

// ✅ Obtener perfil con token (opcional)
export const fetchProfile = async (accessToken) => {
  const resp = await axios.get(`${usuariosBaseUrl}/me/`, authHeaders(accessToken));
  return resp.data;
};

// ========== APIs de Tareas ==========

// Obtener estadísticas de tareas
export const getTareasEstadisticas = async (accessToken) => {
  const resp = await axios.get(`${tareasBaseUrl}/estadisticas/`, authHeaders(accessToken));
  return resp.data;
};

// Obtener todas las tareas del usuario
export const getTareas = async (accessToken) => {
  const resp = await axios.get(`${tareasBaseUrl}/`, authHeaders(accessToken));
  return resp.data;
};

// Crear una nueva tarea
export const createTarea = async (tareaData, accessToken) => {
  const resp = await axios.post(`${tareasBaseUrl}/`, tareaData, authJsonHeaders(accessToken));
  return resp.data;
};

// Actualizar una tarea
export const updateTarea = async (accessToken, idTarea, tareaData) => {
  const resp = await axios.put(`${tareasBaseUrl}/${idTarea}/`, tareaData, authJsonHeaders(accessToken));
  return resp.data;
};

// Eliminar una tarea
export const deleteTarea = async (accessToken, idTarea) => {
  const resp = await axios.delete(`${tareasBaseUrl}/${idTarea}/`, authHeaders(accessToken));
  return resp.data;
};

// ========== APIs de Ocurrencias (tareas recurrentes simuladas) ==========

// Obtener tareas para calendario (rango de fechas)
export const getTareasCalendario = async (accessToken, fechaInicio, fechaFin) => {
  const resp = await axios.get(`${tareasBaseUrl}/calendario/`, {
    params: {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    },
    ...authHeaders(accessToken),
  });
  return resp.data;
};

// Obtener instancias de tareas para una fecha específica
export const getInstanciasPorFecha = async (accessToken, fecha) => {
  const resp = await axios.get(`${tareasBaseUrl}/ocurrencias_por_fecha/`, {
    params: { fecha },
    ...authHeaders(accessToken),
  });
  return resp.data;
};

// Obtener instancias en un rango de fechas
export const getInstanciasRangoFechas = async (accessToken, fechaInicio, fechaFin) => {
  const resp = await axios.get(`${tareasBaseUrl}/ocurrencias_rango/`, {
    params: {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    },
    ...authHeaders(accessToken),
  });
  return resp.data;
};

// Actualizar el estado de una ocurrencia
export const actualizarEstadoOcurrencia = async (accessToken, payload) => {
  const resp = await axios.post(
    `${tareasBaseUrl}/actualizar_ocurrencia/`,
    payload,
    authJsonHeaders(accessToken)
  );
  return resp.data;
};

// Obtener instancias pendientes para hoy
export const getInstanciasPendientesHoy = async (accessToken) => {
  const resp = await axios.get(`${tareasBaseUrl}/ocurrencias_hoy/`, authHeaders(accessToken));
  return resp.data;
};

// ========== APIs de Admin ==========

// Obtener todos los usuarios (solo admin)
export const getAllUsuarios = async (accessToken) => {
  const resp = await axios.get(`${usuariosBaseUrl}/`, authHeaders(accessToken));
  return resp.data;
};

// Obtener todas las tareas del sistema (admin)
export const getAllTareas = async (accessToken) => {
  const resp = await axios.get(`${tareasBaseUrl}/`, authHeaders(accessToken));
  return resp.data;
};

// Obtener estadísticas globales (admin)
export const getAdminEstadisticas = async (accessToken) => {
  const resp = await axios.get(`${tareasBaseUrl}/estadisticas/`, authHeaders(accessToken));
  return resp.data;
};

export default axiosInstance;

