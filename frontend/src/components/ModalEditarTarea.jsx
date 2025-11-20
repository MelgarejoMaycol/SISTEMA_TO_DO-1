import React, { useState, useEffect } from "react";

function ModalEditarTarea({ isOpen, onClose, tarea, onTareaEditada, onTareaEliminada }) {
  const fieldIds = {
    titulo: "editar-tarea-titulo",
    descripcion: "editar-tarea-descripcion",
    categoria: "editar-tarea-categoria",
    estado: "editar-tarea-estado",
    fechaEntrega: "editar-tarea-fecha-entrega",
    repeticion: "editar-tarea-repeticion",
  };

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "personal",
    estado: "pendiente",
    fecha_entrega: "",
    repeticion: "ninguna"
  });

  useEffect(() => {
    if (tarea) {
      setFormData({
        titulo: tarea.titulo || "",
        descripcion: tarea.descripcion || "",
        categoria: tarea.categoria || "personal",
        estado: tarea.estado || "pendiente",
        fecha_entrega: tarea.fecha_entrega || "",
        repeticion: tarea.repeticion || "ninguna"
      });
    }
  }, [tarea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onTareaEditada(tarea.id_tarea, formData);
    onClose();
  };

  const handleEliminar = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      await onTareaEliminada(tarea.id_tarea);
      onClose();
    }
  };

  if (!isOpen || !tarea) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Editar Tarea</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Cerrar modal de edición"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor={fieldIds.titulo} className="block text-sm font-semibold text-slate-700 mb-2">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              id={fieldIds.titulo}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor={fieldIds.descripcion} className="block text-sm font-semibold text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              id={fieldIds.descripcion}
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={fieldIds.categoria} className="block text-sm font-semibold text-slate-700 mb-2">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                id={fieldIds.categoria}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="trabajo">Trabajo</option>
                <option value="estudio">Estudio</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label htmlFor={fieldIds.estado} className="block text-sm font-semibold text-slate-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                id={fieldIds.estado}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={fieldIds.fechaEntrega} className="block text-sm font-semibold text-slate-700 mb-2">
                Fecha de Entrega
              </label>
              <input
                type="date"
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleChange}
                id={fieldIds.fechaEntrega}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor={fieldIds.repeticion} className="block text-sm font-semibold text-slate-700 mb-2">
                Repetición
              </label>
              <select
                name="repeticion"
                value={formData.repeticion}
                onChange={handleChange}
                id={fieldIds.repeticion}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="ninguna">Ninguna</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleEliminar}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Eliminar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarTarea;
