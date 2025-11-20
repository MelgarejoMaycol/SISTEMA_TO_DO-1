import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTareasEstadisticas, getTareas, createTarea, updateTarea, deleteTarea, getInstanciasPendientesHoy } from "../../services/api";
import ModalCrearTarea from "../../components/ModalCrearTarea";
import ModalEditarTarea from "../../components/ModalEditarTarea";
import CalendarioTareas from "../../components/CalendarioTareas";

function Dashboard() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("user_nombre") || "Usuario";
  const email = localStorage.getItem("user_email") || "usuario";
  const rol = localStorage.getItem("user_rol");
  const token = localStorage.getItem("access_token");
  
  const [estadisticas, setEstadisticas] = useState({
    pendientes: 0,
    en_proceso: 0,
    completadas: 0,
    total: 0
  });
  const [tareas, setTareas] = useState([]);
  const [instanciasHoy, setInstanciasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [statsData, tareasData, instanciasHoyData] = await Promise.all([
        getTareasEstadisticas(token),
        getTareas(token),
        getInstanciasPendientesHoy(token)
      ]);
      
      setEstadisticas(statsData);
      setTareas(tareasData);
      setInstanciasHoy(instanciasHoyData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!token) {
      navigate("/login");
      return;
    }
    // Si es admin, redirigir al dashboard de admin
    if (rol === 'admin') {
      navigate("/admin-dashboard");
      return;
    }
    
    // Cargar datos
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, rol, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCrearTarea = async (formData) => {
    await createTarea(formData, token);
    await cargarDatos(); // Recargar las tareas y estadísticas
  };

  const handleEditarTarea = async (idTarea, formData) => {
    await updateTarea(token, idTarea, formData);
    await cargarDatos();
  };

  const handleEliminarTarea = async (idTarea) => {
    await deleteTarea(token, idTarea);
    await cargarDatos();
  };

  const handleClickTarea = (tarea) => {
    setTareaSeleccionada(tarea);
    setIsEditModalOpen(true);
  };

  const handleClickInstancia = (instancia) => {
    console.info("Seleccionaste una ocurrencia de tarea", instancia);
  };

  // Combinar tareas normales e instancias para la lista
  const obtenerTareasParaLista = () => {
    const tareasNormales = tareas.filter(t => t.repeticion === 'ninguna');

    const instanciasConFormato = instanciasHoy.map(inst => ({
      id_instancia: inst.id_instancia,
      tarea_id: inst.tarea_id,
      id_tarea: inst.tarea_id,
      titulo: inst.tarea_titulo,
      descripcion: inst.tarea_descripcion,
      categoria: inst.tarea_categoria,
      fecha_entrega: inst.fecha_instancia,
      repeticion: inst.tarea_repeticion,
      estado: inst.estado,
      notas: inst.notas,
      esInstancia: true,
    }));

    return [...tareasNormales, ...instanciasConFormato];
  };

  // Ordenar tareas por estado, categoría y luego por fecha
  const tareasParaMostrar = obtenerTareasParaLista();
  const tareasOrdenadas = [...tareasParaMostrar].sort((a, b) => {
    // Primero ordenar por estado (pendiente, en_proceso, completada)
    const ordenEstado = { 'pendiente': 1, 'en_proceso': 2, 'completada': 3 };
    const difEstado = ordenEstado[a.estado] - ordenEstado[b.estado];
    
    if (difEstado !== 0) return difEstado;
    
    // Luego ordenar por categoría (trabajo, estudio, personal)
    const ordenCategoria = { 'trabajo': 1, 'estudio': 2, 'personal': 3 };
    const difCategoria = ordenCategoria[a.categoria] - ordenCategoria[b.categoria];
    
    if (difCategoria !== 0) return difCategoria;
    
    // Si son del mismo estado y categoría, ordenar por fecha
    const fechaA = a.fecha_entrega ? new Date(a.fecha_entrega) : new Date('9999-12-31');
    const fechaB = b.fecha_entrega ? new Date(b.fecha_entrega) : new Date('9999-12-31');
    return fechaA - fechaB;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Mis Tareas</h1>
              <p className="text-sm text-slate-500">Gestiona tus actividades</p>
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
      <div className="max-w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda - Panel de Tareas */}
          <div className="space-y-6">
            {/* Tarjeta de Bienvenida */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">¡Hola, {nombre}!</h2>
                  <p className="text-slate-500 text-sm">{email}</p>
                </div>
              </div>
            </div>

            {/* Grid de Resumen */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : estadisticas.pendientes}
                  </p>
                  <p className="text-xs text-slate-500 text-center">Pendientes</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : estadisticas.en_proceso}
                  </p>
                  <p className="text-xs text-slate-500 text-center">En Proceso</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : estadisticas.completadas}
                  </p>
                  <p className="text-xs text-slate-500 text-center">Completadas</p>
                </div>
              </div>
            </div>

            {/* Lista de Tareas */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Mis Tareas</h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Tarea
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Cargando tareas...</div>
                ) : tareas.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No tienes tareas. ¡Crea una nueva para comenzar!
                  </div>
                ) : (
                  tareasOrdenadas.map((tarea) => (
                    <div 
                      key={tarea.esInstancia ? `inst-${tarea.id_instancia}` : `tarea-${tarea.id_tarea}`}
                      onClick={() => tarea.esInstancia ? handleClickInstancia(tarea) : handleClickTarea(tarea)}
                      className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all cursor-pointer hover:border-slate-300">
                      {tarea.repeticion && tarea.repeticion !== 'ninguna' && (
                        <span className="text-lg mr-2" title="Tarea recurrente">🔄</span>
                      )}
                      <div className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${
                        tarea.categoria === 'trabajo' ? 'bg-blue-400' :
                        tarea.categoria === 'estudio' ? 'bg-purple-400' :
                        'bg-pink-400'
                      }`} title={tarea.categoria.charAt(0).toUpperCase() + tarea.categoria.slice(1)}>
                      </div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        tarea.estado === 'pendiente' ? 'bg-yellow-100' :
                        tarea.estado === 'en_proceso' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          tarea.estado === 'pendiente' ? 'text-yellow-600' :
                          tarea.estado === 'en_proceso' ? 'text-blue-600' :
                          'text-green-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {tarea.estado === 'completada' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 text-sm">{tarea.titulo}</h4>
                        <p className="text-xs text-slate-500">
                          {tarea.categoria.charAt(0).toUpperCase() + tarea.categoria.slice(1)}
                          {tarea.fecha_entrega && ` • ${new Date(tarea.fecha_entrega).toLocaleDateString('es-ES')}`}
                          {tarea.repeticion && tarea.repeticion !== 'ninguna' && (
                            <span className="ml-1">
                              • {tarea.repeticion === 'diaria' ? 'Cada día' :
                                 tarea.repeticion === 'semanal' ? 'Cada semana' :
                                 tarea.repeticion === 'mensual' ? 'Cada mes' : 'Personalizada'}
                            </span>
                          )}
                          {tarea.esInstancia && (
                            <span className="ml-1 text-blue-600 font-medium">• Hoy</span>
                          )}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tarea.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        tarea.estado === 'en_proceso' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {tarea.estado === 'pendiente' ? 'Pendiente' :
                         tarea.estado === 'en_proceso' ? 'En Proceso' :
                         'Completada'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha - Calendario */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
            <CalendarioTareas 
              tareas={tareas} 
              loading={loading} 
              onTareaClick={handleClickTarea}
              onInstanciaClick={handleClickInstancia}
            />
          </div>
        </div>
      </div>

      {/* Modal Crear Tarea */}
      <ModalCrearTarea 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTareaCreada={handleCrearTarea}
      />

      {/* Modal Editar Tarea */}
      <ModalEditarTarea 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tarea={tareaSeleccionada}
        onTareaEditada={handleEditarTarea}
        onTareaEliminada={handleEliminarTarea}
      />
    </div>
  );
}

export default Dashboard;
