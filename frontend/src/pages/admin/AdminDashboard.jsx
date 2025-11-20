import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsuarios, getAllTareas } from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("user_nombre") || "Admin";
  const rol = localStorage.getItem("user_rol");
  const token = localStorage.getItem("access_token");

  const [estadisticas, setEstadisticas] = useState({
    total_usuarios: 0,
    total_tareas: 0,
    tareas_completadas: 0,
    tareas_pendientes: 0,
    tareas_en_proceso: 0
  });
  const [loading, setLoading] = useState(true);

  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      const [usuarios, tareas] = await Promise.all([
        getAllUsuarios(token),
        getAllTareas(token)
      ]);

      // Calcular estadísticas
      const completadas = tareas.filter(t => t.estado === 'completada').length;
      const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
      const enProceso = tareas.filter(t => t.estado === 'en_proceso').length;

      setEstadisticas({
        total_usuarios: usuarios.length,
        total_tareas: tareas.length,
        tareas_completadas: completadas,
        tareas_pendientes: pendientes,
        tareas_en_proceso: enProceso
      });
    } catch (error) {
      console.error("Error al cargar datos del admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar que el usuario sea admin
    if (!token || rol !== 'admin') {
      navigate("/login");
      return;
    }

    cargarDatosAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, rol, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Panel de Administración</h1>
              <p className="text-sm text-slate-500">Sistema de Gestión de Tareas</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tarjeta de Bienvenida */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">¡Bienvenido, {nombre}!</h2>
              <p className="text-slate-500">Rol: <span className="font-semibold text-slate-700">Administrador</span></p>
            </div>
          </div>
        </div>

        {/* Grid de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : estadisticas.total_usuarios}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Tareas Totales</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : estadisticas.total_tareas}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Completadas</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : estadisticas.tareas_completadas}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Grid adicional de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Tareas Pendientes</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : estadisticas.tareas_pendientes}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">En Proceso</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : estadisticas.tareas_en_proceso}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">Crear Usuario</p>
                <p className="text-sm text-slate-500">Agregar nuevo usuario al sistema</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">Ver Todas las Tareas</p>
                <p className="text-sm text-slate-500">Gestionar tareas del sistema</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">Notificaciones</p>
                <p className="text-sm text-slate-500">Gestionar notificaciones del sistema</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">Reportes</p>
                <p className="text-sm text-slate-500">Ver estadísticas y reportes</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
