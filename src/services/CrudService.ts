import apiClient, { ApiError } from './apiClient';
import type Entidad from '../models/Entidad';
import type { EntidadClass } from '../models/Entidad';

export interface FiltroBusqueda {
  codigo?: string | number;
  nombre?: string;
  soloActivos?: boolean;
}

// Servicio genérico para los CRUD REST del backend (GET, POST, PUT y DELETE sobre /recurso y /recurso/:code).
// Model es la clase del modelo: convierte la respuesta en objetos y los envía con toJson.
export default class CrudService<T extends Entidad> {
  constructor(private readonly basePath: string, private readonly Model: EntidadClass<T>) {}

  private toModels(data: unknown[] | undefined): T[] {
    return (data || []).map((json) => this.Model.fromJson(json));
  }

  // todos=true pide también los dados de baja.
  private static todos(soloActivos: boolean) {
    return soloActivos ? undefined : true;
  }

  async buscarPorCodigo(code: string | number, soloActivos = true): Promise<T[]> {
    try {
      const res = await apiClient.get<unknown>(`${this.basePath}/${code}`, { todos: CrudService.todos(soloActivos) });
      return [this.Model.fromJson(res.data)];
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return [];
      throw e;
    }
  }

  async buscarPorNombre(nombre: string, soloActivos = true): Promise<T[]> {
    const res = await apiClient.get<unknown[]>(this.basePath, { nombre, todos: CrudService.todos(soloActivos) });
    return this.toModels(res.data);
  }

  async listar(soloActivos = true): Promise<T[]> {
    const res = await apiClient.get<unknown[]>(this.basePath, { todos: CrudService.todos(soloActivos) });
    return this.toModels(res.data);
  }

  // Busca por código si se indica, si no por nombre, y si no trae todos.
  buscar({ codigo, nombre, soloActivos = true }: FiltroBusqueda): Promise<T[]> {
    if (codigo) return this.buscarPorCodigo(codigo, soloActivos);
    if (nombre) return this.buscarPorNombre(nombre, soloActivos);
    return this.listar(soloActivos);
  }

  async guardar(entidad: T): Promise<T> {
    const res = entidad.code
      ? await apiClient.put<unknown>(`${this.basePath}/${entidad.code}`, entidad.toJson())
      : await apiClient.post<unknown>(this.basePath, entidad.toJson());
    return this.Model.fromJson(res.data);
  }

  async eliminar(code: number): Promise<T> {
    const res = await apiClient.delete<unknown>(`${this.basePath}/${code}`);
    return this.Model.fromJson(res.data);
  }
}
