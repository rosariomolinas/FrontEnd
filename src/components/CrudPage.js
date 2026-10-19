import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import BuscadorModal from './BuscadorModal';
import ListaErrores from './ListaErrores';
import Aviso from './Aviso';

// Pantalla de alta, búsqueda, modificación y baja de una entidad.
// Input: titulo (singular), plural, service (CrudService) y Model (clase con `static campos`).
function CrudPage({
  titulo, plural, service, Model,
}) {
  const [entidad, setEntidad] = useState(new Model());
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState([]);
  const [verBuscador, setVerBuscador] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState({ texto: '', variante: 'success' });
  const [original, setOriginal] = useState(null);

  const etiqueta = titulo.toLowerCase();
  const avisar = (texto, variante = 'success') => setAviso({ texto, variante });

  const nuevo = () => {
    setOriginal(null);
    setEntidad(new Model());
    setErrores([]);
    setEditando(true);
  };

  const editar = () => {
    setOriginal(entidad);
    setEditando(true);
  };

  const cancelar = () => {
    setEntidad(original || new Model());
    setErrores([]);
    setEditando(false);
  };

  const elegido = (e) => {
    setEntidad(e);
    setErrores([]);
    setEditando(false);
    setVerBuscador(false);
  };

  const guardar = async (ev) => {
    ev.preventDefault();
    const errs = entidad.validar();
    setErrores(errs);
    if (errs.length) return;
    setGuardando(true);
    try {
      const guardado = await service.guardar(entidad);
      setEntidad(guardado);
      setEditando(false);
      avisar(`${titulo} guardado`);
    } catch (err) {
      setErrores(err.errors && err.errors.length ? err.errors : [err.message]);
    } finally {
      setGuardando(false);
    }
  };

  const darDeBaja = async () => {
    setConfirmarBaja(false);
    try {
      setEntidad(await service.eliminar(entidad.code));
      avisar(`${titulo} dado de baja`);
    } catch (err) {
      avisar(err.message, 'danger');
    }
  };

  const campoInput = ({ nombre, etiqueta: label, tipo, min, max, requerido }) => {
    if (tipo === 'checkbox') {
      return (
        <Col xs={12} md={6} key={nombre}>
          <Form.Check
            id={`campo-${nombre}`}
            label={label}
            checked={Boolean(entidad[nombre])}
            disabled={!editando}
            onChange={(e) => setEntidad(entidad.con(nombre, e.target.checked))}
            className="mb-2"
          />
        </Col>
      );
    }
    return (
      <Col xs={12} md={6} lg={4} key={nombre}>
        <Form.Group className="mb-3" controlId={`campo-${nombre}`}>
          <Form.Label>{label}{requerido && ' *'}</Form.Label>
          <Form.Control
            type={tipo}
            min={min}
            max={max}
            value={entidad[nombre]}
            disabled={!editando}
            onChange={(e) => setEntidad(entidad.con(nombre, e.target.value))}
          />
        </Form.Group>
      </Col>
    );
  };

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h1 className="h4 mb-0 me-auto">{plural}</h1>
        <Button variant="outline-primary" onClick={() => setVerBuscador(true)} disabled={editando}>Buscar</Button>
        <Button onClick={nuevo} disabled={editando}>Nuevo</Button>
      </div>

      <Card>
        <Card.Body>
          <Form onSubmit={guardar} noValidate>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="text-muted">
                {entidad.code ? `Código ${entidad.code}` : `Nuevo ${etiqueta}`}
              </span>
              {entidad.code && (
                <Badge bg={entidad.activo ? 'success' : 'secondary'}>{entidad.activo ? 'Activo' : 'De baja'}</Badge>
              )}
            </div>

            {!editando && !entidad.code && (
              <p className="text-muted">Buscá un {etiqueta} para verlo o tocá Nuevo para cargar uno.</p>
            )}

            <Row>{Model.campos.map(campoInput)}</Row>

            <ListaErrores errores={errores} />

            <div className="botonera">
              {editando ? (
                <>
                  <Button key="guardar" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</Button>
                  <Button key="cancelar" variant="outline-secondary" onClick={cancelar}>Cancelar</Button>
                </>
              ) : (
                <>
                  <Button key="editar" variant="outline-primary" onClick={editar} disabled={!entidad.code || !entidad.activo}>Editar</Button>
                  <Button key="baja" variant="outline-danger" onClick={() => setConfirmarBaja(true)} disabled={!entidad.code || !entidad.activo}>
                    Dar de baja
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <BuscadorModal
        titulo={`Buscar ${etiqueta}`}
        service={service}
        show={verBuscador}
        onSelect={elegido}
        onClose={() => setVerBuscador(false)}
      />

      <Modal show={confirmarBaja} onHide={() => setConfirmarBaja(false)} centered>
        <Modal.Body>
          ¿Dar de baja a {entidad.nombreCompleto}? Va a dejar de aparecer en las búsquedas.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setConfirmarBaja(false)}>Cancelar</Button>
          <Button variant="danger" onClick={darDeBaja}>Dar de baja</Button>
        </Modal.Footer>
      </Modal>

      <Aviso texto={aviso.texto} variante={aviso.variante} onClose={() => setAviso({ texto: '' })} />
    </section>
  );
}

export default CrudPage;
