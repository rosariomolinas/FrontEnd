import CrudService from './CrudService';
import apiClient from './apiClient';
import Paciente from '../models/Paciente';
import Doctor from '../models/Doctor';
import Organo from '../models/Organo';
import Medicamento from '../models/Medicamento';
import Intervencion from '../models/Intervencion';
import Usuario from '../models/Usuario';

export const pacienteService = new CrudService('/pac', Paciente);
export const doctorService = new CrudService('/doctor', Doctor);
export const organoService = new CrudService('/org', Organo);

export const medicamentoService = {
  async listar() {
    const data = await apiClient.post('/medica/traertodos');
    return (data || []).map(Medicamento.fromJson);
  },
};

export const intervencionService = {
  // Órganos activos + costos y tiempos por tipo de muestra.
  async datosParaPlanificar() {
    const data = await apiClient.post('/org/traertodos');
    return { organos: data.lista.map((o) => Organo.fromJson(o)), valores: data.valores };
  },

  async guardar(intervencion) {
    const res = await apiClient.post('/interv/addnew', intervencion.toJson());
    return Intervencion.fromJson(res.data[0]);
  },

  async buscar({ paciente, doctor, desde, hasta }) {
    const filtro = {};
    if (paciente) filtro.paciente = paciente;
    if (doctor) filtro.doctor = doctor;
    if (desde) filtro.fecdes = desde;
    if (hasta) filtro.fechas = hasta;
    const res = await apiClient.post('/interv/traeralgunos', filtro);
    return { intervenciones: res.data.map(Intervencion.fromJson), mensaje: res.message };
  },
};

const SESSION_KEY = 'robiotics.sesion';

export const authService = {
  async login(user, password) {
    const data = await apiClient.post('/usuarios/validar', { user, password });
    const usuario = new Usuario({ user: data.user || user, profile: data.profile, token: data.token });
    this.guardarSesion(usuario);
    return usuario;
  },

  async logout() {
    try {
      await apiClient.post('/usuarios/logout');
    } finally {
      this.guardarSesion(null);
    }
  },

  async cambiarPassword(user, passwordold, passwordnew) {
    const data = await apiClient.post('/usuarios/pwdUpdate', { user, passwordold, passwordnew });
    return data.message;
  },

  guardarSesion(usuario) {
    apiClient.setToken(usuario ? usuario.token : null);
    try {
      if (usuario) sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      // sessionStorage no disponible: la sesión dura hasta recargar.
    }
  },

  // Recupera la sesión guardada (sobrevive a recargar la página).
  sesionGuardada() {
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
