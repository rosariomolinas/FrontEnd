export default class Medicamento {
  constructor({ code = 0, nombre = '' } = {}) {
    this.code = code;
    this.nombre = nombre;
  }

  static fromJson(json) {
    return new Medicamento(json || {});
  }
}
