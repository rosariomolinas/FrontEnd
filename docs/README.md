# Documentación del TP – Robiotics

La documentación completa del TP (propuesta, API, minutas y gestión) está en el repositorio del backend:

- [Propuesta](https://github.com/rosariomolinas/BackEnd/blob/main/docs/proposal.md)
- [API](https://github.com/rosariomolinas/BackEnd/blob/main/docs/api.md)
- [Minutas](https://github.com/rosariomolinas/BackEnd/blob/main/docs/minutas.md)
- [Gestión del proyecto](https://github.com/rosariomolinas/BackEnd/blob/main/docs/gestion.md)

## Frontend

| Requisito | Dónde está |
|:-|:-|
| Framework y librería de componentes | React 18 + React-Bootstrap (`package.json`) |
| Mobile-first, breakpoints SM / MD / LG | `src/index.css` y grilla de Bootstrap (`xs`, `sm`, `md`, `lg`) en las pantallas |
| Eventos de usuario | formularios y botones de `src/pages` y `src/components` |
| Manejo de errores amigable | `ApiClient` traduce los errores a mensajes; `ListaErrores` y `Aviso` los muestran |
| Reactividad ante un estado | `useState` / `useEffect` en todas las pantallas |
| Input property | por ejemplo `CrudPage` (`titulo`, `service`, `Model`) y `BuscadorModal` (`service`, `show`) |
| Output property | por ejemplo `BuscadorModal.onSelect`, `Login.onLogin`, `NavBar.onLogout` |
| Servicio | `src/services/apiClient.js`, `src/services/CrudService.js`, `src/services/index.js` |
| Modelos con clases | `src/models/` |
| Patrón de diseño | Singleton (`apiClient`), herencia de `Entidad` y CRUD genérico configurado por modelo |
| Ambientes | `REACT_APP_API_URL` en `.env.development` / `.env.example` |
