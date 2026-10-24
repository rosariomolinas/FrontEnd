import { useEffect, useState, type ComponentType } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavBar from './components/NavBar';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Pacientes from './pages/Pacientes';
import Doctores from './pages/Doctores';
import Organos from './pages/Organos';
import Medicamentos from './pages/Medicamentos';
import IntervNueva from './pages/IntervNueva';
import IntervBuscar from './pages/IntervBuscar';
import Usuarios from './pages/Usuarios';
import CambiarPassword from './pages/CambiarPassword';
import { authService } from './services';
import { perfilesDe } from './rutas';
import { PERFILES } from './models/Usuario';
import type Usuario from './models/Usuario';

type Pagina = ComponentType<{ usuario: Usuario }>;

const PAGINAS: [string, Pagina][] = [
  ['/pacientes', Pacientes],
  ['/doctores', Doctores],
  ['/organos', Organos],
  ['/medicamentos', Medicamentos],
  ['/intervnueva', IntervNueva],
  ['/intervbuscar', IntervBuscar],
  ['/usuarios', Usuarios],
];

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => authService.sesionGuardada());
  const [aviso, setAviso] = useState('');

  // Si el backend rechaza el token (por ejemplo, porque venció) se vuelve al login.
  useEffect(() => {
    authService.alExpirarSesion(() => {
      setUsuario(null);
      setAviso('Tu sesión expiró. Volvé a ingresar.');
    });
  }, []);

  const login = (u: Usuario) => {
    setAviso('');
    setUsuario(u);
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  if (!usuario) return <Login onLogin={login} aviso={aviso} />;

  return (
    <>
      <NavBar usuario={usuario} onLogout={logout} />
      <Container as="main" className="pb-5">
        <Routes>
          <Route path="/" element={<Inicio usuario={usuario} />} />
          {PAGINAS.map(([path, Componente]) => (
            <Route
              key={path}
              path={path}
              element={<RutaProtegida usuario={usuario} perfiles={perfilesDe(path)}><Componente usuario={usuario} /></RutaProtegida>}
            />
          ))}
          <Route
            path="/intervenciones/:id"
            element={<RutaProtegida usuario={usuario} perfiles={[PERFILES.USER]}><IntervNueva key="modificar" /></RutaProtegida>}
          />
          <Route path="/passchange" element={<CambiarPassword usuario={usuario} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
