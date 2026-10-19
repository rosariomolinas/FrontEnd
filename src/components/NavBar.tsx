import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import { MENU } from '../rutas';
import type Usuario from '../models/Usuario';

// Barra de navegación; muestra solo las opciones permitidas para el perfil del usuario.
// Input: usuario. Output: onLogout().
function NavBar({ usuario, onLogout }: { usuario: Usuario; onLogout: () => void }) {
  const opciones = MENU.filter((m) => usuario.tienePerfil(m.perfiles));
  const grupos = [...new Set(opciones.map((m) => m.grupo))];

  return (
    <Navbar expand="md" bg="dark" variant="dark" collapseOnSelect className="mb-3">
      <Container>
        <Navbar.Brand as={NavLink} to="/">ROBIOTICS</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            {grupos.map((g) => (
              <NavDropdown title={g} key={g} id={`menu-${g}`}>
                {opciones.filter((m) => m.grupo === g).map((m) => (
                  <NavDropdown.Item as={NavLink} to={m.path} key={m.path}>{m.titulo}</NavDropdown.Item>
                ))}
              </NavDropdown>
            ))}
          </Nav>
          <Nav>
            <NavDropdown title={usuario.user} id="menu-usuario" align="end">
              <NavDropdown.Item as={NavLink} to="/passchange">Cambiar contraseña</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
