import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import ListaErrores from './ListaErrores';

// Ventana para buscar un registro por código, nombre o todos.
// Input: titulo, service (CrudService), show. Output: onSelect(entidad), onClose().
function BuscadorModal({ titulo, service, show, onSelect, onClose }) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [incluirInactivos, setIncluirInactivos] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const limpiar = () => {
    setCodigo('');
    setNombre('');
    setResultados(null);
    setError('');
  };

  const buscar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      setResultados(await service.buscar({ codigo, nombre, soloActivos: !incluirInactivos }));
    } catch (err) {
      setError(err.message);
      setResultados(null);
    } finally {
      setCargando(false);
    }
  };

  const cerrar = () => {
    limpiar();
    onClose();
  };

  const elegir = (entidad) => {
    limpiar();
    onSelect(entidad);
  };

  return (
    <Modal show={show} onHide={cerrar} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={buscar}>
          <Form.Group className="mb-2" controlId="buscar-codigo">
            <Form.Label>Código</Form.Label>
            <Form.Control type="number" min="1" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2" controlId="buscar-nombre">
            <Form.Label>Nombre o apellido</Form.Label>
            <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Dejalo vacío para ver todos" />
          </Form.Group>
          <Form.Check
            className="mb-3"
            id="buscar-inactivos"
            label="Incluir dados de baja"
            checked={incluirInactivos}
            onChange={() => setIncluirInactivos(!incluirInactivos)}
          />
          <Button type="submit" className="w-100 mb-3" disabled={cargando}>
            {cargando ? <Spinner size="sm" /> : 'Buscar'}
          </Button>
        </Form>
        <ListaErrores errores={error ? [error] : []} />
        {resultados && resultados.length === 0 && <p className="text-muted">No hay coincidencias.</p>}
        {resultados && resultados.length > 0 && (
          <Table hover size="sm" className="tabla-seleccion mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th className="d-none d-sm-table-cell">Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.code} onClick={() => elegir(r)} title="Elegir">
                  <td>{r.code}</td>
                  <td>{r.nombreCompleto}</td>
                  <td className="d-none d-sm-table-cell">{r.activo ? 'Activo' : 'De baja'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default BuscadorModal;
