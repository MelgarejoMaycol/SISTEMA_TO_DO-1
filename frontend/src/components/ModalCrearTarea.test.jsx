import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalCrearTarea from './ModalCrearTarea';

describe('ModalCrearTarea Component', () => {
  const mockOnClose = jest.fn();
  const mockOnTareaCreada = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('no renderiza cuando isOpen es false', () => {
    const { container } = render(
      <ModalCrearTarea
        isOpen={false}
        onClose={mockOnClose}
        onTareaCreada={mockOnTareaCreada}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renderiza correctamente cuando isOpen es true', () => {
    render(
      <ModalCrearTarea
        isOpen={true}
        onClose={mockOnClose}
        onTareaCreada={mockOnTareaCreada}
      />
    );
    
    expect(screen.getByRole('heading', { name: /nueva tarea/i })).toBeInTheDocument();
  });

  test('el formulario tiene valores iniciales vacíos', () => {
    render(
      <ModalCrearTarea
        isOpen={true}
        onClose={mockOnClose}
        onTareaCreada={mockOnTareaCreada}
      />
    );
    
    const tituloInput = screen.getByLabelText(/título/i);
    expect(tituloInput).toHaveValue('');
  });

  test('permite ingresar datos en el formulario', () => {
    render(
      <ModalCrearTarea
        isOpen={true}
        onClose={mockOnClose}
        onTareaCreada={mockOnTareaCreada}
      />
    );
    
    const tituloInput = screen.getByLabelText(/título/i);
    const descripcionInput = screen.getByLabelText(/descripción/i);
    
    fireEvent.change(tituloInput, { target: { value: 'Nueva tarea' } });
    fireEvent.change(descripcionInput, { target: { value: 'Descripción nueva' } });
    
    expect(tituloInput).toHaveValue('Nueva tarea');
    expect(descripcionInput).toHaveValue('Descripción nueva');
  });

  test('llama a onTareaCreada cuando se envía el formulario', async () => {
    render(
      <ModalCrearTarea
        isOpen={true}
        onClose={mockOnClose}
        onTareaCreada={mockOnTareaCreada}
      />
    );
    
    const tituloInput = screen.getByLabelText(/título/i);
    fireEvent.change(tituloInput, { target: { value: 'Nueva tarea' } });
    
    const crearButton = screen.getByText(/crear tarea/i);
    fireEvent.click(crearButton);
    
    await waitFor(() => {
      expect(mockOnTareaCreada).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('llama a onClose cuando se cancela', () => {
    render(
      <ModalCrearTarea
        isOpen={true}
        onClose={mockOnClose}
        onTareaCreada={mockOnTareaCreada}
      />
    );
    
    const cancelarButton = screen.getByText(/cancelar/i);
    fireEvent.click(cancelarButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
