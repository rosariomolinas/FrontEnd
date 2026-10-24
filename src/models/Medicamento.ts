import Entidad, { type CampoDef, type EntidadJson } from './Entidad';

export default class Medicamento extends Entidad {
  static campos: CampoDef[] = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
  ];

  nombre: string;

  constructor(json: EntidadJson = {}) {
    super(json);
    this.nombre = (json.nombre as string) ?? '';
  }

  get nombreCompleto(): string {
    return this.nombre;
  }
}
