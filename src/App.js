import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavBar from './components/NavBar';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Pacientes from './pages/Pacientes';
import Doctores from './pages/Doctores';
import Organos from './pages/Organos';
import IntervNueva from './pages/IntervNueva';
import IntervBuscar from './pages/IntervBuscar';
import CambiarPassword from './pages/CambiarPassword';
import { authService } from './services';
import { perfilesDe } from './rutas';

const PAGINAS = [
  ['/pacientes', Pacientes],
  ['/doctores', Doctores],
  ['/organos', Organos],
  ['/intervnueva', IntervNueva],
  ['/intervbuscar', IntervBuscar],
];

function App() {
  const [usuario, setUsuario] = useState(() => authService.sesionGuardada());

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUsuario(null);
    }
  };

  if (!usuario) return <Login onLogin={setUsuario} />;

  return (
    <>
      <NavBar usuario={usuario} onLogout={logout} />
      <Container as="main" className="pb-5">
        <Routes>
          <Route path="/" element={<Inicio usuario={usuario} />} />
          {PAGINAS.map(([path, Pagina]) => (
            <Route
              key={path}
              path={path}
              element={<RutaProtegida usuario={usuario} perfiles={perfilesDe(path)}><Pagina /></RutaProtegida>}
            />
          ))}
          <Route path="/passchange" element={<CambiarPassword usuario={usuario} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
