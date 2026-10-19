export type TipoCampo = 'text' | 'number' | 'checkbox';

// Describe un campo editable: lo usa CrudPage para armar el formulario y Entidad para validar.
export interface CampoDef {
  nombre: string;
  etiqueta: string;
  tipo: TipoCampo;
  requerido?: boolean;
  min?: number;
  max?: number;
}

export type Json = Record<string, unknown>;

export interface EntidadJson extends Json {
  code?: number | null;
  activo?: boolean;
}

// Clase de una entidad concreta (Paciente, Doctor, Organo): constructor + metadatos de campos.
export interface EntidadClass<T extends Entidad> {
  new (json?: EntidadJson): T;
  campos: CampoDef[];
  fromJson(json: unknown): T;
}

// Clase base de las entidades de negocio con código correlativo y baja lógica.
export default abstract class Entidad {
  static campos: CampoDef[] = [];

  code: number | null;

  activo: boolean;

  constructor({ code = null, activo = true }: EntidadJson = {}) {
    this.code = code;
    this.activo = activo;
  }

  abstract get nombreCompleto(): string;

  static fromJson<T extends Entidad>(this: new (json?: EntidadJson) => T, json: unknown): T {
    return new this((json || {}) as EntidadJson);
  }

  private get campos(): CampoDef[] {
    return (this.constructor as typeof Entidad).campos;
  }

  // Lectura genérica de un campo por nombre (para formularios).
  valor(campo: string): unknown {
    return (this as unknown as Json)[campo];
  }

  // Valida los campos según `static campos` y devuelve la lista de errores.
  validar(): string[] {
    const errores: string[] = [];
    this.campos.forEach(({
      nombre, etiqueta, tipo, requerido, min, max,
    }) => {
      const valor = this.valor(nombre);
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
  toJson(): Json {
    const json: Json = this.code ? { code: this.code } : {};
    this.campos.forEach(({ nombre, tipo }) => {
      const valor = this.valor(nombre);
      if (tipo === 'number') json[nombre] = valor === '' || valor === null ? undefined : Number(valor);
      else if (tipo === 'checkbox') json[nombre] = Boolean(valor);
      else json[nombre] = typeof valor === 'string' ? valor.trim() : valor;
    });
    return json;
  }

  // Devuelve una copia con un campo modificado (los componentes trabajan con estado inmutable).
  con(campo: string, valor: unknown): this {
    const Clase = this.constructor as new (json: EntidadJson) => this;
    return new Clase({ ...(this as unknown as Json), [campo]: valor });
  }
}
