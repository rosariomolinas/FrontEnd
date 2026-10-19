import { API_URL } from '../config';

// Error de la API con un mensaje listo para mostrar al usuario.
export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Cliente HTTP único de la app (patrón Singleton): agrega el token y traduce errores.
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async post(path, body = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    let response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new ApiError('No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.');
    }

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      const message = (data && data.message) || `Error ${response.status} del servidor`;
      throw new ApiError(message, response.status, (data && data.errors) || []);
    }
    return data;
  }
}

const apiClient = new ApiClient(API_URL);
export default apiClient;
