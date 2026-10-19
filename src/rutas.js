import { PERFILES } from './models/Usuario';

const { ADMIN, USER } = PERFILES;

// Opciones del menú y perfiles que pueden acceder a cada pantalla.
export const MENU = [
  { path: '/pacientes', titulo: 'Pacientes', grupo: 'Datos', perfiles: [USER] },
  { path: '/doctores', titulo: 'Doctores', grupo: 'Datos', perfiles: [ADMIN] },
  { path: '/organos', titulo: 'Órganos', grupo: 'Datos', perfiles: [ADMIN] },
  { path: '/intervnueva', titulo: 'Nueva', grupo: 'Intervenciones', perfiles: [USER] },
  { path: '/intervbuscar', titulo: 'Buscar', grupo: 'Intervenciones', perfiles: [ADMIN, USER] },
];

export const perfilesDe = (path) => MENU.find((m) => m.path === path).perfiles;
