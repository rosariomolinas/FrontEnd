import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import type Usuario from '../models/Usuario';
import type { Perfil } from '../models/Usuario';

// Deja pasar solo si el usuario tiene alguno de los perfiles indicados.
function RutaProtegida({ usuario, perfiles, children }: {
  usuario: Usuario | null;
  perfiles?: Perfil[];
  children: ReactElement;
}) {
  if (!usuario) return <Navigate to="/" replace />;
  if (perfiles && !usuario.tienePerfil(perfiles)) return <Navigate to="/" replace />;
  return children;
}

export default RutaProtegida;
