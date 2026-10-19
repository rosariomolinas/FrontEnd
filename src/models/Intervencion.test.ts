import Intervencion from './Intervencion';

const valores = {
  tejido_costo: 100, sangre_costo: 50, tomo3d_costo: 200, tejido_tiempo: 10, sangre_tiempo: 5, tomo3d_tiempo: 20,
};
const hoy = new Date('2026-10-01');

test('calcula costo y tiempo sumando las muestras de cada órgano', () => {
  const interv = new Intervencion({
    paciente: 1,
    doctor: 1,
    fecint: '2026-11-01',
    ruta: [{ organo: 1, mtejido: true, msangre: true }, { organo: 2, tomo3d: true }],
  });
  expect(interv.presupuestar(valores, hoy)).toEqual({ errores: [], costo: 350, tiempo: 35 });
});

test('informa órganos repetidos, órganos sin muestra y fecha pasada', () => {
  const interv = new Intervencion({
    paciente: 1,
    doctor: 1,
    fecint: '2026-09-01',
    ruta: [{ organo: 1, mtejido: true }, { organo: 1 }],
  });
  expect(interv.presupuestar(valores, hoy).errores).toEqual([
    'La fecha de la intervención debe ser futura',
    'Hay órganos repetidos en la ruta',
    'Cada órgano de la ruta necesita al menos una muestra',
  ]);
});
