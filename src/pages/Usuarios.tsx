import { useEffect, useState, type FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import ListaErrores from '../components/ListaErrores';
import Aviso, { type AvisoState } from '../components/Aviso';
import { usuarioService } from '../services';
import { ApiError } from '../services/apiClient';
import Usuario, { PERFILES, type Perfil } from '../models/Usuario';

const mensajesDe = (err: unknown): string[] => (
  err instanceof ApiError && err.errors.length ? err.errors : [(err as Error).message]
);

interface Formulario {
  id: string;
  user: string;
  profile: Perfil;
  password: string;
}

const VACIO: Formulario = {
  id: '', user: '', profile: PERFILES.USER, password: '',
};

// ABM de usuarios del sistema (solo administradores).
function Usuarios({ usuario: actual }: { usuario: Usuario }) {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [form, setForm] = useState<Formulario | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [aEliminar, setAEliminar] = useState<Usuario | null>(null);
  const [aviso, setAviso] = useState<AvisoState>({ texto: '' });

  const cargar = () => usuarioService.listar()
    .then(setUsuarios)
    .catch((err) => setAviso({ texto: err.message, variante: 'danger' }));

  useEffect(() => { cargar(); }, []);

  const abrir = (u?: Usuario) => {
    setErrores([]);
    setForm(u ? {
      id: u.id, user: u.user, profile: u.profile as Perfil, password: '',
    } : VACIO);
  };

  const validar = (f: Formulario) => {
    const errs: string[] = [];
    if (!f.id && !/^[a-zA-Z0-9._-]{3,30}$/.test(f.user)) {
      errs.push('El usuario debe tener entre 3 y 30 letras, números, punto, guion o guion bajo');
    }
    if ((!f.id || f.password) && f.password.length < 4) errs.push('La contraseña debe tener al menos 4 caracteres');
    return errs;
  };

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const errs = validar(form);
    setErrores(errs);
    if (errs.length) return;
    setGuardando(true);
    try {
      if (form.id) await usuarioService.actualizar(form.id, form.profile, form.password);
      else await usuarioService.crear(form.user, form.password, form.profile);
      setAviso({ texto: form.id ? 'Usuario actualizado' : 'Usuario creado', variante: 'success' });
      setForm(null);
      cargar();
    } catch (err) {
      setErrores(mensajesDe(err));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!aEliminar) return;
    try {
      await usuarioService.eliminar(aEliminar.id);
      setAviso({ texto: `Usuario ${aEliminar.user} eliminado`, variante: 'success' });
      cargar();
    } catch (err) {
      setAviso({ texto: (err as Error).message, variante: 'danger' });
    } finally {
      setAEliminar(null);
    }
  };

  const esPropio = (u: Usuario) => u.id === actual.id;

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h1 className="h4 mb-0 me-auto">Usuarios</h1>
        <Button onClick={() => abrir()}>Nuevo usuario</Button>
      </div>

      {!usuarios && <Spinner className="d-block mx-auto my-5" />}
      {usuarios && (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Perfil</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.user}{esPropio(u) && <span className="text-muted"> (vos)</span>}</td>
                <td><Badge bg={u.esAdmin ? 'dark' : 'secondary'}>{u.profile}</Badge></td>
                <td className="text-end text-nowrap">
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => abrir(u)}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setAEliminar(u)} disabled={esPropio(u)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={Boolean(form)} onHide={() => setForm(null)} centered>
        {form && (
          <Form onSubmit={guardar} noValidate>
            <Modal.Header closeButton>
              <Modal.Title as="h2" className="h5">{form.id ? `Editar ${form.user}` : 'Nuevo usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!form.id && (
                <Form.Group className="mb-3" controlId="usuario-user">
                  <Form.Label>Usuario *</Form.Label>
                  <Form.Control autoComplete="off" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} />
                </Form.Group>
              )}
              <Form.Group className="mb-3" controlId="usuario-perfil">
                <Form.Label>Perfil</Form.Label>
                <Form.Select
                  value={form.profile}
                  disabled={form.id === actual.id}
                  onChange={(e) => setForm({ ...form, profile: e.target.value as Perfil })}
                >
                  <option value={PERFILES.USER}>user (pacientes e intervenciones)</option>
                  <option value={PERFILES.ADMIN}>admin (catálogos y usuarios)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="usuario-password">
                <Form.Label>{form.id ? 'Contraseña nueva' : 'Contraseña *'}</Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  placeholder={form.id ? 'Dejala vacía para no cambiarla' : ''}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Form.Group>
              <ListaErrores errores={errores} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setForm(null)}>Cancelar</Button>
              <Button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>

      <Modal show={Boolean(aEliminar)} onHide={() => setAEliminar(null)} centered>
        <Modal.Body>¿Eliminar el usuario {aEliminar && aEliminar.user}? Ya no va a poder ingresar.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setAEliminar(null)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminar}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Aviso texto={aviso.texto} variante={aviso.variante} onClose={() => setAviso({ texto: '' })} />
    </section>
  );
}

export default Usuarios;
