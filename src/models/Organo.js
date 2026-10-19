import Entidad from './Entidad';

export default class Organo extends Entidad {
  static campos = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
    { nombre: 'orden', etiqueta: 'Orden', tipo: 'number', min: 0 },
    { nombre: 'mtejido', etiqueta: 'Admite muestra de tejido', tipo: 'checkbox' },
    { nombre: 'msangre', etiqueta: 'Admite muestra de sangre', tipo: 'checkbox' },
    { nombre: 'tomo3d', etiqueta: 'Admite tomografía 3D', tipo: 'checkbox' },
    { nombre: 'medica', etiqueta: 'Admite medicación', tipo: 'checkbox' },
  ];

  constructor({
    nombre = '', orden = '', mtejido = false, msangre = false, tomo3d = false, medica = false, ...base
  } = {}) {
    super(base);
    this.nombre = nombre;
    this.orden = orden ?? '';
    this.mtejido = mtejido;
    this.msangre = msangre;
    this.tomo3d = tomo3d;
    this.medica = medica;
  }

  get nombreCompleto() {
    return this.nombre;
  }
}
