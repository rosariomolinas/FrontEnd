import { API_URL } from '../config';

// Error de la API con un mensaje listo para mostrar al usuario.
export class ApiError extends Error {
  constructor(message: string, public status = 0, public errors: string[] = []) {
    super(message);
  }
}

// Forma general de las respuestas del backend: { data, message, errors? }.
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  errors?: string[];
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Query = Record<string, string | number | boolean | null | undefined>;

const queryString = (query: Query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

// Cliente HTTP único de la app (patrón Singleton): agrega el JWT, arma la URL y traduce errores.
class ApiClient {
  private token: string | null = null;

  private alExpirar: (() => void) | null = null;

  constructor(private readonly baseUrl: string) {}

  setToken(token: string | null) {
    this.token = token;
  }

  // Se llama cuando el backend responde 401 con una sesión abierta (token vencido o inválido).
  onSesionExpirada(callback: (() => void) | null) {
    this.alExpirar = callback;
  }

  private async request<T>(metodo: Metodo, path: string, body?: object, query?: Query): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}${queryString(query)}`, {
        method: metodo,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new ApiError('No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.');
    }

    let data: ApiResponse<T> | null = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401 && this.token && this.alExpirar) this.alExpirar();
      const message = (data && data.message) || `Error ${response.status} del servidor`;
      throw new ApiError(message, response.status, (data && data.errors) || []);
    }
    return data as ApiResponse<T>;
  }

  get<T>(path: string, query?: Query) {
    return this.request<T>('GET', path, undefined, query);
  }

  post<T>(path: string, body: object = {}) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: object = {}) {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body: object = {}) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}

const apiClient = new ApiClient(API_URL);
export default apiClient;
