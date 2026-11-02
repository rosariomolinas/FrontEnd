import { useEffect, useState, type FormEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListaErrores from './ListaErrores';
import type Intervencion from '../models/Intervencion';
import { intervencionService, type DatosResultado } from '../services';
import { ApiError } from '../services/apiClient';

// Fecha de hoy en formato yyyy-mm-dd (hora local).
export const hoyISO = (hoy = new Date()) => {
  const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000);
  return local.toISOString().substring(0, 10);
};

interface Campos {
  estado: DatosResultado['estado'];
  fecha: string;
  tiempoReal: string;
  observaciones: string;
}

// Reglas del caso de uso 2 del lado del cliente (el backend las vuelve a validar).
export const validarResultado = ({
  estado, fecha, tiempoReal, observaciones,
}: Campos, hoy = hoyISO()): string[] => {
  const errores: string[] = [];
  if (!fecha) errores.push('Ingresá la fecha');
  else if (fecha > hoy) errores.push('La fecha del resultado no puede ser futura');
  if (estado === 'realizada' && !(Number.isInteger(Number(tiempoReal)) && Number(tiempoReal) > 0)) {
    errores.push('Ingresá el tiempo real en minutos (entero mayor a 0)');
  }
  if (estado === 'cancelada' && !observaciones.trim()) errores.push('Indicá el motivo de la cancelación');
  return errores;
};

interface RegistrarResultadoProps {
  intervencion: Intervencion | null;
  onClose: () => void;
  onRegistrado: (intervencion: Intervencion) => void;
}

// Caso de uso 2: registrar si una intervención planificada se realizó o se canceló.
// Input: intervencion (se muestra si no es null). Output: onRegistrado(intervención actualizada), onClose().
function RegistrarResultado({ intervencion, onClose, onRegistrado }: RegistrarResultadoProps) {
  const inicial = (): Campos => ({
    estado: 'realizada', fecha: hoyISO(), tiempoReal: intervencion ? String(intervencion.tiempo || '') : '', observaciones: '',
  });
  const [campos, setCampos] = useState<Campos>(inicial);
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setCampos(inicial()); setErrores([]); }, [intervencion]);

  const cambiar = (campo: keyof Campos, valor: string) => setCampos({ ...campos, [campo]: valor });

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!intervencion || !intervencion.id) return;
    const errs = validarResultado(campos);
    setErrores(errs);
    if (errs.length) return;
    setGuardando(true);
    try {
      const realizada = campos.estado === 'realizada';
      const actualizada = await intervencionService.registrarResultado(intervencion.id, {
        estado: campos.estado,
        // Si es hoy no se manda: el servidor usa la hora actual.
        fecha: campos.fecha === hoyISO() ? undefined : campos.fecha,
        tiempoReal: realizada ? Number(campos.tiempoReal) : undefined,
        observaciones: campos.observaciones.trim() || undefined,
      });
      onRegistrado(actualizada);
    } catch (err) {
      setErrores(err instanceof ApiError && err.errors.length ? err.errors : [(err as Error).message]);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={Boolean(intervencion)} onHide={onClose} centered>
      <Form onSubmit={guardar} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">Registrar resultado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label as="legend" className="fs-6">¿Cómo terminó la intervención?</Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                type="radio"
                id="resultado-realizada"
                name="resultado-estado"
                label="Realizada"
                checked={campos.estado === 'realizada'}
                onChange={() => cambiar('estado', 'realizada')}
              />
              <Form.Check
                type="radio"
                id="resultado-cancelada"
                name="resultado-estado"
                label="Cancelada"
                checked={campos.estado === 'cancelada'}
                onChange={() => cambiar('estado', 'cancelada')}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="resultado-fecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control type="date" max={hoyISO()} value={campos.fecha} onChange={(e) => cambiar('fecha', e.target.value)} />
          </Form.Group>
          {campos.estado === 'realizada' && (
            <Form.Group className="mb-3" controlId="resultado-tiempo">
              <Form.Label>Tiempo real (minutos)</Form.Label>
              <Form.Control type="number" min="1" value={campos.tiempoReal} onChange={(e) => cambiar('tiempoReal', e.target.value)} />
              {intervencion && <Form.Text>Estimado: {intervencion.tiempo} min</Form.Text>}
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="resultado-observaciones">
            <Form.Label>{campos.estado === 'cancelada' ? 'Motivo de la cancelación' : 'Observaciones'}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={500}
              value={campos.observaciones}
              onChange={(e) => cambiar('observaciones', e.target.value)}
            />
          </Form.Group>
          <ListaErrores errores={errores} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Registrar'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RegistrarResultado;
