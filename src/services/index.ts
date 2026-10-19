import CrudService from './CrudService';
import apiClient, { type ApiResponse } from './apiClient';
import Paciente from '../models/Paciente';
import Doctor from '../models/Doctor';
import Organo from '../models/Organo';
import Medicamento from '../models/Medicamento';
import Intervencion, { type ValoresMuestras } from '../models/Intervencion';
import Usuario, { type Perfil } from '../models/Usuario';

export const pacienteService = new CrudService<Paciente>('/pac', Paciente);
export const doctorService = new CrudService<Doctor>('/doctor', Doctor);
export const organoService = new CrudService<Organo>('/org', Organo);

export const medicamentoService = {
  async listar(): Promise<Medicamento[]> {
    const data = await apiClient.post<unknown[]>('/medica/traertodos');
    return (data || []).map(Medicamento.fromJson);
  },
};

export interface FiltroIntervenciones {
  paciente?: number | null;
  doctor?: number | null;
  desde?: string;
  hasta?: string;
}

export const intervencionService = {
  // Órganos activos + costos y tiempos por tipo de muestra.
  async datosParaPlanificar(): Promise<{ organos: Organo[]; valores: ValoresMuestras }> {
    const data = await apiClient.post<{ lista: unknown[]; valores: ValoresMuestras }>('/org/traertodos');
    return { organos: data.lista.map((o) => Organo.fromJson(o)), valores: data.valores };
  },

  async guardar(intervencion: Intervencion): Promise<Intervencion> {
    const res = await apiClient.post<ApiResponse<unknown[]>>('/interv/addnew', intervencion.toJson());
    return Intervencion.fromJson(res.data[0]);
  },

  async buscar({
    paciente, doctor, desde, hasta,
  }: FiltroIntervenciones): Promise<{ intervenciones: Intervencion[]; mensaje: string }> {
    const filtro: Record<string, unknown> = {};
    if (paciente) filtro.paciente = paciente;
    if (doctor) filtro.doctor = doctor;
    if (desde) filtro.fecdes = desde;
    if (hasta) filtro.fechas = hasta;
    const res = await apiClient.post<ApiResponse<unknown[]>>('/interv/traeralgunos', filtro);
    return { intervenciones: res.data.map(Intervencion.fromJson), mensaje: res.message || '' };
  },
};

const SESSION_KEY = 'robiotics.sesion';

interface LoginResponse {
  token: string;
  user?: string;
  profile: Perfil;
}

export const authService = {
  async login(user: string, password: string): Promise<Usuario> {
    const data = await apiClient.post<LoginResponse>('/usuarios/validar', { user, password });
    const usuario = new Usuario({ user: data.user || user, profile: data.profile, token: data.token });
    authService.guardarSesion(usuario);
    return usuario;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/usuarios/logout');
    } finally {
      authService.guardarSesion(null);
    }
  },

  async cambiarPassword(user: string, passwordold: string, passwordnew: string): Promise<string> {
    const data = await apiClient.post<ApiResponse>('/usuarios/pwdUpdate', { user, passwordold, passwordnew });
    return data.message || 'Contraseña actualizada';
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
};
