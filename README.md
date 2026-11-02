# Robiotics – Frontend

Aplicación web de Robiotics, un sistema para planificar intervenciones quirúrgicas robóticas. Es el frontend del TP de Desarrollo de Software (UTN FRRO) y consume la API del [backend](https://github.com/rosariomolinas/BackEnd).

- Documentación del TP: [docs/README.md](docs/README.md)

## Tecnologías

React 18 con TypeScript (Create React App), React Router, Bootstrap 5 y React-Bootstrap. Tests con Jest y Testing Library (unitarios) y Playwright (end-to-end).

## Instalación

Necesitás Node.js 18 o superior y el backend corriendo (ver su README).

```bash
git clone https://github.com/rosariomolinas/FrontEnd.git
cd FrontEnd
npm install
```

La URL del backend se toma de la variable `REACT_APP_API_URL`. En desarrollo ya viene configurada en `.env.development` (`http://localhost:8080/robiotics`). Para otro ambiente creá un `.env.local` o `.env.production` a partir de [.env.example](.env.example).

## Ejecución

| Comando | Qué hace |
|:-|:-|
| `npm start` | Levanta la app en http://localhost:3000 |
| `npm test` | Corre los tests unitarios (en modo watch; `npm test -- --watchAll=false` para una sola corrida) |
| `npm run e2e` | Corre los tests end-to-end en un navegador (ver abajo) |
| `npm run build` | Genera la versión de producción en `build/` |

## Perfiles

| Perfil | Accede a |
|:-|:-|
| `user` | Pacientes; planificar, buscar, modificar y eliminar intervenciones; registrar su resultado |
| `admin` | Doctores, órganos, medicamentos, usuarios y búsqueda de intervenciones |

Las rutas están protegidas: si un usuario entra a una pantalla que no le corresponde, vuelve al inicio. El backend vuelve a controlar los permisos en cada pedido. La sesión es un JWT; si vence, la app vuelve al login con un aviso.

## Casos de uso

1. **Planificar una intervención** (Intervenciones › Nueva): paciente, médico, fecha y ruta de órganos con sus muestras y medicación. Calcula costo y tiempo. Una intervención planificada se puede modificar o eliminar desde el detalle de la búsqueda.
2. **Registrar el resultado** (Intervenciones › Buscar › detalle › Registrar resultado): marcar la intervención como realizada (con el tiempo real) o cancelada (con el motivo). Después ya no se puede modificar.

## Tests

| Archivo | Tipo | Qué prueba |
|:-|:-|:-|
| [src/components/BuscadorModal.test.tsx](src/components/BuscadorModal.test.tsx) | Unitario de componente | Buscar, mostrar resultados, errores y elegir un registro, con el servicio simulado |
| [src/components/RegistrarResultado.test.tsx](src/components/RegistrarResultado.test.tsx) | Unitario de componente | Reglas y formulario del caso de uso 2, con el servicio simulado |
| [src/models/Intervencion.test.ts](src/models/Intervencion.test.ts) | Unitario | Presupuesto y reglas de la planificación |
| [e2e/intervencion.spec.ts](e2e/intervencion.spec.ts) | End-to-end | En un navegador real: login, alta de paciente, planificar una intervención, registrar su resultado, y permisos del admin |

Para el e2e:

1. Levantá el backend con una base de pruebas y cargá los datos iniciales (`npm run seed` en el backend crea `admin/admin`, `user/user`, un médico, órganos y medicamentos). Conviene usar una base local o aparte (`MONGO_URI` en el `.env` del backend) porque el test crea registros.
2. La primera vez, instalá el navegador: `npx playwright install chromium`.
3. `npm run e2e`. Si el frontend no está corriendo, Playwright lo levanta. Al terminar, `npx playwright show-report` muestra el reporte.

Si en tu base los usuarios tienen otras contraseñas, pasalas con `E2E_USER`, `E2E_USER_PASSWORD`, `E2E_ADMIN` y `E2E_ADMIN_PASSWORD`.

## Estructura

```
src/config.ts         URL del backend según el ambiente
src/models/           clases de negocio (Paciente, Doctor, Organo, Intervencion, ...) con validaciones
src/services/         acceso a la API REST (ApiClient con el JWT y un CrudService genérico por entidad)
src/components/       componentes reutilizables (CrudPage, BuscadorModal, TablaRuta, NavBar, ...)
src/pages/            pantallas de la app
src/rutas.ts          menú y perfiles con acceso a cada pantalla
src/index.css         estilos propios, mobile-first
e2e/                  tests end-to-end (Playwright)
```
