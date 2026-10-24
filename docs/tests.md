# Evidencia de tests – Frontend

## Unitarios (`npm test -- --watchAll=false`)

```
PASS src/components/BuscadorModal.test.tsx
  ✓ busca por nombre, muestra los resultados y devuelve el elegido
  ✓ muestra un mensaje cuando no hay coincidencias o el servidor falla
PASS src/App.test.tsx
  ✓ sin sesión muestra la pantalla de ingreso
PASS src/components/RegistrarResultado.test.tsx
  ✓ reglas del caso de uso 2
  ✓ una cancelación sin motivo no llega al servidor; con motivo, sí
PASS src/models/Intervencion.test.ts
  ✓ calcula costo y tiempo sumando las muestras de cada órgano
  ✓ informa órganos repetidos, órganos sin muestra y fecha pasada
Tests:       7 passed, 7 total
```

## End-to-end (`npm run e2e`)

Corrido contra el backend local con los datos de `npm run seed`.

```
Running 2 tests using 1 worker

  ✓  1 [chromium] › e2e/intervencion.spec.ts › un usuario carga un paciente, planifica su intervención y registra el resultado
  ✓  2 [chromium] › e2e/intervencion.spec.ts › el administrador ve sus opciones y no entra a las pantallas del perfil user

  2 passed
```

Para la entrega, reemplazar esta salida por una captura o la salida de una corrida propia.
