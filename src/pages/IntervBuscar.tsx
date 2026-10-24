import { useEffect, useState, type FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from 'react-router-dom';
import SeleccionEntidad from '../components/SeleccionEntidad';
import TablaRuta from '../components/TablaRuta';
import ListaErrores from '../components/ListaErrores';
import Aviso, { type AvisoState } from '../components/Aviso';
import RegistrarResultado from '../components/RegistrarResultado';
import {
  pacienteService, doctorService, medicamentoService, intervencionService,
} from '../services';
import { ESTADOS, type Estado } from '../models/Intervencion';
import type Intervencion from '../models/Intervencion';
import { PERFILES } from '../models/Usuario';
import type Usuario from '../models/Usuario';
import type Entidad from '../models/Entidad';
import type Paciente from '../models/Paciente';
import type Doctor from '../models/Doctor';
import type Organo from '../models/Organo';
import type Medicamento from '../models/Medicamento';

interface Catalogo {
  organos: Organo[];
  medicamentos: Medicamento[];
  pacientes: Record<number, Paciente>;
  doctores: Record<number, Doctor>;
}

const porCodigo = <T extends Entidad>(lista: T[]): Record<number, T> => Object.fromEntries(lista.map((e) => [e.code, e]));

const COLOR_ESTADO: Record<Estado, string> = { planificada: 'primary', realizada: 'success', cancelada: 'secondary' };

export const BadgeEstado = ({ estado }: { estado: Estado }) => (
  <Badge bg={COLOR_ESTADO[estado]} className="text-capitalize">{estado}</Badge>
);

// Listado de intervenciones con filtro por paciente, médico, fechas y estado, y detalle de cada una.
// Desde el detalle, el perfil "user" puede modificar, eliminar o registrar el resultado de una intervención planificada.
function IntervBuscar({ usuario }: { usuario: Usuario }) {
  const navigate = useNavigate();
  const puedeOperar = usuario.tienePerfil([PERFILES.USER]);
  const [estado, setEstado] = useState<Estado | ''>('');
  const [registrando, setRegistrando] = useState<Intervencion | null>(null);
  const [aEliminar, setAEliminar] = useState<Intervencion | null>(null);
  const [aviso, setAviso] = useState<AvisoState>({ texto: '' });
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [resultados, setResultados] = useState<Intervencion[] | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [detalle, setDetalle] = useState<Intervencion | null>(null);
  const [catalogo, setCatalogo] = useState<Catalogo>({
    organos: [], medicamentos: [], pacientes: {}, doctores: {},
  });

  // Nombres de pacientes, doctores, órganos y medicamentos para mostrar en el listado y el detalle.
  useEffect(() => {
    Promise.all([
      intervencionService.datosParaPlanificar(),
      medicamentoService.listar(),
      pacienteService.listar(false),
      doctorService.listar(false),
    ])
      .then(([datos, medicamentos, pacientes, doctores]) => setCatalogo({
        organos: datos.organos,
        medicamentos,
        pacientes: porCodigo(pacientes),
        doctores: porCodigo(doctores),
      }))
      .catch((err) => setError(`No se pudieron cargar los datos: ${err.message}`));
  }, []);

  const nombre = (mapa: Record<number, Entidad>, code: number | null) => (code !== null && mapa[code] ? mapa[code].nombreCompleto : `#${code}`);

  const buscar = async (e: FormEvent) => {
    e.preventDefault();
    if (desde && hasta && desde > hasta) {
      setError('La fecha desde no puede ser posterior a la fecha hasta');
      return;
    }
    setError('');
    setBuscando(true);
    try {
      const res = await intervencionService.buscar({
        paciente: paciente && paciente.code, doctor: doctor && doctor.code, desde, hasta, estado,
      });
      setResultados(res.intervenciones);
      setMensaje(res.mensaje);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBuscando(false);
    }
  };

  // Reemplaza la intervención en el listado y en el detalle después de un cambio.
  const actualizar = (interv: Intervencion) => {
    setResultados((rs) => rs && rs.map((r) => (r.id === interv.id ? interv : r)));
    setDetalle(interv);
  };

  const registrado = (interv: Intervencion) => {
    setRegistrando(null);
    actualizar(interv);
    setAviso({ texto: `Intervención ${interv.estado}`, variante: 'success' });
  };

  // Los modales de resultado y de eliminar reemplazan al detalle mientras están abiertos (no se apilan).
  const abrirResultado = (interv: Intervencion) => { setDetalle(null); setRegistrando(interv); };
  const cerrarResultado = () => { setDetalle(registrando); setRegistrando(null); };
  const abrirEliminar = (interv: Intervencion) => { setDetalle(null); setAEliminar(interv); };
  const cerrarEliminar = () => { setDetalle(aEliminar); setAEliminar(null); };

  const eliminar = async () => {
    const interv = aEliminar;
    setAEliminar(null);
    if (!interv || !interv.id) return;
    try {
      await intervencionService.eliminar(interv.id);
      setResultados((rs) => rs && rs.filter((r) => r.id !== interv.id));
      setAviso({ texto: 'Intervención eliminada', variante: 'success' });
    } catch (err) {
      setAviso({ texto: (err as Error).message, variante: 'danger' });
    }
  };

  return (
    <section>
      <h1 className="h4 mb-3">Buscar intervenciones</h1>
      <Card className="mb-3">
        <Card.Body>
          <Form onSubmit={buscar}>
            <Row>
              <Col xs={12} md={6}>
                <SeleccionEntidad etiqueta="Paciente" service={pacienteService} valor={paciente} onChange={setPaciente} permitirQuitar />
              </Col>
              <Col xs={12} md={6}>
                <SeleccionEntidad etiqueta="Médico" service={doctorService} valor={doctor} onChange={setDoctor} permitirQuitar />
              </Col>
              <Col xs={6} md={3}>
                <Form.Group className="mb-3" controlId="filtro-desde">
                  <Form.Label>Desde</Form.Label>
                  <Form.Control type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group className="mb-3" controlId="filtro-hasta">
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3" controlId="filtro-estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select value={estado} onChange={(e) => setEstado(e.target.value as Estado | '')}>
                    <option value="">Todos</option>
                    {ESTADOS.map((e) => <option key={e} value={e} className="text-capitalize">{e}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3} className="d-flex align-items-end mb-3">
                <Button type="submit" className="w-100" disabled={buscando}>
                  {buscando ? <Spinner size="sm" /> : 'Buscar'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <ListaErrores errores={error ? [error] : []} />
      {resultados && resultados.length === 0 && <p className="text-muted">{mensaje || 'No hay intervenciones.'}</p>}

      {resultados && resultados.length > 0 && (
        <Table responsive hover className="align-middle tabla-seleccion">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>Estado</th>
              <th className="d-none d-md-table-cell">Médico</th>
              <th className="d-none d-sm-table-cell text-end">Costo</th>
              <th className="d-none d-lg-table-cell text-end">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r) => (
              <tr key={r.id} onClick={() => setDetalle(r)} title="Ver detalle">
                <td>{r.fecha}</td>
                <td>{nombre(catalogo.pacientes, r.paciente)}</td>
                <td><BadgeEstado estado={r.estado} /></td>
                <td className="d-none d-md-table-cell">{nombre(catalogo.doctores, r.doctor)}</td>
                <td className="d-none d-sm-table-cell text-end">${r.costo}</td>
                <td className="d-none d-lg-table-cell text-end">{r.tiempo} min</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {resultados && resultados.length > 0 && <p className="text-muted small">Tocá una intervención para ver el detalle.</p>}

      <Modal show={Boolean(detalle)} onHide={() => setDetalle(null)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">Intervención del {detalle && detalle.fecha}</Modal.Title>
        </Modal.Header>
        {detalle && (
          <Modal.Body>
            <dl className="row mb-3">
              <dt className="col-5 col-sm-3">Paciente</dt>
              <dd className="col-7 col-sm-9">{nombre(catalogo.pacientes, detalle.paciente)}</dd>
              <dt className="col-5 col-sm-3">Médico</dt>
              <dd className="col-7 col-sm-9">{nombre(catalogo.doctores, detalle.doctor)}</dd>
              <dt className="col-5 col-sm-3">Costo</dt>
              <dd className="col-7 col-sm-9">${detalle.costo}</dd>
              <dt className="col-5 col-sm-3">Tiempo estimado</dt>
              <dd className="col-7 col-sm-9">{detalle.tiempo} min</dd>
              <dt className="col-5 col-sm-3">Estado</dt>
              <dd className="col-7 col-sm-9"><BadgeEstado estado={detalle.estado} /></dd>
            </dl>
            {detalle.resultado && (
              <dl className="row mb-3">
                <dt className="col-5 col-sm-3">Fecha del resultado</dt>
                <dd className="col-7 col-sm-9">{String(detalle.resultado.fecha).substring(0, 10)}</dd>
                {detalle.resultado.tiempoReal !== undefined && (
                  <>
                    <dt className="col-5 col-sm-3">Tiempo real</dt>
                    <dd className="col-7 col-sm-9">{detalle.resultado.tiempoReal} min</dd>
                  </>
                )}
                {detalle.resultado.observaciones && (
                  <>
                    <dt className="col-5 col-sm-3">Observaciones</dt>
                    <dd className="col-7 col-sm-9">{detalle.resultado.observaciones}</dd>
                  </>
                )}
                <dt className="col-5 col-sm-3">Registró</dt>
                <dd className="col-7 col-sm-9">{detalle.resultado.usuario}</dd>
              </dl>
            )}
            <h3 className="h6">Ruta</h3>
            <TablaRuta ruta={detalle.ruta} organos={catalogo.organos} medicamentos={catalogo.medicamentos} />
          </Modal.Body>
        )}
        {detalle && detalle.abierta && puedeOperar && (
          <Modal.Footer>
            <Button variant="outline-danger" className="me-auto" onClick={() => abrirEliminar(detalle)}>Eliminar</Button>
            <Button variant="outline-primary" onClick={() => navigate(`/intervenciones/${detalle.id}`)}>Modificar</Button>
            <Button onClick={() => abrirResultado(detalle)}>Registrar resultado</Button>
          </Modal.Footer>
        )}
      </Modal>

      <RegistrarResultado intervencion={registrando} onClose={cerrarResultado} onRegistrado={registrado} />

      <Modal show={Boolean(aEliminar)} onHide={cerrarEliminar} centered>
        <Modal.Body>¿Eliminar la intervención del {aEliminar && aEliminar.fecha}? No se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cerrarEliminar}>Cancelar</Button>
          <Button variant="danger" onClick={eliminar}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Aviso texto={aviso.texto} variante={aviso.variante} onClose={() => setAviso({ texto: '' })} />
    </section>
  );
}

export default IntervBuscar;
