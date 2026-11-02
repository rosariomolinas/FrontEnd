import { render, screen, fireEvent } from '@testing-library/react';
import { avanzarConEnter } from './avanzarConEnter';

// Test unitario: Enter pasa al siguiente campo y, desde el último, al botón final.
test('Enter avanza campo por campo y termina en el botón', () => {
  const onSubmit = jest.fn((e) => e.preventDefault());
  render(
    <form onSubmit={onSubmit} onKeyDown={avanzarConEnter}>
      <label htmlFor="a">Nombre</label><input id="a" />
      <label htmlFor="ro">Solo lectura</label><input id="ro" readOnly />
      <label htmlFor="b">Edad</label><input id="b" type="number" />
      <button type="button">Cancelar</button>
      <button type="submit">Guardar</button>
    </form>,
  );

  const nombre = screen.getByLabelText('Nombre');
  nombre.focus();
  fireEvent.keyDown(nombre, { key: 'Enter' });
  expect(screen.getByLabelText('Edad')).toHaveFocus();

  fireEvent.keyDown(screen.getByLabelText('Edad'), { key: 'Enter' });
  expect(screen.getByRole('button', { name: 'Guardar' })).toHaveFocus();
  expect(onSubmit).not.toHaveBeenCalled();
});
