import Entidad from './Entidad';

export default class Doctor extends Entidad {
  static campos = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
    { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text', requerido: true },
    { nombre: 'matricula', etiqueta: 'Matrícula', tipo: 'number', requerido: true, min: 1 },
  ];

  constructor({ nombre = '', apellido = '', matricula = '', ...base } = {}) {
    super(base);
    this.nombre = nombre;
    this.apellido = apellido;
    this.matricula = matricula;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`.trim();
  }
}
