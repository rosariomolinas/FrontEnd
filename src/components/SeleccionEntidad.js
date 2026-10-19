import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BuscadorModal from './BuscadorModal';

// Campo de formulario que permite elegir un paciente/doctor con el buscador.
// Input: etiqueta, service, valor (entidad elegida o null). Output: onChange(entidad o null).
function SeleccionEntidad({
  etiqueta, service, valor, onChange, permitirQuitar = false,
}) {
  const [ver, setVer] = useState(false);
  return (
    <Form.Group className="mb-3">
      <Form.Label>{etiqueta}</Form.Label>
      <div className="d-flex gap-2">
        <Form.Control readOnly value={valor ? `${valor.code} · ${valor.nombreCompleto}` : ''} placeholder="Sin elegir" />
        <Button variant="outline-primary" onClick={() => setVer(true)}>Buscar</Button>
        {permitirQuitar && valor && (
          <Button variant="outline-secondary" onClick={() => onChange(null)} aria-label={`Quitar ${etiqueta.toLowerCase()}`}>✕</Button>
        )}
      </div>
      <BuscadorModal
        titulo={`Buscar ${etiqueta.toLowerCase()}`}
        service={service}
        show={ver}
        onSelect={(e) => { setVer(false); onChange(e); }}
        onClose={() => setVer(false)}
      />
    </Form.Group>
  );
}

export default SeleccionEntidad;
