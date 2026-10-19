import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import SeleccionEntidad from '../components/SeleccionEntidad';
import TablaRuta from '../components/TablaRuta';
import ListaErrores from '../components/ListaErrores';
import Aviso from '../components/Aviso';
import Intervencion, { PasoRuta } from '../models/Intervencion';
import {
  pacienteService, doctorService, medicamentoService, intervencionService,
} from '../services';

// Caso de uso: planificar una intervención (paciente, médico, fecha y ruta de órganos) con su presupuesto.
function IntervNueva() {
  const [paciente, setPaciente] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [fecha, setFecha] = useState('');
  const [ruta, setRuta] = useState([]);
  const [organos, setOrganos] = useState([]);
  const [valores, setValores] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [presupuesto, setPresupuesto] = useState(null);
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState({ texto: '' });

  useEffect(() => {
    Promise.all([intervencionService.datosParaPlanificar(), medicamentoService.listar()])
      .then(([datos, meds]) => {
        setOrganos(datos.organos);
        setValores(datos.valores);
        setMedicamentos(meds);
      })
      .catch((err) => setErrores([`No se pudieron cargar órganos y medicamentos: ${err.message}`]))
      .finally(() => setCargando(false));
  }, []);

  const intervencion = () => new Intervencion({
    paciente: paciente && paciente.code,
    doctor: doctor && doctor.code,
    fecint: fecha,
    ruta,
  });

  // Cualquier cambio invalida el presupuesto calculado.
  const cambio = (setter) => (v) => { setter(v); setPresupuesto(null); };

  const agregarOrgano = () => {
    const usados = ruta.map((p) => p.organo);
    const libre = organos.find((o) => !usados.includes(o.code)) || organos[0];
    cambio(setRuta)([...ruta, new PasoRuta({ organo: libre.code })]);
  };

  const cambiarPaso = (i, cambios) => {
    cambio(setRuta)(ruta.map((p, j) => (j === i ? new PasoRuta({ ...p, ...cambios }) : p)));
  };

  const quitarPaso = (i) => cambio(setRuta)(ruta.filter((p, j) => j !== i));

  const presupuestar = () => {
    const resultado = intervencion().presupuestar(valores);
    setErrores(resultado.errores);
    setPresupuesto(resultado.errores.length ? null : resultado);
    return resultado;
  };

  const confirmar = async () => {
    const { errores: errs, costo, tiempo } = presupuestar();
    if (errs.length) return;
    setGuardando(true);
    try {
      const interv = intervencion();
      interv.costo = costo;
      interv.tiempo = tiempo;
      await intervencionService.guardar(interv);
      setAviso({ texto: 'Intervención guardada', variante: 'success' });
      setPaciente(null);
      setDoctor(null);
      setFecha('');
      setRuta([]);
      setPresupuesto(null);
    } catch (err) {
      setErrores(err.errors && err.errors.length ? err.errors : [err.message]);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Spinner className="d-block mx-auto my-5" />;

  return (
    <section>
      <h1 className="h4 mb-3">Nueva intervención</h1>
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col xs={12} lg={5}>
              <SeleccionEntidad etiqueta="Paciente" service={pacienteService} valor={paciente} onChange={cambio(setPaciente)} />
            </Col>
            <Col xs={12} lg={5}>
              <SeleccionEntidad etiqueta="Médico" service={doctorService} valor={doctor} onChange={cambio(setDoctor)} />
            </Col>
            <Col xs={12} sm={6} lg={2}>
              <Form.Group className="mb-3" controlId="interv-fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={fecha} onChange={(e) => cambio(setFecha)(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center">
          <span className="me-auto">Ruta de órganos</span>
          <Button size="sm" onClick={agregarOrgano} disabled={organos.length === 0}>Agregar órgano</Button>
        </Card.Header>
        <Card.Body>
          <TablaRuta ruta={ruta} organos={organos} medicamentos={medicamentos} onChange={cambiarPaso} onQuitar={quitarPaso} />
        </Card.Body>
      </Card>

      <ListaErrores errores={errores} />

      <div className="d-flex flex-wrap align-items-center gap-2">
        <Button variant="outline-primary" onClick={presupuestar}>Presupuestar</Button>
        <Button onClick={confirmar} disabled={guardando}>{guardando ? 'Guardando…' : 'Confirmar intervención'}</Button>
        {presupuesto && (
          <span className="ms-md-3">
            Costo: <strong>${presupuesto.costo}</strong> · Tiempo: <strong>{presupuesto.tiempo} min</strong>
          </span>
        )}
      </div>

      <Aviso texto={aviso.texto} variante={aviso.variante} onClose={() => setAviso({ texto: '' })} />
    </section>
  );
}

export default IntervNueva;
