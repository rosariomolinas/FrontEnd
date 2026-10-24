export const PERFILES = { ADMIN: 'admin', USER: 'user' } as const;

export type Perfil = typeof PERFILES[keyof typeof PERFILES];

export interface UsuarioJson {
  _id?: string;
  id?: string;
  user?: string;
  profile?: Perfil;
  token?: string;
}

// Usuario del sistema. token es el JWT de la sesión (solo lo tiene el usuario logueado).
export default class Usuario {
  id: string;

  user: string;

  profile: Perfil | '';

  token: string;

  constructor({
    _id, id, user = '', profile, token = '',
  }: UsuarioJson = {}) {
    this.id = id ?? _id ?? '';
    this.user = user;
    this.profile = profile ?? '';
    this.token = token;
  }

  static fromJson(json: unknown): Usuario {
    return new Usuario((json || {}) as UsuarioJson);
  }

  get esAdmin(): boolean {
    return this.profile === PERFILES.ADMIN;
  }

  tienePerfil(perfiles: readonly Perfil[]): boolean {
    return this.profile !== '' && perfiles.includes(this.profile);
  }
}
