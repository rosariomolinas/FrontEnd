import Entidad, { type CampoDef, type EntidadJson } from './Entidad';

export default class Paciente extends Entidad {
  static campos: CampoDef[] = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
    { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text', requerido: true },
    {
      nombre: 'edad', etiqueta: 'Edad', tipo: 'number', requerido: true, min: 0, max: 130,
    },
  ];

  nombre: string;

  apellido: string;

  edad: number | string;

  constructor(json: EntidadJson = {}) {
    super(json);
    this.nombre = (json.nombre as string) ?? '';
    this.apellido = (json.apellido as string) ?? '';
    this.edad = (json.edad as number | string) ?? '';
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }
}
