import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { MENU } from '../rutas';
import type Usuario from '../models/Usuario';

function Inicio({ usuario }: { usuario: Usuario }) {
  const opciones = MENU.filter((m) => usuario.tienePerfil(m.perfiles));
  return (
    <section>
      <h1 className="h4 mb-3">Hola, {usuario.user}</h1>
      <Row xs={1} sm={2} lg={3} className="g-3">
        {opciones.map((m) => (
          <Col key={m.path}>
            <Card as={Link} to={m.path} className="tarjeta-acceso h-100 text-decoration-none">
              <Card.Body>
                <Card.Subtitle className="text-muted mb-1">{m.grupo}</Card.Subtitle>
                <Card.Title className="mb-0">{m.titulo}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default Inicio;
