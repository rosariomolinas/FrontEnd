import { PERFILES, type Perfil } from './models/Usuario';

const { ADMIN, USER } = PERFILES;

export interface OpcionMenu {
  path: string;
  titulo: string;
  grupo: string;
  descripcion: string; // texto de la tarjeta en la pantalla de inicio
  perfiles: Perfil[];
}

// Opciones del menú y perfiles que pueden acceder a cada pantalla.
// Los permisos se controlan también en el backend: esto solo arma el menú.
export const MENU: OpcionMenu[] = [
  {
    path: '/pacientes', titulo: 'Pacientes', grupo: 'Datos',
    descripcion: 'Alta, búsqueda y modificación de las personas a intervenir', perfiles: [USER],
  },
  {
    path: '/doctores', titulo: 'Doctores', grupo: 'Datos',
    descripcion: 'Médicos habilitados y sus matrículas', perfiles: [ADMIN],
  },
  {
    path: '/organos', titulo: 'Órganos', grupo: 'Datos',
    descripcion: 'Qué muestras y medicación admite cada órgano', perfiles: [ADMIN],
  },
  {
    path: '/medicamentos', titulo: 'Medicamentos', grupo: 'Datos',
    descripcion: 'Catálogo para la medicación de la ruta', perfiles: [ADMIN],
  },
  {
    path: '/intervnueva', titulo: 'Nueva', grupo: 'Intervenciones',
    descripcion: 'Planificá una intervención y calculá su presupuesto', perfiles: [USER],
  },
  {
    path: '/intervbuscar', titulo: 'Buscar', grupo: 'Intervenciones',
    descripcion: 'Filtrá, revisá y registrá el resultado', perfiles: [ADMIN, USER],
  },
  {
    path: '/usuarios', titulo: 'Usuarios', grupo: 'Administración',
    descripcion: 'Cuentas y perfiles de acceso al sistema', perfiles: [ADMIN],
  },
];

export const perfilesDe = (path: string): Perfil[] => MENU.find((m) => m.path === path)?.perfiles ?? [];
