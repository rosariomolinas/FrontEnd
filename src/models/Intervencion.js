// Un paso de la ruta: el órgano a tratar y qué se le hace.
export class PasoRuta {
  constructor({ organo = null, mtejido = false, msangre = false, tomo3d = false, medica = 0 } = {}) {
    this.organo = organo === null ? null : Number(organo);
    this.mtejido = mtejido;
    this.msangre = msangre;
    this.tomo3d = tomo3d;
    this.medica = Number(medica) || 0;
  }

  get tieneMuestra() {
    return this.mtejido || this.msangre || this.tomo3d;
  }

  toJson() {
    return {
      organo: this.organo, mtejido: this.mtejido, msangre: this.msangre, tomo3d: this.tomo3d, medica: this.medica,
    };
  }
}

export const MAX_MEDICACIONES = 2;

export default class Intervencion {
  constructor({
    _id = null, paciente = null, doctor = null, fecint = '', costo = 0, tiempo = 0, ruta = [],
  } = {}) {
    this.id = _id;
    this.paciente = paciente;
    this.doctor = doctor;
    this.fecint = fecint;
    this.costo = costo;
    this.tiempo = tiempo;
    this.ruta = ruta.map((p) => (p instanceof PasoRuta ? p : new PasoRuta(p)));
  }

  static fromJson(json) {
    return new Intervencion(json || {});
  }

  get fecha() {
    return this.fecint ? String(this.fecint).substring(0, 10) : '';
  }

  // Reglas de negocio de la planificación. Devuelve los errores y el costo/tiempo estimados.
  // valores: costos y tiempos por tipo de muestra que manda el backend.
  presupuestar(valores, hoy = new Date()) {
    const errores = [];
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
