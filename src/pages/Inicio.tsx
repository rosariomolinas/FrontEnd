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
      <header className="mb-4">
        <h1 className="h3 mb-1">Hola, {usuario.user}</h1>
        <p className="text-body-secondary mb-0">¿Qué querés hacer hoy?</p>
      </header>
      <Row xs={1} sm={2} lg={3} className="g-3">
        {opciones.map((m) => (
          <Col key={m.path}>
            <Card as={Link} to={m.path} className="tarjeta-acceso h-100 text-decoration-none">
              <Card.Body>
                <span className="etiqueta-grupo mb-2">{m.grupo}</span>
                <Card.Title className="mb-1">{m.titulo}</Card.Title>
                <Card.Text className="text-body-secondary small mb-0">{m.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default Inicio;
