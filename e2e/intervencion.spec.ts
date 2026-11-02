import { test, expect, type Page } from '@playwright/test';

// Usuarios que crea `npm run seed` en el backend. Se pueden cambiar con variables de entorno.
const USER = { user: process.env.E2E_USER || 'user', password: process.env.E2E_USER_PASSWORD || 'user' };
const ADMIN = { user: process.env.E2E_ADMIN || 'admin', password: process.env.E2E_ADMIN_PASSWORD || 'admin' };

const ingresar = async (page: Page, { user, password }: { user: string; password: string }) => {
  await page.goto('/');
  await page.getByLabel('Usuario').fill(user);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('heading', { name: `Hola, ${user}` })).toBeVisible();
};

// Elige un registro con el buscador de un campo (paciente o médico).
const elegir = async (page: Page, campo: string, nombre = '') => {
  await page.getByRole('button', { name: `Buscar ${campo}` }).click();
  const modal = page.getByRole('dialog');
  if (nombre) await modal.getByLabel('Nombre o apellido').fill(nombre);
  await modal.getByRole('button', { name: 'Buscar' }).click();
  await modal.locator('tbody tr').filter({ hasText: nombre }).first().click();
  await expect(modal).toBeHidden();
};

const enDias = (dias: number) => new Date(Date.now() + dias * 86400000).toISOString().substring(0, 10);

test('un usuario carga un paciente, planifica su intervención y registra el resultado', async ({ page }) => {
  const apellido = `E2E${Date.now()}`;
  await ingresar(page, USER);

  // Alta de paciente
  await page.getByRole('link', { name: /Pacientes/ }).click();
  await page.getByRole('button', { name: 'Nuevo' }).click();
  await page.getByLabel('Nombre *').fill('Prueba');
  await page.getByLabel('Apellido *').fill(apellido);
  await page.getByLabel('Edad').fill('50');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Paciente guardado')).toBeVisible();

  // Caso de uso 1: planificar la intervención
  await page.goto('/intervnueva');
  await elegir(page, 'paciente', apellido);
  await elegir(page, 'médico');
  await page.getByLabel('Fecha').fill(enDias(7));
  await page.getByRole('button', { name: 'Agregar órgano' }).click();
  await page.locator('.tabla-ruta tbody tr').first().getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Presupuestar' }).click();
  await expect(page.getByText(/Costo: \$\d+/)).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar intervención' }).click();
  await expect(page.getByText('Intervención guardada')).toBeVisible();

  // Caso de uso 2: buscarla y registrar el resultado
  await page.goto('/intervbuscar');
  await elegir(page, 'paciente', apellido);
  await page.getByLabel('Estado').selectOption('planificada');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await page.locator('tbody tr').filter({ hasText: apellido }).click();
  await page.getByRole('button', { name: 'Registrar resultado' }).click();

  const modal = page.getByRole('dialog');
  await modal.getByLabel('Tiempo real (minutos)').fill('40');
  await modal.getByLabel('Observaciones').fill('Sin complicaciones');
  await modal.getByRole('button', { name: 'Registrar' }).click();

  await expect(page.getByText('Intervención realizada')).toBeVisible();
  const detalle = page.getByRole('dialog');
  await expect(detalle.getByText('40 min')).toBeVisible();
  await expect(detalle.getByText('Sin complicaciones')).toBeVisible();
  await expect(detalle.getByRole('button', { name: 'Registrar resultado' })).toHaveCount(0);
});

test('el administrador ve sus opciones y no entra a las pantallas del perfil user', async ({ page }) => {
  await ingresar(page, ADMIN);
  await expect(page.getByRole('link', { name: /Usuarios/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Pacientes/ })).toHaveCount(0);

  await page.getByRole('link', { name: /Usuarios/ }).click();
  await expect(page.getByRole('cell', { name: USER.user, exact: true }).first()).toBeVisible();

  await page.goto('/pacientes');
  await expect(page.getByRole('heading', { name: `Hola, ${ADMIN.user}` })).toBeVisible();
});
