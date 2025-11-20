import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalEditarTarea from './ModalEditarTarea';

describe('ModalEditarTarea Component', () => {
  const mockTarea = {
    id_tarea: 1,
    titulo: 'Tarea de prueba',
    descripcion: 'Descripción de prueba',
    categoria: 'trabajo',
    estado: 'pendiente',
    fecha_entrega: '2025-12-31',
    repeticion: 'ninguna'
  };

  const mockOnClose = jest.fn();
  const mockOnTareaEditada = jest.fn();
  const mockOnTareaEliminada = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('no renderiza cuando isOpen es false', () => {
    const { container } = render(
      <ModalEditarTarea
        isOpen={false}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renderiza correctamente cuando isOpen es true', () => {
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    expect(screen.getByText('Editar Tarea')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tarea de prueba')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descripción de prueba')).toBeInTheDocument();
  });

  test('carga los datos de la tarea correctamente', () => {
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    const tituloInput = screen.getByLabelText(/título/i);
    const descripcionInput = screen.getByLabelText(/descripción/i);
    const categoriaSelect = screen.getByLabelText(/categoría/i);
    const estadoSelect = screen.getByLabelText(/estado/i);
    
    expect(tituloInput).toHaveValue('Tarea de prueba');
    expect(descripcionInput).toHaveValue('Descripción de prueba');
    expect(categoriaSelect).toHaveValue('trabajo');
    expect(estadoSelect).toHaveValue('pendiente');
  });

  test('actualiza el formulario cuando se cambian los valores', () => {
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    const tituloInput = screen.getByLabelText(/título/i);
    fireEvent.change(tituloInput, { target: { value: 'Título actualizado' } });
    
    expect(tituloInput).toHaveValue('Título actualizado');
  });

  test('llama a onTareaEditada cuando se guarda', async () => {
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    const guardarButton = screen.getByText('Guardar Cambios');
    fireEvent.click(guardarButton);
    
    await waitFor(() => {
      expect(mockOnTareaEditada).toHaveBeenCalledWith(1, expect.any(Object));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('llama a onClose cuando se hace clic en cancelar', () => {
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    const cancelarButton = screen.getByText('Cancelar');
    fireEvent.click(cancelarButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('llama a onTareaEliminada cuando se elimina (con confirmación)', async () => {
    // Mock del window.confirm
    window.confirm = jest.fn(() => true);
    
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    const eliminarButton = screen.getByText('Eliminar');
    fireEvent.click(eliminarButton);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnTareaEliminada).toHaveBeenCalledWith(1);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('no elimina si se cancela la confirmación', async () => {
    // Mock del window.confirm retornando false
    window.confirm = jest.fn(() => false);
    
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );
    
    const eliminarButton = screen.getByText('Eliminar');
    fireEvent.click(eliminarButton);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnTareaEliminada).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  test('cierra el modal con el botón X', () => {
    render(
      <ModalEditarTarea
        isOpen={true}
        onClose={mockOnClose}
        tarea={mockTarea}
        onTareaEditada={mockOnTareaEditada}
        onTareaEliminada={mockOnTareaEliminada}
      />
    );

    const closeButton = screen.getByLabelText(/cerrar modal de edición/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
