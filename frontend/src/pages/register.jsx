import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(formData);
      console.log("Usuario registrado:", data);
      alert("¡Registro exitoso! Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      
      // Manejo de errores amigable para el usuario
      let msg = "Error al crear la cuenta. Intenta nuevamente.";
      
      if (err.code === 'ERR_NETWORK' || !err.response) {
        msg = "No se pudo conectar con el servidor. Verifica tu conexión.";
      } else if (err.response?.status === 400) {
        // Verificar si el email ya existe
        if (err.response?.data?.email) {
          msg = "Este email ya está registrado. Intenta iniciar sesión.";
        } else {
          msg = "Datos inválidos. Verifica la información ingresada.";
        }
      } else if (err.response?.status >= 500) {
        msg = "Error del servidor. Intenta nuevamente en unos momentos.";
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Crear Cuenta
          </h2>
          <p className="text-slate-500 text-sm">Únete a nuestra plataforma</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 font-semibold mb-2 text-sm">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all duration-200 text-slate-800 placeholder-slate-400"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2 text-sm">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all duration-200 text-slate-800 placeholder-slate-400"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all duration-200 text-slate-800 placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl py-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>

          <div className="pt-6 text-center">
            <span className="text-slate-500 text-sm">¿Ya tienes cuenta? </span>
            <a href="/login" className="text-slate-800 hover:text-slate-600 font-semibold text-sm transition-colors">
              Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
