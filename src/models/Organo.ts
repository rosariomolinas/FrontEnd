import Entidad, { type CampoDef, type EntidadJson } from './Entidad';

export type TipoMuestra = 'mtejido' | 'msangre' | 'tomo3d';

export default class Organo extends Entidad {
  static campos: CampoDef[] = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
    {
      nombre: 'orden', etiqueta: 'Orden', tipo: 'number', min: 0,
    },
    { nombre: 'mtejido', etiqueta: 'Admite muestra de tejido', tipo: 'checkbox' },
    { nombre: 'msangre', etiqueta: 'Admite muestra de sangre', tipo: 'checkbox' },
    { nombre: 'tomo3d', etiqueta: 'Admite tomografía 3D', tipo: 'checkbox' },
    { nombre: 'medica', etiqueta: 'Admite medicación', tipo: 'checkbox' },
  ];

  nombre: string;

  orden: number | string;

  mtejido: boolean;

  msangre: boolean;

  tomo3d: boolean;

  medica: boolean;

  constructor(json: EntidadJson = {}) {
    super(json);
    this.nombre = (json.nombre as string) ?? '';
    this.orden = (json.orden as number | string) ?? '';
    this.mtejido = Boolean(json.mtejido);
    this.msangre = Boolean(json.msangre);
    this.tomo3d = Boolean(json.tomo3d);
    this.medica = Boolean(json.medica);
  }

  get nombreCompleto(): string {
    return this.nombre;
  }

  admite(muestra: TipoMuestra): boolean {
    return this[muestra];
  }
}
