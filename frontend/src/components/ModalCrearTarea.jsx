import React, { useState } from "react";

function ModalCrearTarea({ isOpen, onClose, onTareaCreada }) {
  const fieldIds = {
    titulo: "crear-tarea-titulo",
    descripcion: "crear-tarea-descripcion",
    categoria: "crear-tarea-categoria",
    estado: "crear-tarea-estado",
    fechaEntrega: "crear-tarea-fecha-entrega",
  };

  const initialFormData = {
    titulo: "",
    descripcion: "",
    categoria: "trabajo",
    estado: "pendiente",
    fecha_entrega: "",
    repeticion: "ninguna",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        repeticion: "ninguna",
      };

      console.log("Enviando datos:", dataToSend);

      await onTareaCreada(dataToSend);
      setFormData(initialFormData);
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
              <label htmlFor={fieldIds.estado} className="block text-slate-700 font-semibold mb-2 text-sm">
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                id={fieldIds.estado}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div>
              <label htmlFor={fieldIds.fechaEntrega} className="block text-slate-700 font-semibold mb-2 text-sm">
                Fecha de entrega
              </label>
              <input
                type="date"
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleChange}
                id={fieldIds.fechaEntrega}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              />
            </div>

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
