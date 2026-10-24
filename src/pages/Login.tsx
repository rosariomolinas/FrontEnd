import { useState, type FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import ListaErrores from '../components/ListaErrores';
import { authService } from '../services';
import type Usuario from '../models/Usuario';

// Input: aviso (por ejemplo, que la sesión expiró). Output: onLogin(usuario) cuando el ingreso es correcto.
function Login({ onLogin, aviso = '' }: { onLogin: (usuario: Usuario) => void; aviso?: string }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const ingresar = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !password) {
      setError('Ingresá usuario y contraseña');
      return;
    }
    setError('');
    setCargando(true);
    try {
      onLogin(await authService.login(user, password));
    } catch (err) {
      setError((err as Error).message);
      setCargando(false);
    }
  };

  return (
    <main className="pantalla-login">
      <Card className="tarjeta-login shadow-sm">
        <Card.Body>
          <h1 className="h4 text-center mb-1">ROBIOTICS</h1>
          <p className="text-center text-muted mb-4">Ingresá con tu usuario</p>
          {aviso && <Alert variant="warning">{aviso}</Alert>}
          <Form onSubmit={ingresar} noValidate>
            <Form.Group className="mb-3" controlId="login-user">
              <Form.Label>Usuario</Form.Label>
              <Form.Control autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <ListaErrores errores={error ? [error] : []} />
            <Button type="submit" className="w-100" disabled={cargando}>
              {cargando ? <Spinner size="sm" /> : 'Ingresar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
}

export default Login;
