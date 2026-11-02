import type { TipoMuestra } from './Organo';

export interface PasoRutaJson {
  organo?: number | null;
  mtejido?: boolean;
  msangre?: boolean;
  tomo3d?: boolean;
  medica?: number;
}

// Un paso de la ruta: el órgano a tratar, qué muestras se toman y qué medicación (code, 0 = ninguna).
export class PasoRuta {
  organo: number | null;

  mtejido: boolean;

  msangre: boolean;

  tomo3d: boolean;

  medica: number;

  constructor({
    organo = null, mtejido = false, msangre = false, tomo3d = false, medica = 0,
  }: PasoRutaJson = {}) {
    this.organo = organo === null ? null : Number(organo);
    this.mtejido = mtejido;
    this.msangre = msangre;
    this.tomo3d = tomo3d;
    this.medica = Number(medica) || 0;
  }

  get tieneMuestra(): boolean {
    return this.mtejido || this.msangre || this.tomo3d;
  }

  tiene(muestra: TipoMuestra): boolean {
    return this[muestra];
  }

  toJson(): Required<PasoRutaJson> {
    return {
      organo: this.organo, mtejido: this.mtejido, msangre: this.msangre, tomo3d: this.tomo3d, medica: this.medica,
    };
  }
}

// Costos y tiempos por tipo de muestra (vienen del backend).
export interface ValoresMuestras {
  tejido_costo: number;
  sangre_costo: number;
  tomo3d_costo: number;
  tejido_tiempo: number;
  sangre_tiempo: number;
  tomo3d_tiempo: number;
}

export interface Presupuesto {
  errores: string[];
  costo: number;
  tiempo: number;
}

export const ESTADOS = ['planificada', 'realizada', 'cancelada'] as const;
export type Estado = typeof ESTADOS[number];

// Lo que se registra al cerrar una intervención (caso de uso "Registrar resultado").
export interface Resultado {
  fecha: string;
  tiempoReal?: number;
  observaciones?: string;
  usuario: string;
}

export interface IntervencionJson {
  _id?: string | null;
  paciente?: number | null;
  doctor?: number | null;
  fecint?: string;
  costo?: number;
  tiempo?: number;
  ruta?: (PasoRuta | PasoRutaJson)[];
  estado?: Estado;
  resultado?: Resultado | null;
}

export const MAX_MEDICACIONES = 2;

export default class Intervencion {
  id: string | null;

  paciente: number | null;

  doctor: number | null;

  fecint: string;

  costo: number;

  tiempo: number;

  ruta: PasoRuta[];

  estado: Estado;

  resultado: Resultado | null;

  constructor({
    _id = null, paciente = null, doctor = null, fecint = '', costo = 0, tiempo = 0, ruta = [],
    estado = 'planificada', resultado = null,
  }: IntervencionJson = {}) {
    this.id = _id;
    this.paciente = paciente;
    this.doctor = doctor;
    this.fecint = fecint;
    this.costo = costo;
    this.tiempo = tiempo;
    this.ruta = ruta.map((p) => (p instanceof PasoRuta ? p : new PasoRuta(p)));
    this.estado = estado;
    this.resultado = resultado;
  }

  static fromJson(json: unknown): Intervencion {
    return new Intervencion((json || {}) as IntervencionJson);
  }

  get fecha(): string {
    return this.fecint ? String(this.fecint).substring(0, 10) : '';
  }

  // Solo una intervención planificada se puede modificar, eliminar o cerrar con un resultado.
  get abierta(): boolean {
    return this.estado === 'planificada';
  }

  // Reglas de negocio de la planificación. Devuelve los errores y el costo/tiempo estimados.
  presupuestar(valores: ValoresMuestras, hoy = new Date()): Presupuesto {
    const errores: string[] = [];
    if (!this.paciente) errores.push('Seleccioná un paciente');
    if (!this.doctor) errores.push('Seleccioná un médico');
    if (!this.fecint) errores.push('Ingresá la fecha de la intervención');
    else if (!(new Date(this.fecint) > hoy)) errores.push('La fecha de la intervención debe ser futura');
    if (this.ruta.length === 0) errores.push('Agregá al menos un órgano a la ruta');

    const organos = this.ruta.map((p) => p.organo);
    if (new Set(organos).size !== organos.length) errores.push('Hay órganos repetidos en la ruta');
    if (this.ruta.some((p) => !p.tieneMuestra)) errores.push('Cada órgano de la ruta necesita al menos una muestra');
    if (this.ruta.filter((p) => p.medica).length > MAX_MEDICACIONES) {
      errores.push(`No se pueden indicar más de ${MAX_MEDICACIONES} medicaciones`);
    }

    let costo = 0;
    let tiempo = 0;
    this.ruta.forEach((p) => {
      if (p.mtejido) { costo += valores.tejido_costo; tiempo += valores.tejido_tiempo; }
      if (p.msangre) { costo += valores.sangre_costo; tiempo += valores.sangre_tiempo; }
      if (p.tomo3d) { costo += valores.tomo3d_costo; tiempo += valores.tomo3d_tiempo; }
    });
    return { errores, costo, tiempo };
  }

  toJson() {
    return {
      paciente: this.paciente,
      doctor: this.doctor,
      fecint: this.fecint,
      costo: this.costo,
      tiempo: this.tiempo,
      ruta: this.ruta.map((p) => p.toJson()),
    };
  }
}
