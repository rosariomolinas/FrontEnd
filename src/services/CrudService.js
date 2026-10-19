import apiClient from './apiClient';

// Servicio genérico para los CRUD del backend (/addnew, /findcode, /findname, ...).
// Model es la clase del modelo: convierte la respuesta en objetos con fromJson y los envía con toJson.
export default class CrudService {
  constructor(basePath, Model) {
    this.basePath = basePath;
    this.Model = Model;
  }

  toModels(data) {
    return (data || []).map((json) => this.Model.fromJson(json));
  }

  async buscarPorCodigo(code, soloActivos = true) {
    try {
      const res = await apiClient.post(`${this.basePath}/findcode`, { code, activo: soloActivos });
      return this.toModels(res.data);
    } catch (e) {
      if (e.status === 404) return [];
      throw e;
    }
  }

  async buscarPorNombre(nombre, soloActivos = true) {
    const res = await apiClient.post(`${this.basePath}/findname`, { nombre, activo: soloActivos });
    return this.toModels(res.data);
  }

  async listar(soloActivos = true) {
    const res = await apiClient.post(`${this.basePath}/findall`, { activo: soloActivos });
    return this.toModels(res.data);
  }

  // Busca por código si se indica, si no por nombre, y si no trae todos.
  buscar({ codigo, nombre, soloActivos = true }) {
    if (codigo) return this.buscarPorCodigo(codigo, soloActivos);
    if (nombre) return this.buscarPorNombre(nombre, soloActivos);
    return this.listar(soloActivos);
  }

  async guardar(entidad) {
    const path = entidad.code ? 'update' : 'addnew';
    const res = await apiClient.post(`${this.basePath}/${path}`, entidad.toJson());
    return this.Model.fromJson(res.data[0]);
  }

  async eliminar(code) {
    const res = await apiClient.post(`${this.basePath}/remove`, { code });
    return this.Model.fromJson(res.data[0]);
  }
}
