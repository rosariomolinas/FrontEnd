// Clase base de las entidades de negocio con código correlativo y baja lógica.
// Cada subclase define `static campos`: lo que usa CrudPage para armar el formulario.
export default class Entidad {
  constructor({ code = null, activo = true } = {}) {
    this.code = code;
    this.activo = activo;
  }

  static fromJson(json) {
    return new this(json || {});
  }

  // Valida los campos según `static campos` y devuelve la lista de errores.
  validar() {
    const errores = [];
    this.constructor.campos.forEach(({ nombre, etiqueta, tipo, requerido, min, max }) => {
      const valor = this[nombre];
      const vacio = valor === '' || valor === null || valor === undefined;
      if (requerido && vacio) {
        errores.push(`${etiqueta} es obligatorio`);
        return;
      }
      if (tipo === 'number' && !vacio) {
        const n = Number(valor);
        if (!Number.isInteger(n)) errores.push(`${etiqueta} debe ser un número entero`);
        else if (min !== undefined && n < min) errores.push(`${etiqueta} debe ser mayor o igual a ${min}`);
        else if (max !== undefined && n > max) errores.push(`${etiqueta} debe ser menor o igual a ${max}`);
      }
    });
    return errores;
  }

  // Cuerpo que se envía al backend: solo los campos editables (y el código si existe).
  toJson() {
    const json = this.code ? { code: this.code } : {};
    this.constructor.campos.forEach(({ nombre, tipo }) => {
      const valor = this[nombre];
      if (tipo === 'number') json[nombre] = valor === '' || valor === null ? undefined : Number(valor);
      else if (tipo === 'checkbox') json[nombre] = Boolean(valor);
      else json[nombre] = typeof valor === 'string' ? valor.trim() : valor;
    });
    return json;
  }

  // Devuelve una copia con un campo modificado (los componentes trabajan con estado inmutable).
  con(campo, valor) {
    return new this.constructor({ ...this, [campo]: valor });
  }
}
