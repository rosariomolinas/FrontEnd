import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BuscadorModal from './BuscadorModal';
import type CrudService from '../services/CrudService';
import type Entidad from '../models/Entidad';

interface SeleccionEntidadProps<T extends Entidad> {
  etiqueta: string;
  service: CrudService<T>;
  valor: T | null;
  onChange: (entidad: T | null) => void;
  permitirQuitar?: boolean;
}

// Campo de formulario que permite elegir un paciente/doctor con el buscador.
// Input: etiqueta, service, valor (entidad elegida o null). Output: onChange(entidad o null).
function SeleccionEntidad<T extends Entidad>({
  etiqueta, service, valor, onChange, permitirQuitar = false,
}: SeleccionEntidadProps<T>) {
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
