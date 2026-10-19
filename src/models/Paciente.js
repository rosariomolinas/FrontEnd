import Entidad from './Entidad';

export default class Paciente extends Entidad {
  static campos = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
    { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text', requerido: true },
    { nombre: 'edad', etiqueta: 'Edad', tipo: 'number', requerido: true, min: 0, max: 130 },
  ];

  constructor({ nombre = '', apellido = '', edad = '', ...base } = {}) {
    super(base);
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`.trim();
  }
}
