import React, { useState } from "react";

function ModalCrearTarea({ isOpen, onClose, onTareaCreada }) {
  const fieldIds = {
    titulo: "crear-tarea-titulo",
    descripcion: "crear-tarea-descripcion",
    categoria: "crear-tarea-categoria",
    fechaEntrega: "crear-tarea-fecha-entrega",
    repeticion: "crear-tarea-repeticion",
    intervaloRepeticion: "crear-tarea-intervalo",
    fechaFinRepeticion: "crear-tarea-fecha-fin",
  };

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "trabajo",
    fecha_entrega: "",
    repeticion: "ninguna",
    intervalo_repeticion: 1,
    fecha_fin_repeticion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Si cambia la repetición a "ninguna", limpiar campos de recurrencia
    if (name === "repeticion" && value === "ninguna") {
      setFormData(prev => ({
        ...prev,
        repeticion: "ninguna",
        intervalo_repeticion: 1,
        fecha_fin_repeticion: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Preparar datos para enviar
      const dataToSend = { ...formData };
      
      // Si no es recurrente, no enviar campos de recurrencia
      if (formData.repeticion === "ninguna") {
        delete dataToSend.intervalo_repeticion;
        delete dataToSend.fecha_fin_repeticion;
      } else {
        // Validar que tenga fecha de entrega si es recurrente
        if (!formData.fecha_entrega) {
          setError("⚠️ Las tareas recurrentes requieren una fecha de inicio. Por favor, selecciona una fecha.");
          setLoading(false);
          return;
        }
        
        // Validar intervalo para personalizada
        if (formData.repeticion === "personalizada" && formData.intervalo_repeticion < 1) {
          setError("⚠️ El intervalo de repetición debe ser al menos 1 día.");
          setLoading(false);
          return;
        }
      }
      
      console.log("Enviando datos:", dataToSend); // Para debug
      
      await onTareaCreada(dataToSend);
      // Resetear formulario
      setFormData({
        titulo: "",
        descripcion: "",
        categoria: "trabajo",
        fecha_entrega: "",
        repeticion: "ninguna",
        intervalo_repeticion: 1,
        fecha_fin_repeticion: "",
      });
      onClose();
    } catch (err) {
      console.error("Error detallado:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
      setError(`Error al crear la tarea: ${errorMessage}. Por favor, verifica los datos e intenta nuevamente.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const esRecurrente = formData.repeticion !== "ninguna";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Nueva Tarea</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Cerrar modal de creación de tarea"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor={fieldIds.titulo} className="block text-slate-700 font-semibold mb-2 text-sm">
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                id={fieldIds.titulo}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                placeholder="Ej: Completar informe mensual"
              />
            </div>

            <div>
              <label htmlFor={fieldIds.descripcion} className="block text-slate-700 font-semibold mb-2 text-sm">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                id={fieldIds.descripcion}
                rows="3"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all resize-none"
                placeholder="Describe los detalles de la tarea..."
              />
            </div>

            <div>
              <label htmlFor={fieldIds.categoria} className="block text-slate-700 font-semibold mb-2 text-sm">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                id={fieldIds.categoria}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              >
                <option value="trabajo">Trabajo</option>
                <option value="estudio">Estudio</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label htmlFor={fieldIds.fechaEntrega} className="block text-slate-700 font-semibold mb-2 text-sm">
                {esRecurrente ? (
                  <span className="flex items-center gap-2">
                    Fecha de inicio *
                    <span className="text-xs text-red-600 font-normal">(obligatoria para tareas recurrentes)</span>
                  </span>
                ) : (
                  "Fecha de entrega"
                )}
              </label>
              <input
                type="date"
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleChange}
                id={fieldIds.fechaEntrega}
                required={esRecurrente}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all ${
                  esRecurrente && !formData.fecha_entrega 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-slate-200'
                }`}
                placeholder={esRecurrente ? "Selecciona fecha de inicio" : ""}
              />
              {esRecurrente && !formData.fecha_entrega && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Debes seleccionar una fecha de inicio para crear una tarea recurrente
                </p>
              )}
            </div>

            <div>
              <label htmlFor={fieldIds.repeticion} className="block text-slate-700 font-semibold mb-2 text-sm flex items-center gap-2">
                <span className="text-lg">🔄</span>
                Repetir tarea
              </label>
              <select
                name="repeticion"
                value={formData.repeticion}
                onChange={handleChange}
                id={fieldIds.repeticion}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              >
                <option value="ninguna">No repetir</option>
                <option value="diaria">Cada día</option>
                <option value="semanal">Cada semana</option>
                <option value="mensual">Cada mes</option>
                <option value="personalizada">Personalizada</option>
              </select>
            </div>

            {/* Campos adicionales para tareas recurrentes */}
            {esRecurrente && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Configuración de recurrencia</span>
                </div>

                {formData.repeticion === "personalizada" && (
                  <div>
                    <label htmlFor={fieldIds.intervaloRepeticion} className="block text-slate-700 font-semibold mb-2 text-sm">
                      Repetir cada (días)
                    </label>
                    <input
                      type="number"
                      name="intervalo_repeticion"
                      value={formData.intervalo_repeticion}
                      onChange={handleChange}
                      id={fieldIds.intervaloRepeticion}
                      min="1"
                      max="365"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor={fieldIds.fechaFinRepeticion} className="block text-slate-700 font-semibold mb-2 text-sm">
                    Terminar repetición (opcional)
                  </label>
                  <input
                    type="date"
                    name="fecha_fin_repeticion"
                    value={formData.fecha_fin_repeticion}
                    onChange={handleChange}
                    id={fieldIds.fechaFinRepeticion}
                    min={formData.fecha_entrega}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dejar en blanco para que se repita indefinidamente
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Crear Tarea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearTarea;
