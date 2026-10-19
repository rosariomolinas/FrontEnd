export interface MedicamentoJson {
  code?: number;
  nombre?: string;
}

export default class Medicamento {
  code: number;

  nombre: string;

  constructor({ code = 0, nombre = '' }: MedicamentoJson = {}) {
    this.code = code;
    this.nombre = nombre;
  }

  static fromJson(json: unknown): Medicamento {
    return new Medicamento((json || {}) as MedicamentoJson);
  }
}
