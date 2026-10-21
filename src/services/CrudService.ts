import apiClient, { ApiError, type ApiResponse } from './apiClient';
import type Entidad from '../models/Entidad';
import type { EntidadClass } from '../models/Entidad';

export interface FiltroBusqueda {
  codigo?: string | number;
  nombre?: string;
  soloActivos?: boolean;
}

type Lista = ApiResponse<unknown[]>;

// Servicio genérico para los CRUD del backend (/addnew, /findcode, /findname, ...).
// Model es la clase del modelo: convierte la respuesta en objetos y los envía con toJson.
export default class CrudService<T extends Entidad> {
  constructor(private readonly basePath: string, private readonly Model: EntidadClass<T>) {}

  private toModels(data: unknown[] | undefined): T[] {
    return (data || []).map((json) => this.Model.fromJson(json));
  }

  async buscarPorCodigo(code: string | number, soloActivos = true): Promise<T[]> {
    try {
      const res = await apiClient.post<Lista>(`${this.basePath}/findcode`, { code, activo: soloActivos });
      return this.toModels(res.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return [];
      throw e;
    }
  }

  async buscarPorNombre(nombre: string, soloActivos = true): Promise<T[]> {
    const res = await apiClient.post<Lista>(`${this.basePath}/findname`, { nombre, activo: soloActivos });
    return this.toModels(res.data);
  }

  async listar(soloActivos = true): Promise<T[]> {
    const res = await apiClient.post<Lista>(`${this.basePath}/findall`, { activo: soloActivos });
    return this.toModels(res.data);
  }

  // Busca por código si se indica, si no por nombre, y si no trae todos.
  buscar({ codigo, nombre, soloActivos = true }: FiltroBusqueda): Promise<T[]> {
    if (codigo) return this.buscarPorCodigo(codigo, soloActivos);
    if (nombre) return this.buscarPorNombre(nombre, soloActivos);
    return this.listar(soloActivos);
  }

  async guardar(entidad: T): Promise<T> {
    const path = entidad.code ? 'update' : 'addnew';
    const res = await apiClient.post<Lista>(`${this.basePath}/${path}`, entidad.toJson());
    return this.Model.fromJson(res.data[0]);
  }

  async eliminar(code: number): Promise<T> {
    const res = await apiClient.post<Lista>(`${this.basePath}/remove`, { code });
    return this.Model.fromJson(res.data[0]);
  }
}
