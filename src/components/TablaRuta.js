import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const MUESTRAS = [
  { campo: 'mtejido', titulo: 'Tejido' },
  { campo: 'msangre', titulo: 'Sangre' },
  { campo: 'tomo3d', titulo: 'Tomografía 3D' },
];

// Muestra los pasos de la ruta de una intervención. Si recibe onChange se puede editar.
// Input: ruta, organos, medicamentos. Output: onChange(indice, cambios), onQuitar(indice).
function TablaRuta({
  ruta, organos, medicamentos, onChange, onQuitar,
}) {
  const editable = Boolean(onChange);
  const organo = (code) => organos.find((o) => o.code === code);
  const medicamento = (code) => medicamentos.find((m) => m.code === code);

  if (ruta.length === 0) return <p className="text-muted">La ruta no tiene órganos.</p>;

  return (
    <Table responsive size="sm" className="align-middle tabla-ruta">
      <thead>
        <tr>
          <th>Órgano</th>
          {MUESTRAS.map((m) => <th key={m.campo} className="text-center">{m.titulo}</th>)}
          <th>Medicación</th>
          {editable && <th aria-label="Acciones" />}
        </tr>
      </thead>
      <tbody>
        {ruta.map((paso, i) => {
          const org = organo(paso.organo);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={i}>
              <td>
                {editable ? (
                  <Form.Select
                    size="sm"
                    aria-label="Órgano"
                    value={paso.organo ?? ''}
                    onChange={(e) => onChange(i, {
                      organo: Number(e.target.value), mtejido: false, msangre: false, tomo3d: false,
                    })}
                  >
                    {organos.map((o) => <option key={o.code} value={o.code}>{o.nombre}</option>)}
                  </Form.Select>
                ) : (org ? org.nombre : `Órgano ${paso.organo}`)}
              </td>
              {MUESTRAS.map(({ campo, titulo }) => (
                <td key={campo} className="text-center">
                  {(!editable || (org && org[campo])) ? (
                    <Form.Check
                      aria-label={titulo}
                      checked={paso[campo]}
                      disabled={!editable}
                      onChange={() => onChange(i, { [campo]: !paso[campo] })}
                    />
                  ) : <span className="text-muted" title="Este órgano no admite esta muestra">–</span>}
                </td>
              ))}
              <td>
                {editable ? (
                  <Form.Select
                    size="sm"
                    aria-label="Medicación"
                    value={paso.medica}
                    onChange={(e) => onChange(i, { medica: Number(e.target.value) })}
                  >
                    <option value={0}>Sin medicación</option>
                    {medicamentos.map((m) => <option key={m.code} value={m.code}>{m.nombre}</option>)}
                  </Form.Select>
                ) : ((medicamento(paso.medica) || {}).nombre || '–')}
              </td>
              {editable && (
                <td className="text-end">
                  <Button size="sm" variant="outline-danger" onClick={() => onQuitar(i)}>Quitar</Button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default TablaRuta;
