# Robiotics – Frontend

Aplicación web de Robiotics, un sistema para planificar intervenciones quirúrgicas robóticas. Es el frontend del TP de Desarrollo de Software (UTN FRRO) y consume la API del [backend](https://github.com/rosariomolinas/BackEnd).

- Documentación del TP: [docs/README.md](docs/README.md)

## Tecnologías

React 18 (Create React App), React Router, Bootstrap 5 y React-Bootstrap.

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
| `npm test` | Corre los tests |
| `npm run build` | Genera la versión de producción en `build/` |

## Perfiles

| Perfil | Accede a |
|:-|:-|
| `user` | Pacientes, nueva intervención, búsqueda de intervenciones |
| `admin` | Doctores, órganos, búsqueda de intervenciones |

Las rutas están protegidas: si un usuario entra a una pantalla que no le corresponde, vuelve al inicio.

## Estructura

```
src/config.js         URL del backend según el ambiente
src/models/           clases de negocio (Paciente, Doctor, Organo, Intervencion, ...) con validaciones
src/services/         acceso a la API (ApiClient y un CrudService genérico por entidad)
src/components/       componentes reutilizables (CrudPage, BuscadorModal, TablaRuta, NavBar, ...)
src/pages/            pantallas de la app
src/rutas.js          menú y perfiles con acceso a cada pantalla
src/index.css         estilos propios, mobile-first
```
