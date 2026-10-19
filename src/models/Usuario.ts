export const PERFILES = { ADMIN: 'admin', USER: 'user' } as const;

export type Perfil = typeof PERFILES[keyof typeof PERFILES];

export interface UsuarioJson {
  user?: string;
  profile?: Perfil;
  token?: string;
}

export default class Usuario {
  user: string;

  profile: Perfil | '';

  token: string;

  constructor({ user = '', profile, token = '' }: UsuarioJson = {}) {
    this.user = user;
    this.profile = profile ?? '';
    this.token = token;
  }

  get esAdmin(): boolean {
    return this.profile === PERFILES.ADMIN;
  }

  tienePerfil(perfiles: readonly Perfil[]): boolean {
    return this.profile !== '' && perfiles.includes(this.profile);
  }
}
