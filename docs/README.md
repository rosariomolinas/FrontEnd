# Documentación del TP – Robiotics

La documentación completa del TP (propuesta, API, minutas y gestión) está en el repositorio del backend:

- [Propuesta](https://github.com/rosariomolinas/BackEnd/blob/main/docs/proposal.md)
- [API](https://github.com/rosariomolinas/BackEnd/blob/main/docs/api.md)
- [Tests del backend](https://github.com/rosariomolinas/BackEnd/blob/main/docs/tests.md) y [del frontend](tests.md)
- [Minutas](https://github.com/rosariomolinas/BackEnd/blob/main/docs/minutas.md)
- [Gestión del proyecto](https://github.com/rosariomolinas/BackEnd/blob/main/docs/gestion.md)

## Frontend

| Requisito | Dónde está |
|:-|:-|
| Framework y librería de componentes | React 18 + TypeScript + React-Bootstrap (`package.json`) |
| Mobile-first, breakpoints SM / MD / LG | `src/index.css` y grilla de Bootstrap (`xs`, `sm`, `md`, `lg`) en las pantallas |
| Eventos de usuario | formularios y botones de `src/pages` y `src/components` |
| Manejo de errores amigable | `ApiClient` traduce los errores a mensajes; `ListaErrores` y `Aviso` los muestran |
| Reactividad ante un estado | `useState` / `useEffect` en todas las pantallas |
| Input property | por ejemplo `CrudPage` (`titulo`, `service`, `Model`), `BuscadorModal` (`service`, `show`) y `RegistrarResultado` (`intervencion`) |
| Output property | por ejemplo `BuscadorModal.onSelect`, `RegistrarResultado.onRegistrado`, `Login.onLogin`, `NavBar.onLogout` |
| Servicio | `src/services/apiClient.ts`, `src/services/CrudService.ts`, `src/services/index.ts` |
| Login y niveles de acceso | `authService` (JWT), `src/rutas.ts` (perfiles por pantalla), `RutaProtegida`; el backend vuelve a controlar cada pedido |
| Test unitario de componente | `src/components/BuscadorModal.test.tsx`, `src/components/RegistrarResultado.test.tsx` |
| Test end-to-end | `e2e/intervencion.spec.ts` (Playwright) |
| Modelos con clases | `src/models/` (clases e interfaces de TypeScript)|
| Patrón de diseño | Singleton (`apiClient`), herencia de `Entidad` y CRUD genérico configurado por modelo |
| Ambientes | `REACT_APP_API_URL` en `.env.development` / `.env.example` |
