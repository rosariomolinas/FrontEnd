import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrarResultado, { validarResultado } from './RegistrarResultado';
import Intervencion from '../models/Intervencion';
import { intervencionService } from '../services';

jest.mock('../services', () => ({ intervencionService: { registrarResultado: jest.fn() } }));
const registrar = intervencionService.registrarResultado as jest.Mock;

const planificada = new Intervencion({
  _id: 'abc', paciente: 1, doctor: 1, fecint: '2026-11-01', tiempo: 30, ruta: [{ organo: 1, mtejido: true }],
});

test('reglas del caso de uso 2', () => {
  const base = {
    estado: 'realizada' as const, fecha: '2026-10-01', tiempoReal: '45', observaciones: '',
  };
  expect(validarResultado(base, '2026-10-02')).toEqual([]);
  expect(validarResultado({ ...base, fecha: '2026-10-03' }, '2026-10-02')).toEqual(['La fecha del resultado no puede ser futura']);
  expect(validarResultado({ ...base, estado: 'cancelada' }, '2026-10-02')).toEqual(['Indicá el motivo de la cancelación']);
});

test('una cancelación sin motivo no llega al servidor; con motivo, sí', async () => {
  const onRegistrado = jest.fn();
  registrar.mockResolvedValue(new Intervencion({ ...planificada, _id: 'abc', estado: 'cancelada' }));
  render(<RegistrarResultado intervencion={planificada} onClose={jest.fn()} onRegistrado={onRegistrado} />);

  userEvent.click(screen.getByLabelText('Cancelada'));
  userEvent.click(screen.getByRole('button', { name: 'Registrar' }));
  expect(await screen.findByText('Indicá el motivo de la cancelación')).toBeInTheDocument();
  expect(registrar).not.toHaveBeenCalled();

  userEvent.type(screen.getByLabelText('Motivo de la cancelación'), 'El paciente tuvo fiebre');
  userEvent.click(screen.getByRole('button', { name: 'Registrar' }));
  await waitFor(() => expect(onRegistrado).toHaveBeenCalled());
  expect(registrar).toHaveBeenCalledWith('abc', expect.objectContaining({ estado: 'cancelada', observaciones: 'El paciente tuvo fiebre' }));
});
