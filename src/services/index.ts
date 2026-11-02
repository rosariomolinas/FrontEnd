import CrudService from './CrudService';
import apiClient from './apiClient';
import Paciente from '../models/Paciente';
import Doctor from '../models/Doctor';
import Organo from '../models/Organo';
import Medicamento from '../models/Medicamento';
import Intervencion, { type Estado, type ValoresMuestras } from '../models/Intervencion';
import Usuario, { type Perfil } from '../models/Usuario';

export const pacienteService = new CrudService<Paciente>('/pacientes', Paciente);
export const doctorService = new CrudService<Doctor>('/doctores', Doctor);
export const organoService = new CrudService<Organo>('/organos', Organo);
export const medicamentoService = new CrudService<Medicamento>('/medicamentos', Medicamento);

export interface FiltroIntervenciones {
  paciente?: number | null;
  doctor?: number | null;
  desde?: string;
  hasta?: string;
  estado?: Estado | '';
}

export interface DatosResultado {
  estado: Exclude<Estado, 'planificada'>;
  fecha?: string;
  tiempoReal?: number;
  observaciones?: string;
}

export const intervencionService = {
  // Órganos activos + costos y tiempos por tipo de muestra.
  async datosParaPlanificar(): Promise<{ organos: Organo[]; valores: ValoresMuestras }> {
    const res = await apiClient.get<{ organos: unknown[]; valores: ValoresMuestras }>('/intervenciones/planificacion');
    return { organos: res.data.organos.map((o) => Organo.fromJson(o)), valores: res.data.valores };
  },

  async obtener(id: string): Promise<Intervencion> {
    const res = await apiClient.get<unknown>(`/intervenciones/${id}`);
    return Intervencion.fromJson(res.data);
  },

  // Alta si es nueva, modificación si ya tiene id.
  async guardar(intervencion: Intervencion): Promise<Intervencion> {
    const res = intervencion.id
      ? await apiClient.put<unknown>(`/intervenciones/${intervencion.id}`, intervencion.toJson())
      : await apiClient.post<unknown>('/intervenciones', intervencion.toJson());
    return Intervencion.fromJson(res.data);
  },

  async eliminar(id: string): Promise<void> {
    await apiClient.delete(`/intervenciones/${id}`);
  },

  // Caso de uso 2: marcar la intervención como realizada o cancelada.
  async registrarResultado(id: string, datos: DatosResultado): Promise<Intervencion> {
    const res = await apiClient.patch<unknown>(`/intervenciones/${id}/resultado`, datos);
    return Intervencion.fromJson(res.data);
  },

  async buscar(filtro: FiltroIntervenciones): Promise<{ intervenciones: Intervencion[]; mensaje: string }> {
    const res = await apiClient.get<unknown[]>('/intervenciones', { ...filtro });
    return { intervenciones: res.data.map(Intervencion.fromJson), mensaje: res.message || '' };
  },
};

// ABM de usuarios (solo administradores).
export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    const res = await apiClient.get<unknown[]>('/usuarios');
    return res.data.map(Usuario.fromJson);
  },

  async crear(user: string, password: string, profile: Perfil): Promise<Usuario> {
    const res = await apiClient.post<unknown>('/usuarios', { user, password, profile });
    return Usuario.fromJson(res.data);
  },

  // password vacío = no se cambia.
  async actualizar(id: string, profile: Perfil, password = ''): Promise<Usuario> {
    const res = await apiClient.put<unknown>(`/usuarios/${id}`, password ? { profile, password } : { profile });
    return Usuario.fromJson(res.data);
  },

  async eliminar(id: string): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`);
  },
};

const SESSION_KEY = 'robiotics.sesion';

interface LoginResponse {
  token: string;
  id: string;
  user: string;
  profile: Perfil;
}

export const authService = {
  async login(user: string, password: string): Promise<Usuario> {
    const res = await apiClient.post<LoginResponse>('/auth/login', { user, password });
    const usuario = new Usuario(res.data);
    authService.guardarSesion(usuario);
    return usuario;
  },

  // El JWT no se guarda en el servidor: cerrar sesión es olvidarlo.
  logout(): void {
    authService.guardarSesion(null);
  },

  async cambiarPassword(passwordActual: string, passwordNueva: string): Promise<string> {
    const res = await apiClient.put('/auth/password', { passwordActual, passwordNueva });
    return res.message || 'Contraseña actualizada';
  },

  guardarSesion(usuario: Usuario | null): void {
    apiClient.setToken(usuario ? usuario.token : null);
    try {
      if (usuario) sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      // sessionStorage no disponible: la sesión dura hasta recargar.
    }
  },

  // Recupera la sesión guardada (sobrevive a recargar la página).
  sesionGuardada(): Usuario | null {
    try {
      const json = sessionStorage.getItem(SESSION_KEY);
      if (!json) return null;
      const usuario = new Usuario(JSON.parse(json));
      apiClient.setToken(usuario.token);
      return usuario;
    } catch (e) {
      return null;
    }
  },

  // Cuando el backend rechaza el token (vencido), se cierra la sesión y se avisa a la app.
  alExpirarSesion(callback: () => void): void {
    apiClient.onSesionExpirada(() => {
      authService.guardarSesion(null);
      callback();
    });
  },
};
