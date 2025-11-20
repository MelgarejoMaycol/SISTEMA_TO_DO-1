import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: () => <div>Navigate</div>
}));

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
