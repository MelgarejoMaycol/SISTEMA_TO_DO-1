import React, { useState, useMemo, useEffect, useCallback } from "react";
import { getTareasCalendario } from "../services/api";

function CalendarioTareas({ tareas, loading, onTareaClick, onInstanciaClick }) {
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [instanciasCalendario, setInstanciasCalendario] = useState([]);
  const [loadingInstancias, setLoadingInstancias] = useState(false);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Colores pastel por categoría
  const coloresPorCategoria = {
    trabajo: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      dot: 'bg-blue-400'
    },
    estudio: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      dot: 'bg-purple-400'
    },
    personal: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      dot: 'bg-pink-400'
    }
  };

  // Cargar instancias del calendario cuando cambia el mes
  useEffect(() => {
    const cargarInstanciasCalendario = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      setLoadingInstancias(true);
      try {
        const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
        const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
        
        const fechaInicio = primerDia.toISOString().split('T')[0];
        const fechaFin = ultimoDia.toISOString().split('T')[0];

        const data = await getTareasCalendario(token, fechaInicio, fechaFin);
        setInstanciasCalendario(data.instancias_recurrentes || []);
      } catch (error) {
        console.error("Error al cargar instancias del calendario:", error);
      } finally {
        setLoadingInstancias(false);
      }
    };

    cargarInstanciasCalendario();
  }, [mesActual]);

  // Obtener días del mes
  const obtenerDiasDelMes = useCallback(() => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();

    const dias = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(año, mes, dia));
    }
    
    return dias;
      }, [mesActual]);

  // Obtener tareas e instancias para una fecha específica
  const obtenerTareasParaDia = (fecha) => {
    if (!fecha) return { tareas: [], instancias: [] };
    
    const fechaStr = fecha.toISOString().split('T')[0];
    
    // Tareas normales con fecha específica (no recurrentes)
    const tareasNormales = tareas.filter(tarea => {
      if (!tarea.fecha_entrega || tarea.repeticion !== 'ninguna') return false;
      const fechaEntrega = tarea.fecha_entrega.split('T')[0];
      return fechaEntrega === fechaStr;
    });

    // Instancias de tareas recurrentes
    const instancias = instanciasCalendario.filter(instancia => {
      if (!instancia.fecha_instancia) return false;
      const fechaInstancia = instancia.fecha_instancia.split('T')[0];
      return fechaInstancia === fechaStr;
    });

    return { tareas: tareasNormales, instancias };
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(nuevoMes.getMonth() + direccion);
    setMesActual(nuevoMes);
  };

  const esHoy = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const esMismoDia = (fecha1, fecha2) => {
    if (!fecha1 || !fecha2) return false;
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    );
  };

  const handleDiaClick = (fecha, items) => {
    if (!fecha || (items.tareas.length === 0 && items.instancias.length === 0)) return;
    
    if (diaSeleccionado && esMismoDia(fecha, diaSeleccionado)) {
      setDiaSeleccionado(null);
    } else {
      setDiaSeleccionado(fecha);
    }
  };

  const handleTareaInstanciaClick = (item, esInstancia) => {
    if (esInstancia && onInstanciaClick) {
      onInstanciaClick(item);
    } else if (!esInstancia && onTareaClick) {
      onTareaClick(item);
    }
  };

  const dias = useMemo(() => obtenerDiasDelMes(), [obtenerDiasDelMes]);

  if (loading || loadingInstancias) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Cargando calendario...</p>
      </div>
    );
  }

  // Si hay un día seleccionado, mostrar solo ese día
  if (diaSeleccionado) {
    const { tareas: tareasDelDia, instancias: instanciasDelDia } = obtenerTareasParaDia(diaSeleccionado);
    const totalItems = tareasDelDia.length + instanciasDelDia.length;
    
    return (
      <div className="h-full flex flex-col animate-fadeIn">
        {/* Header con botón de regreso */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {diaSeleccionado.getDate()} de {meses[diaSeleccionado.getMonth()]}
            </h3>
            <p className="text-sm text-slate-500">
              {totalItems} {totalItems === 1 ? 'tarea' : 'tareas'}
            </p>
          </div>
          <button
            onClick={() => setDiaSeleccionado(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al calendario
          </button>
        </div>

        {/* Lista completa de tareas e instancias */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {totalItems === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No hay tareas para este día</p>
            </div>
          ) : (
            <>
              {/* Instancias de tareas recurrentes */}
              {instanciasDelDia.map((instancia, i) => {
                const colores = coloresPorCategoria[instancia.tarea_categoria] || coloresPorCategoria.personal;
                return (
                  <div
                    key={`inst-${i}`}
                    onClick={() => handleTareaInstanciaClick(instancia, true)}
                    className={`p-4 rounded-xl border-2 ${colores.bg} ${colores.border} hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" title="Tarea recurrente">🔄</span>
                        <h4 className={`font-bold text-lg ${colores.text}`}>
                          {instancia.tarea_titulo}
                        </h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        instancia.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                        instancia.estado === 'en_proceso' ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {instancia.estado === 'pendiente' ? 'Pendiente' :
                         instancia.estado === 'en_proceso' ? 'En Proceso' : 'Completada'}
                      </span>
                    </div>
                    
                    {instancia.tarea_descripcion && (
                      <p className="text-slate-600 text-sm mb-3">
                        {instancia.tarea_descripcion}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium">
                          {instancia.tarea_categoria.charAt(0).toUpperCase() + instancia.tarea_categoria.slice(1)}
                        </span>
                      </div>
                      
                      {instancia.tarea_repeticion && instancia.tarea_repeticion !== 'ninguna' && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>
                            {instancia.tarea_repeticion === 'diaria' ? 'Cada día' :
                             instancia.tarea_repeticion === 'semanal' ? 'Cada semana' :
                             instancia.tarea_repeticion === 'mensual' ? 'Cada mes' : 'Personalizada'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Tareas normales */}
              {tareasDelDia.map((tarea, i) => {
                const colores = coloresPorCategoria[tarea.categoria] || coloresPorCategoria.personal;
                return (
                  <div
                    key={`tarea-${i}`}
                    onClick={() => handleTareaInstanciaClick(tarea, false)}
                    className={`p-4 rounded-xl border-2 ${colores.bg} ${colores.border} hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-lg ${colores.text}`}>
                          {tarea.titulo}
                        </h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tarea.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                        tarea.estado === 'en_proceso' ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {tarea.estado === 'pendiente' ? 'Pendiente' :
                         tarea.estado === 'en_proceso' ? 'En Proceso' : 'Completada'}
                      </span>
                    </div>
                    
                    {tarea.descripcion && (
                      <p className="text-slate-600 text-sm mb-3">
                        {tarea.descripcion}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium">
                          {tarea.categoria.charAt(0).toUpperCase() + tarea.categoria.slice(1)}
                        </span>
                      </div>
                      
                      {tarea.fecha_entrega && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Vence: {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  // Vista normal del calendario
  return (
    <div className="h-full flex flex-col">
      {/* Header del Calendario */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">
          {meses[mesActual.getMonth()]} {mesActual.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => cambiarMes(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setMesActual(new Date())}
            className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => cambiarMes(1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {diasSemana.map((dia) => (
          <div key={dia} className="text-center text-xs font-semibold text-slate-500 py-2">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {dias.map((fecha, index) => {
          const { tareas: tareasDelDia, instancias: instanciasDelDia } = fecha ? obtenerTareasParaDia(fecha) : { tareas: [], instancias: [] };
          const todosItems = [...tareasDelDia, ...instanciasDelDia.map(i => ({ 
            categoria: i.tarea_categoria, 
            repeticion: i.tarea_repeticion 
          }))];
          const hayTareas = todosItems.length > 0;
          const hoy = esHoy(fecha);

          return (
            <div
              key={index}
              onClick={() => handleDiaClick(fecha, { tareas: tareasDelDia, instancias: instanciasDelDia })}
              className={`
                min-h-16 p-2 rounded-lg border transition-all duration-200
                ${!fecha ? 'bg-transparent border-transparent' : ''}
                ${fecha && hoy ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'}
                ${fecha && !hoy && hayTareas ? 'hover:shadow-lg cursor-pointer hover:border-slate-400' : ''}
              `}
            >
              {fecha && (
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-medium mb-1 ${hoy ? 'text-white' : 'text-slate-700'}`}>
                    {fecha.getDate()}
                  </span>
                  {hayTareas && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(() => {
                        // Obtener categorías únicas (máximo 2)
                        const categoriasUnicas = [...new Set(todosItems.map(t => t.categoria))].slice(0, 2);
                        return categoriasUnicas.map((categoria, i) => {
                          const colores = coloresPorCategoria[categoria] || coloresPorCategoria.personal;
                          const cantidadEnCategoria = todosItems.filter(t => t.categoria === categoria).length;
                          return (
                            <div key={i} className="flex items-center gap-0.5">
                              <div
                                className={`w-2 h-2 rounded-full ${hoy ? 'bg-white/70' : colores.dot}`}
                                title={`${categoria}: ${cantidadEnCategoria} tarea(s)`}
                              />
                              {cantidadEnCategoria > 1 && (
                                <span className={`text-[9px] font-medium ${hoy ? 'text-white/70' : 'text-slate-500'}`}>
                                  {cantidadEnCategoria}
                                </span>
                              )}
                            </div>
                          );
                        });
                      })()}
                      {todosItems.length > 0 && [...new Set(todosItems.map(t => t.categoria))].length > 2 && (
                        <span className={`text-[9px] font-medium ${hoy ? 'text-white/70' : 'text-slate-500'}`}>
                          +{[...new Set(todosItems.map(t => t.categoria))].length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-800 rounded"></div>
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Trabajo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>Estudio</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span>Personal</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔄</span>
            <span>Se repite</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarioTareas;

