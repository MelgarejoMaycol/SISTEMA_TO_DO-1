import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock del módulo de servicios para evitar cargar axios (ESM) en Jest
const createMockFn = () => jest.fn(() => Promise.resolve({ data: {} }));
jest.mock('./services/api', () => {
  const asyncFn = createMockFn();
  return {
    __esModule: true,
    default: {
      post: asyncFn,
      get: asyncFn,
      put: asyncFn,
      delete: asyncFn,
    },
    registerUser: asyncFn,
    loginUser: asyncFn,
    fetchProfile: asyncFn,
    getTareasEstadisticas: asyncFn,
    getTareas: asyncFn,
    createTarea: asyncFn,
    updateTarea: asyncFn,
    deleteTarea: asyncFn,
    getTareasCalendario: asyncFn,
    getInstanciasPorFecha: asyncFn,
    getInstanciasRangoFechas: asyncFn,
    actualizarEstadoOcurrencia: asyncFn,
    getInstanciasPendientesHoy: asyncFn,
    getAllUsuarios: asyncFn,
    getAllTareas: asyncFn,
    getAdminEstadisticas: asyncFn,
  };
});

// Mock de react-router-dom con implementaciones mínimas para evitar dependencias ESM reales
jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => <div>{element}</div>,
    Navigate: () => <div>Navigate</div>,
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => jest.fn(),
  }),
  { virtual: true },
);

describe('App Component', () => {
  test('renderiza sin errores', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  test('es un componente React válido', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
