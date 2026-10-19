import Alert from 'react-bootstrap/Alert';

function ListaErrores({ errores }) {
  if (!errores || errores.length === 0) return null;
  return (
    <Alert variant="danger" className="py-2">
      {errores.length === 1 ? errores[0] : (
        <ul className="mb-0 ps-3">
          {errores.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
    </Alert>
  );
}

export default ListaErrores;
