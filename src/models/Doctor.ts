import Entidad, { type CampoDef, type EntidadJson } from './Entidad';

export default class Doctor extends Entidad {
  static campos: CampoDef[] = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
    { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text', requerido: true },
    {
      nombre: 'matricula', etiqueta: 'Matrícula', tipo: 'number', requerido: true, min: 1,
    },
  ];

  nombre: string;

  apellido: string;

  matricula: number | string;

  constructor(json: EntidadJson = {}) {
    super(json);
    this.nombre = (json.nombre as string) ?? '';
    this.apellido = (json.apellido as string) ?? '';
    this.matricula = (json.matricula as number | string) ?? '';
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }
}
