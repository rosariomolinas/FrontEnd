import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('sin sesión muestra la pantalla de ingreso', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
});
