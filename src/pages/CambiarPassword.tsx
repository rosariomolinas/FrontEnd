import { useState, type FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListaErrores from '../components/ListaErrores';
import Aviso from '../components/Aviso';
import { authService } from '../services';
import { ApiError } from '../services/apiClient';
import type Usuario from '../models/Usuario';

function CambiarPassword({ usuario }: { usuario: Usuario }) {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetida, setRepetida] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [aviso, setAviso] = useState('');

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!actual) errs.push('Ingresá la contraseña actual');
    if (nueva.length < 4) errs.push('La contraseña nueva debe tener al menos 4 caracteres');
    else if (nueva === actual) errs.push('La contraseña nueva debe ser distinta de la actual');
    if (nueva !== repetida) errs.push('Las contraseñas nuevas no coinciden');
    setErrores(errs);
    if (errs.length) return;
    try {
      setAviso(await authService.cambiarPassword(usuario.user, actual, nueva));
      setActual('');
      setNueva('');
      setRepetida('');
    } catch (err) {
      setErrores(err instanceof ApiError && err.errors.length ? err.errors : [(err as Error).message]);
    }
  };

  return (
    <section className="contenido-angosto">
      <h1 className="h4 mb-3">Cambiar contraseña</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={guardar} noValidate>
            <Form.Group className="mb-3" controlId="pwd-actual">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control type="password" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pwd-nueva">
              <Form.Label>Contraseña nueva</Form.Label>
              <Form.Control type="password" autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pwd-repetida">
              <Form.Label>Repetí la contraseña nueva</Form.Label>
              <Form.Control type="password" autoComplete="new-password" value={repetida} onChange={(e) => setRepetida(e.target.value)} />
            </Form.Group>
            <ListaErrores errores={errores} />
            <Button type="submit">Guardar</Button>
          </Form>
        </Card.Body>
      </Card>
      <Aviso texto={aviso} onClose={() => setAviso('')} />
    </section>
  );
}

export default CambiarPassword;
