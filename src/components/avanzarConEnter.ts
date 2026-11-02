import type { KeyboardEvent } from 'react';

const CAMPOS = 'input:not([type=hidden]), select, textarea';

const habilitado = (el: HTMLElement) => !(el as HTMLInputElement).disabled && !(el as HTMLInputElement).readOnly;

// Enter pasa al siguiente campo del formulario y, desde el último, al botón final
// (el que tenga data-enter-final o, si no hay, el botón submit). En el botón, Enter lo aprieta.
// En un textarea, Shift+Enter agrega un salto de línea.
// Uso: <Form onKeyDown={avanzarConEnter}> o en el contenedor de la pantalla.
export const avanzarConEnter = (e: KeyboardEvent<HTMLElement>) => {
  if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
  const actual = e.target as HTMLElement;
  const contenedor = e.currentTarget;
  if (!actual.matches(CAMPOS)) return; // botones y links mantienen su comportamiento
  // Los modales (BuscadorModal) se dibujan fuera del contenedor pero su evento igual llega acá: los maneja su propio formulario.
  if (e.isDefaultPrevented() || !contenedor.contains(actual)) return;

  const campos = Array.from(contenedor.querySelectorAll<HTMLElement>(CAMPOS)).filter(habilitado);
  const radio = actual.getAttribute('type') === 'radio' ? actual.getAttribute('name') : null;
  // Los radios del mismo grupo cuentan como un solo campo.
  const siguiente = campos
    .slice(campos.indexOf(actual) + 1)
    .find((c) => !(radio && c.getAttribute('type') === 'radio' && c.getAttribute('name') === radio));
  const final = contenedor.querySelector<HTMLButtonElement>('[data-enter-final]')
    || contenedor.querySelector<HTMLButtonElement>('button[type=submit]');

  const destino = siguiente || (final && !final.disabled ? final : null);
  e.preventDefault();
  if (destino) destino.focus();
};
