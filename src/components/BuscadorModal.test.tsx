import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuscadorModal from './BuscadorModal';
import Paciente from '../models/Paciente';
import type CrudService from '../services/CrudService';

// Test unitario de componente: BuscadorModal con un servicio simulado (no llama al backend).
const pacientes = [
  new Paciente({ code: 1, nombre: 'Ana', apellido: 'Pérez', activo: true }),
  new Paciente({ code: 2, nombre: 'Luis', apellido: 'Pérez', activo: false }),
];

const crearServicio = () => ({
  buscar: jest.fn().mockResolvedValue(pacientes),
}) as unknown as CrudService<Paciente> & { buscar: jest.Mock };

test('busca por nombre, muestra los resultados y devuelve el elegido', async () => {
  const service = crearServicio();
  const onSelect = jest.fn();
  render(<BuscadorModal titulo="Buscar paciente" service={service} show onSelect={onSelect} onClose={jest.fn()} />);

  userEvent.type(screen.getByLabelText('Nombre o apellido'), 'pérez');
  userEvent.click(screen.getByLabelText('Incluir dados de baja'));
  userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

  expect(await screen.findByText('Ana Pérez')).toBeInTheDocument();
  expect(screen.getByText('De baja')).toBeInTheDocument();
  expect(service.buscar).toHaveBeenCalledWith({ codigo: '', nombre: 'pérez', soloActivos: false });

  userEvent.click(screen.getByText('Ana Pérez'));
  expect(onSelect).toHaveBeenCalledWith(pacientes[0]);
});

test('muestra un mensaje cuando no hay coincidencias o el servidor falla', async () => {
  const service = crearServicio();
  service.buscar.mockResolvedValueOnce([]).mockRejectedValueOnce(new Error('No se pudo conectar con el servidor'));
  render(<BuscadorModal titulo="Buscar paciente" service={service} show onSelect={jest.fn()} onClose={jest.fn()} />);

  userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  expect(await screen.findByText('No hay coincidencias.')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  await waitFor(() => expect(screen.getByText('No se pudo conectar con el servidor')).toBeInTheDocument());
});
