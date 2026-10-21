import { useState, type FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import BuscadorModal from './BuscadorModal';
import ListaErrores from './ListaErrores';
import Aviso, { type AvisoState, type VarianteAviso } from './Aviso';
import type CrudService from '../services/CrudService';
import type Entidad from '../models/Entidad';
import type { CampoDef, EntidadClass } from '../models/Entidad';
import { ApiError } from '../services/apiClient';

interface CrudPageProps<T extends Entidad> {
  titulo: string;
  plural: string;
  service: CrudService<T>;
  Model: EntidadClass<T>;
}

const mensajesDe = (err: unknown): string[] => (
  err instanceof ApiError && err.errors.length ? err.errors : [(err as Error).message]
);

// Pantalla de alta, búsqueda, modificación y baja de una entidad.
// Input: titulo (singular), plural, service (CrudService) y Model (clase con `static campos`).
function CrudPage<T extends Entidad>({
  titulo, plural, service, Model,
}: CrudPageProps<T>) {
  const [entidad, setEntidad] = useState<T>(() => new Model());
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [verBuscador, setVerBuscador] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<AvisoState>({ texto: '' });
  const [original, setOriginal] = useState<T | null>(null);

  const etiqueta = titulo.toLowerCase();
  const avisar = (texto: string, variante: VarianteAviso = 'success') => setAviso({ texto, variante });

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

  const elegido = (e: T) => {
    setEntidad(e);
    setErrores([]);
    setEditando(false);
    setVerBuscador(false);
  };

  const guardar = async (ev: FormEvent) => {
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
      setErrores(mensajesDe(err));
    } finally {
      setGuardando(false);
    }
  };

  const darDeBaja = async () => {
    setConfirmarBaja(false);
    try {
      setEntidad(await service.eliminar(entidad.code as number));
      avisar(`${titulo} dado de baja`);
    } catch (err) {
      avisar((err as Error).message, 'danger');
    }
  };

  const campoInput = ({
    nombre, etiqueta: label, tipo, min, max, requerido,
  }: CampoDef) => {
    if (tipo === 'checkbox') {
      return (
        <Col xs={12} md={6} key={nombre}>
          <Form.Check
            id={`campo-${nombre}`}
            label={label}
            checked={Boolean(entidad.valor(nombre))}
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
            value={String(entidad.valor(nombre) ?? '')}
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
