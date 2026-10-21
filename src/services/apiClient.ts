import { API_URL } from '../config';

// Error de la API con un mensaje listo para mostrar al usuario.
export class ApiError extends Error {
  constructor(message: string, public status = 0, public errors: string[] = []) {
    super(message);
  }
}

// Forma general de las respuestas del backend.
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  errors?: string[];
  [extra: string]: unknown;
}

// Cliente HTTP único de la app (patrón Singleton): agrega el token y traduce errores.
class ApiClient {
  private token: string | null = null;

  constructor(private readonly baseUrl: string) {}

  setToken(token: string | null) {
    this.token = token;
  }

  async post<R = ApiResponse>(path: string, body: object = {}): Promise<R> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new ApiError('No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.');
    }

    let data: (ApiResponse & R) | null = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      const message = (data && data.message) || `Error ${response.status} del servidor`;
      throw new ApiError(message, response.status, (data && data.errors) || []);
    }
    return data as R;
  }
}

const apiClient = new ApiClient(API_URL);
export default apiClient;
