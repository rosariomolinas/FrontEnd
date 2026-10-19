import { Navigate } from 'react-router-dom';

// Deja pasar solo si el usuario tiene alguno de los perfiles indicados.
function RutaProtegida({ usuario, perfiles, children }) {
  if (!usuario) return <Navigate to="/" replace />;
  if (perfiles && !usuario.tienePerfil(perfiles)) return <Navigate to="/" replace />;
  return children;
}

export default RutaProtegida;
