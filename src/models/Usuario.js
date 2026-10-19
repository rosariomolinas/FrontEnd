export const PERFILES = { ADMIN: 'admin', USER: 'user' };

export default class Usuario {
  constructor({ user = '', profile = '', token = '' } = {}) {
    this.user = user;
    this.profile = profile;
    this.token = token;
  }

  get esAdmin() {
    return this.profile === PERFILES.ADMIN;
  }

  tienePerfil(perfiles) {
    return perfiles.includes(this.profile);
  }
}
